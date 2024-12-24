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
        <div className="bg-gray-200 rounded-full p-2">
          <ButtonComponent />
        </div>
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
