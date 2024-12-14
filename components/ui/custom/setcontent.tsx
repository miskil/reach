"use client";
import React, { useState, useRef } from "react";
import {
  Trash2,
  ImageUp,
  Image,
  Film,
  LetterText,
  GalleryThumbnails,
  CirclePlus,
} from "lucide-react";

interface UploadedItem {
  type: string;
  file?: File;
  text?: string;
}

interface SetPageFormProps {
  siteid: string;
}

const SetContent: React.FC<SetPageFormProps> = ({ siteid }) => {
  const [selectedContentType, setSelectedContentType] = useState("");
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);
  const [currentText, setCurrentText] = useState("");

  const [isSelectContentOpen, setSelectContentOpen] = useState(false);
  const contentUploadRef = useRef<HTMLInputElement>(null);

  const handleContentTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedContentType(event.target.value);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setUploadedItems([{ type: selectedContentType, file }]);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentText(event.target.value);
  };

  const handleAddText = () => {
    if (currentText.trim()) {
      setUploadedItems([{ type: selectedContentType, text: currentText }]);
      setCurrentText("");
    }
  };

  const handleDeleteItem = () => {
    setUploadedItems([]);
  };
  const handleSelectContent = () => {
    setSelectContentOpen(!isSelectContentOpen);
  };

  return (
    <div className="p-4 bg-white text-black">
      <form
        action="upinsertpage"
        method="post"
        className="bg-white p-4 shadow-md z-10"
      >
        <input type="hidden" name="siteid" value={siteid} />

        <div className="mt-4">
          {uploadedItems.map((item, index) => (
            <div
              key={index}
              className="mb-4 bg-white text-black flex items-center"
            >
              {item.type === "banner" ||
              item.type === "image" ||
              item.type === "video" ? (
                <div className="flex-1">
                  <p>Uploaded {item.type}:</p>
                  {item.type === "video" ? (
                    <video
                      controls
                      src={URL.createObjectURL(item.file!)}
                      className="w-full h-auto"
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(item.file!)}
                      alt={item.type}
                      className="w-full h-auto"
                    />
                  )}
                </div>
              ) : item.type === "text" ? (
                <div className="flex-1">
                  <p>{item.text}</p>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label htmlFor="contentType" className="block mb-2">
            Select Content Type:
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleContentTypeChange("banner")}
              className="p-2 bg-blue-500 text-white rounded"
            >
              <GalleryThumbnails />
            </button>
            <button
              type="button"
              onClick={() => handleContentTypeChange("image")}
              className="p-2 bg-blue-500 text-white rounded"
            >
              <Image />
            </button>
            <button
              type="button"
              onClick={() => handleContentTypeChange("text")}
              className="p-2 bg-blue-500 text-white rounded"
            >
              <LetterText />
            </button>
            <button
              type="button"
              onClick={() => handleContentTypeChange("video")}
              className="p-2 bg-blue-500 text-white rounded"
            >
              <Film />
            </button>
          </div>
        </div>
        {selectedContentType === "text" ? (
          <div className="mb-4">
            <label htmlFor="text" className="block mb-2">
              Enter Text:
            </label>
            <div className="flex">
              <textarea
                id="text"
                value={currentText}
                onChange={handleTextChange}
                className="p-2 border border-gray-300 w-full bg-white text-black"
              />
              <button
                type="button"
                onClick={handleAddText}
                className="ml-2 p-2 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        ) : selectedContentType ? (
          <div className="mb-4">
            <label htmlFor="upload" className="block mb-2">
              Upload {selectedContentType}:
            </label>
            <input
              type="file"
              id="upload"
              onChange={handleFileUpload}
              className="p-2 border border-gray-300 bg-white text-black"
            />
          </div>
        ) : null}
      </form>

      <div className="mt-32">{/* Additional content can go here */}</div>
    </div>
  );
};

export default SetContent;
