"use client";
import { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import { useUser } from "@/lib/auth";

interface TextEditorProps {
  siteId: string;
  initialContent: string;
  preview: boolean;
  onUpdate: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  siteId,
  initialContent,
  preview,
  onUpdate,
}) => {
  const editor = useRef(null);
  const [content, setContent] = useState<string>(initialContent);
  const { user, setUser, adminMode, setAdminMode } = useUser();

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const config = useMemo(
    //  Using of useMemo while make custom configuration is strictly recomended
    () => ({
      //  if you don't use it the editor will lose focus every time when you make any change to the editor, even an addition of one character
      /* Custom image uploader button configuretion to accept image and convert it to base64 format */

      readonly: !adminMode && preview,
      placeholder: "Type here...",

      uploader: {
        insertImageAsBase64URI: true,
        imagesExtensions: ["jpg", "png", "jpeg", "gif", "svg", "webp"], // this line is not much important , use if you only strictly want to allow some specific image format
      },
    }),
    []
  );

  const handleUpdate = (newContent: string) => {
    setContent(newContent);
    onUpdate(newContent);
  };

  return (
    // Adjust the styles as necessary
    <div>
      {adminMode && preview ? (
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
