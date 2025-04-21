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
      event.target.files = null;
      event.target.value = "";
    }
  };

  return (
    <div>
      <button type="button" onClick={handleButtonClick}>
        <div className="bg-transparent text-grey px-2 py-1">
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
