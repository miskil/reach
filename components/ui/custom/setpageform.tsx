"use client";
import React, { useState } from "react";

interface UploadedItem {
  type: string;
  file?: File;
  text?: string;
}

interface SetPageFormProps {
  siteid: string;
}

const SetPageForm: React.FC<SetPageFormProps> = ({ siteid }) => {
  const [menuItems, setMenuItems] = useState<string[]>([
    "Home",
    "About",
    "Contact",
  ]);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [newMenuItem, setNewMenuItem] = useState("");
  const [selectedContentType, setSelectedContentType] = useState("");
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);
  const [currentText, setCurrentText] = useState("");

  const handleMenuItemChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedMenuItem(event.target.value);
  };

  const handleNewMenuItemChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewMenuItem(event.target.value);
  };

  const handleAddMenuItem = () => {
    if (newMenuItem.trim() && !menuItems.includes(newMenuItem)) {
      setMenuItems([...menuItems, newMenuItem]);
      setSelectedMenuItem(newMenuItem);
      setNewMenuItem("");
    }
  };

  const handleContentTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedContentType(event.target.value);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setUploadedItems([...uploadedItems, { type: selectedContentType, file }]);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentText(event.target.value);
  };

  const handleAddText = () => {
    if (currentText.trim()) {
      setUploadedItems([
        ...uploadedItems,
        { type: selectedContentType, text: currentText },
      ]);
      setCurrentText("");
    }
  };

  const handleDeleteItem = (index: number) => {
    setUploadedItems(uploadedItems.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 bg-white text-black">
      <form
        action="upinsertpage"
        method="post"
        className="bg-white p-4 shadow-md z-10"
      >
        <input type="hidden" name="siteid" value={siteid} />
        <div className="sm:flex sm:justify-between">
          <div className="mb-4">
            <label htmlFor="menuItem" className="block mb-2">
              Select Menu Item:
            </label>
            <select
              id="menuItem"
              name="menuItem"
              value={selectedMenuItem}
              onChange={handleMenuItemChange}
              className="p-2 border border-gray-300 bg-white text-black w-full"
            >
              <option value="">Select an option</option>
              {menuItems.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="newMenuItem" className="block mb-2">
              Add New Menu Item:
            </label>
            <div className="flex">
              <input
                type="text"
                id="newMenuItem"
                value={newMenuItem}
                onChange={handleNewMenuItemChange}
                placeholder="Enter new menu item"
                className="p-2 border border-gray-300 bg-white text-black flex-1"
              />
              <button
                type="button"
                onClick={handleAddMenuItem}
                className="ml-2 p-2 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>

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
              <button
                type="button"
                onClick={() => handleDeleteItem(index)}
                className="ml-2 p-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label htmlFor="contentType" className="block mb-2">
            Select Content Type:
          </label>
          <select
            id="contentType"
            value={selectedContentType}
            onChange={handleContentTypeChange}
            className="p-2 border border-gray-300 bg-white text-black w-full"
          >
            <option value="">Select an option</option>
            <option value="banner">Banner</option>
            <option value="card">Card</option>
            <option value="image">Image</option>
            <option value="text">Text</option>
            <option value="video">Video</option>
          </select>
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

        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>

      <div className="mt-32">{/* Additional content can go here */}</div>
    </div>
  );
};

export default SetPageForm;
