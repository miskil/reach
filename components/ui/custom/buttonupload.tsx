import React, { useRef } from "react";

interface ButtonUploadProps {
  ButtonComponent: React.ComponentType;
  onFileUpload: (file: File) => void;
}

const ButtonUpload: React.FC<ButtonUploadProps> = ({
  ButtonComponent,
  onFileUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileUpload(event.target.files[0]);
    }
  };

  return (
    <div>
      <button type="button" onClick={handleButtonClick}>
        <ButtonComponent />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ButtonUpload;
