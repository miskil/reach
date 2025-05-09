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
  const editorId = `editor-${siteId}-text`;
  const modules = useMemo(
    () => ({
      toolbar: {
        container: `#${editorId}-toolbar`,
      },
    }),
    [editorId]
  );

  const handleUpdate = (newContent: string) => {
    setContent(newContent);
    onUpdate(newContent);
  };

  return (
    // Adjust the styles as necessary
    <div>
      {modifyMode ? (
        <>
          <div id={`${editorId}-toolbar`}>
            <span className="ql-formats">
              <select className="ql-header">
                <option value="1"></option>
                <option value="2"></option>
                <option></option>
              </select>
              <select className="ql-font"></select>
            </span>
            <span className="ql-formats">
              <button className="ql-bold"></button>
              <button className="ql-italic"></button>
              <button className="ql-underline"></button>
              <button className="ql-strike"></button>
            </span>
            <span className="ql-formats">
              <select className="ql-align"></select>
            </span>
            <span className="ql-formats">
              <button className="ql-list" value="ordered"></button>
              <button className="ql-list" value="bullet"></button>
            </span>
            <span className="ql-formats">
              <button className="ql-link"></button>
              <button className="ql-blockquote"></button>
              <button className="ql-code-block"></button>
            </span>
            <span className="ql-formats">
              <select className="ql-color"></select>
              <select className="ql-background"></select>
            </span>
            <span className="ql-formats">
              <button className="ql-image"></button>
            </span>
          </div>

          <ReactQuill
            value={content}
            onChange={(html: string) => handleUpdate(html)}
            modules={modules}
            readOnly={!modifyMode}
          />
        </>
      ) : (
        <div
          className="p-0 m-0 border-0"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      )}
    </div>
  );
};

export default TextEditor;
