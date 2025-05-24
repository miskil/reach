"use client";

import React, { useRef, useState } from "react";
import RichTextEditor, {
  RichTextEditorHandle,
} from "@/components/ui/custom/richEditor";

export default function EditorWithLiveOutput() {
  const editorRef = useRef<RichTextEditorHandle>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [contentStyle, setContentStyle] = useState<React.CSSProperties>({});
  const [editorSize, setEditorSize] = useState({
    width: "w-[600px]",
    height: "h-[300px]",
  });
  const [outputSize, setOutputSize] = useState({
    width: "w-[600px]",
    height: "h-[300px]",
  });
  const handleSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      setHtmlContent(content);
      setContentStyle(editorRef.current.getStyle());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <label>
          Editor Width:
          <select
            className="ml-2 border px-2 py-1"
            onChange={(e) =>
              setEditorSize((prev) => ({ ...prev, width: e.target.value }))
            }
            value={editorSize.width}
          >
            <option value="w-[400px]">400px</option>
            <option value="w-[600px]">600px</option>
            <option value="w-full">Full</option>
          </select>
        </label>

        <label>
          Editor Height:
          <select
            className="ml-2 border px-2 py-1"
            onChange={(e) =>
              setEditorSize((prev) => ({ ...prev, height: e.target.value }))
            }
            value={editorSize.height}
          >
            <option value="h-[200px]">200px</option>
            <option value="h-[300px]">300px</option>
            <option value="h-[500px]">500px</option>
          </select>
        </label>
      </div>

      <RichTextEditor
        ref={editorRef}
        width={editorSize.width}
        height={editorSize.height}
      />

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Show Content Below
      </button>

      <div className="flex gap-4 items-center">
        <label>
          Output Width:
          <select
            className="ml-2 border px-2 py-1"
            onChange={(e) =>
              setOutputSize((prev) => ({ ...prev, width: e.target.value }))
            }
            value={outputSize.width}
          >
            <option value="w-[400px]">400px</option>
            <option value="w-[600px]">600px</option>
            <option value="w-full">Full</option>
          </select>
        </label>

        <label>
          Output Height:
          <select
            className="ml-2 border px-2 py-1"
            onChange={(e) =>
              setOutputSize((prev) => ({ ...prev, height: e.target.value }))
            }
            value={outputSize.height}
          >
            <option value="h-[200px]">200px</option>
            <option value="h-[300px]">300px</option>
            <option value="h-[500px]">500px</option>
          </select>
        </label>
      </div>

      <div className={`border rounded bg-gray-50 p-4 ${outputSize.width}`}>
        <h2 className="text-lg font-semibold mb-2">Rendered Content:</h2>
        <div
          className={`rounded p-3 overflow-auto border ${outputSize.height}`}
          style={contentStyle}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}
