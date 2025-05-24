"use client";
import { useState, useRef, useMemo, useEffect } from "react";
import { useUser } from "@/lib/auth";

import RichEditor from "./richEditor";
import RichTextPreview from "./RichTextPreview";

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
        <RichEditor
          id="1" // remount per block
          initialContent={content}
          onChange={(html: string) => handleUpdate(html)}
        />
      ) : (
        <RichTextPreview html={content} />
      )}
    </div>
  );
};

export default TextEditor;
