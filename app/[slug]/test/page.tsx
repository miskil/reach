"use client";
import React, { useRef } from "react";

export function Page() {
  const currentIconUrl = "https://via.placeholder.com/150"; // Replace with your actual previously uploaded icon URL.

  const handleIconUpload = (file: File) => {
    // Mock API call or logic to upload the file
    console.log("Uploading file:", file);

    // Example: Replace the current icon URL after successful upload
    // Make sure to reset the state or trigger a re-fetch of the URL from your server
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <IconUploadForm
        currentIconUrl={currentIconUrl}
        onIconUpload={handleIconUpload}
      />
    </div>
  );
}
import { useState } from "react";

function IconUploadForm({ currentIconUrl, onIconUpload }) {
  const [iconUrl, setIconUrl] = useState(currentIconUrl);
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      // Mock API call to delete the existing icon
      console.log("Deleting existing icon:", iconUrl);

      // Mock API call to upload the new icon
      console.log("Uploading new icon:", file);
      const newIconUrl = URL.createObjectURL(file); // Replace with actual URL from server response

      // Update the icon URL state
      setIconUrl(newIconUrl);

      // Call the parent handler
      onIconUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {iconUrl && (
        <div className="flex flex-col items-center">
          <img src={iconUrl} alt="Current Icon" className="w-24 h-24" />
          <p>{iconUrl}</p>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <button
        onClick={handleButtonClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      >
        Change Icon
      </button>
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Handle Upload
      </button>
    </div>
  );
}

export default IconUploadForm;
