import React, { useState } from "react";
import { useUser } from "@/lib/auth";
import { SectionHeader as SectionHeaderType } from "@/lib/types"; // Adjust the import path as necessary

interface SectionHeaderProps {
  initialBackgroundColor?: string;
  initialTextColor: string;
  initialHeaderText: string;
  onSectionHeaderChange: (sectionHeader: SectionHeaderType) => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  initialBackgroundColor, // Default background color
  initialTextColor, // Default text color
  initialHeaderText, // Default header text
  onSectionHeaderChange,
}) => {
  const [backgroundColor, setBackgroundColor] = useState(
    initialBackgroundColor
  );
  const [textColor, setTextColor] = useState(initialTextColor);
  const [headerText, setHeaderText] = useState(initialHeaderText);

  const { modifyMode } = useUser();

  const handleBackgroundColorChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const color = e.target.value;
    setBackgroundColor(color);
    if (onSectionHeaderChange) {
      onSectionHeaderChange({
        backgroundColor: color || "", // Ensure a default value
        textColor,
        headerText,
      });
    }
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setTextColor(color);
    if (onSectionHeaderChange) {
      onSectionHeaderChange({
        backgroundColor: backgroundColor || "", // Ensure a default value
        textColor: color,
        headerText,
      });
    }
  };

  const handleHeaderTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setHeaderText(text);
    if (onSectionHeaderChange) {
      onSectionHeaderChange({
        backgroundColor: backgroundColor || "",
        textColor,
        headerText: text,
      });
    }
  };

  return (
    <div
      className={`w-full border rounded ${
        modifyMode ? "border-dashed" : "border-solid"
      }`}
    >
      {modifyMode ? (
        <div className="p-4">
          {/* Background Color Picker */}

          {/* Header Text Input */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Header Text:
          </label>
          <input
            type="text"
            value={headerText}
            onChange={handleHeaderTextChange}
            className="w-full p-2 border border-gray-300 rounded"
            style={{ backgroundColor: backgroundColor, color: textColor }} // Dynamically set background and text color
            placeholder="Enter section header text"
          />
          <div className="flex items-center mb-4">
            <label className="text-sm font-medium text-gray-700 mr-2">
              Background Color:
            </label>
            <input
              type="color"
              value={backgroundColor}
              onChange={handleBackgroundColorChange}
              className="rounded"
            />

            <label className="text-sm font-medium text-gray-700 mr-2">
              Text Color:
            </label>
            <input
              type="color"
              value={textColor}
              onChange={handleTextColorChange}
              className=" rounded"
            />
          </div>
        </div>
      ) : (
        <div>
          <h1
            className="text-2xl font-bold w-full h-12 flex items-center pl-2"
            style={{ backgroundColor: backgroundColor, color: textColor }}
          >
            {headerText}
          </h1>
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
