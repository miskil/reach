"use client";
import { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";

interface TextEditorProps {
  siteId: string;
  initialContent: string;
  adminMode: boolean;
  onUpdate: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  siteId,
  initialContent,
  adminMode,
  onUpdate,
}) => {
  const editor = useRef(null);
  const [content, setContent] = useState<string>(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const config = {
    height: 700,
    readonly: !adminMode,
    placeholder: "Type here...",
  };

  const handleUpdate = (newContent: string) => {
    setContent(newContent);
    onUpdate(newContent);
  };

  return (
    // Adjust the styles as necessary
    <div>
      {adminMode ? (
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          onBlur={handleUpdate} // Save content on blur
          onChange={(newContent) => handleUpdate(newContent)}
        />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      )}
    </div>
  );
};

export default TextEditor;
