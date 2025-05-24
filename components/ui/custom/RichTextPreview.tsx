import React from "react";

interface richPreviewProps {
  html: string;
  contentStyle?: React.CSSProperties;
  width?: string;
  height?: string;
  className?: string;
  editorBodyClassName?: string;
}

const RichTextPreview: React.FC<richPreviewProps> = ({
  html,
  contentStyle,
  width,
  height,
  className,
}) => {
  return (
    <div
      className={className}
      style={contentStyle}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
export default RichTextPreview;
