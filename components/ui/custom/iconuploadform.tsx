import React, { useState, useRef } from "react";

type IconUploadFormProps = {
  currentIconUrl?: string; // URL of the previously uploaded icon
  onIconUpload: (file: File) => void; // Callback to handle icon upload
};

export default function IconUploadForm({
  currentIconUrl,
  onIconUpload,
}: IconUploadFormProps) {
  const [preview, setPreview] = useState<string | null>(currentIconUrl || null); // Show either the previous or new icon
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Create a temporary preview URL
    }
  };

  const handleUpload = () => {
    if (file) {
      onIconUpload(file);
      console.log("File uploaded:", file);
    } else {
      alert("No file selected!");
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(currentIconUrl || null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload Site Icon</h2>

      {/* Preview Section */}
      {preview ? (
        <div className="flex flex-col items-center">
          <img
            src={preview}
            alt="Preview of uploaded icon"
            className="w-24 h-24 rounded-full object-cover border mb-4"
          />
          <button
            onClick={clearSelection}
            className="text-sm text-red-600 hover:underline"
          >
            Remove & Reset
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-gray-500 mb-4">No icon uploaded yet.</p>
        </div>
      )}

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-gray-100 file:text-blue-600 hover:file:bg-blue-50 mb-4"
      />

      {/* Submit Button */}
      <button
        onClick={handleUpload}
        disabled={!file}
        className={`w-full py-2 px-4 text-white font-semibold rounded-md shadow ${
          file
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {file ? "Upload Icon" : "Select a File First"}
      </button>
    </div>
  );
}
