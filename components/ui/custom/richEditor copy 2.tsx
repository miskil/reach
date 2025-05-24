"use client";

import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useCallback,
} from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  List,
  ListOrdered,
  Upload,
  PaintBucket,
  Type,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

const ColorButton = ({
  onChange,
  icon,
}: {
  onChange: (color: string) => void;
  icon: React.ReactNode;
}) => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        const selection = window.getSelection();
        const savedRange = selection?.rangeCount
          ? selection.getRangeAt(0)
          : null;

        const handleColor = (e: Event) => {
          const input = e.target as HTMLInputElement;
          if (savedRange) {
            selection?.removeAllRanges();
            selection?.addRange(savedRange);
          }
          onChange(input.value);
          input.removeEventListener("input", handleColor);
        };

        if (colorInputRef.current) {
          colorInputRef.current.click();
          colorInputRef.current.addEventListener("input", handleColor);
        }
      }}
      className="flex items-center gap-1"
    >
      {icon}
      <input ref={colorInputRef} type="color" className="hidden" />
    </button>
  );
};

export interface RichTextEditorHandle {
  getContent: () => string;
  getStyle: () => React.CSSProperties;
  setContent: (html: string) => void;
  setStyle: (style: React.CSSProperties) => void;
}

interface Props {
  id?: string;
  className?: string;
  editorBodyClassName?: string;
  onChange?: (html: string) => void;
  initialContent?: string;
  initialStyle?: React.CSSProperties; // ✅ New
  width?: string;
  height?: string;
  onBkgImageFileChange?: (file: File) => void;
}

