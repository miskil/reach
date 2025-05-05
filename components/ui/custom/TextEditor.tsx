"use client";
import { useState, useRef, useMemo, useEffect } from "react";
import { useUser } from "@/lib/auth";
import dynamic from "next/dynamic";
const ReactQuill: any = dynamic(() => import("react-quill-new"), {
  ssr: false,
});
import "react-quill-new/dist/quill.snow.css";

interface TextEditorProps {
  siteId: string;
  initialContent: string;

  onUpdate: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  siteId,
  initialContent,

  onUpdate,
}) => {
  const editor = useRef(null);
  const [content, setContent] = useState<string>(initialContent);
  const { modifyMode } = useUser();
  console.log("modifyMode in TextEditor", modifyMode);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  /* ─────────────── quill toolbar ─────────────── */
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      ["link", "blockquote", "code-block"],
      [{ color: ["#f00", "#0f0", "#00f", "#ff0"] }, { background: [] }],
      ["image"],
    ],
  };

  const handleUpdate = (newContent: string) => {
    setContent(newContent);
    onUpdate(newContent);
  };

  return (
    // Adjust the styles as necessary
    <div>
      {modifyMode ? (
        <ReactQuill
          value={content}
          onChange={(html: string) => handleUpdate(html)}
          modules={modules}
          readOnly={!modifyMode}
        />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      )}
    </div>
  );
};

export default TextEditor;
