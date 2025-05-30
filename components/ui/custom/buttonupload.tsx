import React, { useRef } from "react";
import heic2any from "heic2any";

const convertHEICtoJPG = async (file: File): Promise<File> => {
  const convertedBlob = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.8,
  });

  return new File(
    [convertedBlob as Blob],
    file.name.replace(/\.heic$/i, ".jpg"),
    {
      type: "image/jpeg",
    }
  );
};

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

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      let uploadFile = event.target.files[0];

      if (event.target.files[0].name.toLowerCase().endsWith(".heic")) {
        try {
          uploadFile = await convertHEICtoJPG(event.target.files[0]);
          // Now upload `convertedFile` instead of `file`
          onFileUpload(uploadFile);
          event.target.value = "";
        } catch (err) {
          console.error("HEIC conversion failed", err);
          return;
        }
      } else {
        onFileUpload(event.target.files[0]);
        event.target.value = "";
      }
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
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ButtonUpload;