const RichTextEditor = forwardRef<RichTextEditorHandle, Props>(
  (
    {
      id,
      className,
      editorBodyClassName,
      onChange,
      initialContent,
      initialStyle,
      width,
      height,
      onBkgImageFileChange,
    },
    ref
  ) => {
    const editorRef = useRef<HTMLDivElement>(null);
    let savedSelection: Range | null = null;

    const saveSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        savedSelection = selection.getRangeAt(0);
      }
    };

    const restoreSelection = () => {
      if (savedSelection) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(savedSelection);
      }
    };
    const [verticalAlign, setVerticalAlign] = React.useState("flex-start");
    const exec = useCallback((command: string, value?: string) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const editor = editorRef.current;
      if (!editor || !editor.contains(range.commonAncestorContainer)) return;

      editor.focus();
      restoreSelection();
      try {
        document.execCommand(command, false, value);
      } catch (err) {
        console.error(`Command ${command} failed`, err);
      }
    }, []);

    useImperativeHandle(ref, () => ({
      getContent: () => editorRef.current?.innerHTML || "",
      getStyle: () => {
        if (!editorRef.current) return {};
        const {
          backgroundColor,
          backgroundImage,
          backgroundSize,
          justifyContent,
        } = editorRef.current.style;
        return {
          backgroundColor,
          backgroundImage,
          backgroundSize,
          justifyContent,
        };
      },
      setContent: (html: string) => {
        if (editorRef.current) editorRef.current.innerHTML = html;
      },
      setStyle: (style: React.CSSProperties) => {
        if (editorRef.current) {
          Object.assign(editorRef.current.style, style);
          if (style.justifyContent) {
            setVerticalAlign(style.justifyContent); // update button state
          }
        }
      },
    }));

    useEffect(() => {
      if (editorRef.current) {
        if (initialContent) {
          editorRef.current.innerHTML = initialContent;
        }
        if (initialStyle) {
          Object.assign(editorRef.current.style, initialStyle); // ✅ Apply initial style
        }
      }
    }, [initialContent, initialStyle]);

    useEffect(() => {
      const handler = () => {
        if (onChange && editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      };
      const editor = editorRef.current;
      editor?.addEventListener("input", handler);
      return () => editor?.removeEventListener("input", handler);
    }, [onChange]);

    useEffect(() => {
      const editor = editorRef.current;
      if (!editor) return;

      const handleMouseUp = () => saveSelection();
      const handleKeyUp = () => saveSelection();

      editor.addEventListener("mouseup", handleMouseUp);
      editor.addEventListener("keyup", handleKeyUp);

      return () => {
        editor.removeEventListener("mouseup", handleMouseUp);
        editor.removeEventListener("keyup", handleKeyUp);
      };
    }, []);

    const applyBackground = (e: React.ChangeEvent<HTMLInputElement>) => {
      saveSelection(); // save before DOM mutation

      if (editorRef.current) {
        editorRef.current.style.backgroundColor = e.target.value;
      }
      restoreSelection(); // restore afterward
      if (onChange && editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    };

    const uploadBackground = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onBkgImageFileChange?.(file); // Call the prop function
        const reader = new FileReader();
        reader.onload = () => {
          if (editorRef.current) {
            editorRef.current.style.backgroundImage = `url(${reader.result})`;
            editorRef.current.style.backgroundSize = "cover";
            restoreSelection();
            if (onChange) onChange(editorRef.current.innerHTML);
          }
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div
        id={id}
        className={twMerge(
          "border rounded shadow bg-white dark:bg-gray-800 dark:text-white",
          width || "w-full",
          className
        )}
      >
        <div className="flex flex-wrap items-center gap-2 p-2 border-b bg-gray-50 dark:bg-gray-700">
          <select
            onChange={(e) => exec("fontName", e.target.value)}
            className="text-sm border rounded px-1"
          >
            {["Arial", "Times New Roman", "Courier New", "Verdana"].map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => exec("fontSize", e.target.value)}
            className="text-sm border rounded px-1"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <option key={s} value={s}>{`Size ${s}`}</option>
            ))}
          </select>
          <button onClick={() => exec("bold")}>
            <Bold size={16} />
          </button>
          <button onClick={() => exec("italic")}>
            <Italic size={16} />
          </button>
          <button onClick={() => exec("underline")}>
            <Underline size={16} />
          </button>
          <button onClick={() => exec("justifyLeft")}>
            <AlignLeft size={16} />
          </button>
          <button onClick={() => exec("justifyCenter")}>
            <AlignCenter size={16} />
          </button>
          <button onClick={() => exec("justifyRight")}>
            <AlignRight size={16} />
          </button>
          <div className="flex items-center gap-1 ml-2">
            <button
              title="Align Top"
              onClick={() => setVerticalAlign("flex-start")}
              className={twMerge(
                "p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600",
                verticalAlign === "flex-start" && "bg-gray-300 dark:bg-gray-700"
              )}
            >
              <AlignVerticalJustifyStart size={16} />
            </button>
            <button
              title="Align Center"
              onClick={() => setVerticalAlign("center")}
              className={twMerge(
                "p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600",
                verticalAlign === "center" && "bg-gray-300 dark:bg-gray-700"
              )}
            >
              <AlignVerticalJustifyCenter size={16} />
            </button>
            <button
              title="Align Bottom"
              onClick={() => setVerticalAlign("flex-end")}
              className={twMerge(
                "p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600",
                verticalAlign === "flex-end" && "bg-gray-300 dark:bg-gray-700"
              )}
            >
              <AlignVerticalJustifyEnd size={16} />
            </button>
          </div>
          <button onClick={() => exec("insertUnorderedList")}>
            <List size={16} />
          </button>
          <button onClick={() => exec("insertOrderedList")}>
            <ListOrdered size={16} />
          </button>
          <ColorButton
            onChange={(color) => exec("foreColor", color)}
            icon={<PaintBucket size={16} />}
          />
          <label className="cursor-pointer">
            <Type size={16} />
            <input type="color" className="hidden" onChange={applyBackground} />
          </label>
          <label className="cursor-pointer">
            <Upload size={16} />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={uploadBackground}
            />
          </label>
        </div>
        <div
          ref={editorRef}
          contentEditable
          className={twMerge(
            "p-3 outline-none w-full display: block focus:ring focus:ring-blue-200 dark:focus:ring-blue-500",
            height || "min-h-[200px]",
            editorBodyClassName
          )}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: verticalAlign, // <-- e.g., "flex-start", "center", or "flex-end"
            height: height || "200px", // optional if className handles height
          }}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";
export default RichTextEditor;
