// RichTextEditor.tsx
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
        e.preventDefault(); // prevent blur
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
  setContent: (html: string) => void;
}

interface Props {
  id?: string;
  className?: string;
  editorBodyClassName?: string;
  onChange?: (html: string) => void;
  initialContent?: string;
}

const RichTextEditor = forwardRef<RichTextEditorHandle, Props>(
  ({ id, className, editorBodyClassName, onChange, initialContent }, ref) => {
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
    useImperativeHandle(ref, () => ({
      getContent: () => editorRef.current?.innerHTML || "",
      setContent: (html: string) => {
        if (editorRef.current) editorRef.current.innerHTML = html;
      },
    }));

    useEffect(() => {
      if (initialContent && editorRef.current) {
        editorRef.current.innerHTML = initialContent;
      }
    }, [initialContent]);

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

    const exec = useCallback((command: string, value?: string) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const commonAncestor = range.commonAncestorContainer;

      // Ensure selection is within a block
      const isInsideBlock =
        commonAncestor.nodeType === 1 &&
        (commonAncestor as HTMLElement).closest("div, p, li");

      // If not inside any block, wrap it
      if (!isInsideBlock) {
        document.execCommand("formatBlock", false, "div");
      }

      document.execCommand(command, false, value);
    }, []);

    const applyColor = (e: React.ChangeEvent<HTMLInputElement>) => {
      exec("foreColor", e.target.value);
    };

    const applyBackground = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (editorRef.current) {
        editorRef.current.style.backgroundColor = e.target.value;
      }
    };

    const uploadBackground = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          if (editorRef.current) {
            editorRef.current.style.backgroundImage = `url(${reader.result})`;
            editorRef.current.style.backgroundSize = "cover";
          }
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div
        id={id}
        className={twMerge(
          "border rounded shadow bg-white dark:bg-gray-800 dark:text-white w-full",
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
            {" "}
            <Bold size={16} />{" "}
          </button>
          <button onClick={() => exec("italic")}>
            {" "}
            <Italic size={16} />{" "}
          </button>
          <button onClick={() => exec("underline")}>
            {" "}
            <Underline size={16} />{" "}
          </button>
          <button onClick={() => exec("justifyLeft")}>
            {" "}
            <AlignLeft size={16} />{" "}
          </button>
          <button onClick={() => exec("justifyCenter")}>
            {" "}
            <AlignCenter size={16} />{" "}
          </button>
          <button onClick={() => exec("justifyRight")}>
            {" "}
            <AlignRight size={16} />{" "}
          </button>
          <button onClick={() => exec("insertUnorderedList")}>
            {" "}
            <List size={16} />{" "}
          </button>
          <button onClick={() => exec("insertOrderedList")}>
            {" "}
            <ListOrdered size={16} />{" "}
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
            "p-3 outline-none w-full min-h-[200px] display: block focus:ring focus:ring-blue-200 dark:focus:ring-blue-500",
            editorBodyClassName
          )}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";
export default RichTextEditor;
