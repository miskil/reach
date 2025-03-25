import React, { useState } from "react";
import { useUser } from "@/lib/auth";

interface SectionHeaderProps {
  preview: boolean;
  initialBackgroundColor?: string;
  initialHeaderText?: string;
  onBackgroundColorChange?: (color: string) => void;
  onHeaderTextChange?: (text: string) => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  preview,
  initialBackgroundColor = "#ffffff",
  initialHeaderText = "Section Header",
  onBackgroundColorChange,
  onHeaderTextChange,
}) => {
  const [backgroundColor, setBackgroundColor] = useState(
    initialBackgroundColor
  );
  const [headerText, setHeaderText] = useState(initialHeaderText);
  const { modifyMode } = useUser();

  const handleBackgroundColorChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const color = e.target.value;
    setBackgroundColor(color);
    if (onBackgroundColorChange) {
      onBackgroundColorChange(color);
    }
  };

  const handleHeaderTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setHeaderText(text);
    if (onHeaderTextChange) {
      onHeaderTextChange(text);
    }
  };

  return (
    <div className="w-full" style={{ backgroundColor }}>
      {modifyMode ? (
        <div className="p-4">
          <input
            type="color"
            value={backgroundColor}
            onChange={handleBackgroundColorChange}
            className="mb-2"
          />
          <input
            type="text"
            value={headerText}
            onChange={handleHeaderTextChange}
            className="w-full p-2 border border-gray-300 bg-white text-black rounded"
            placeholder="Enter section header text"
          />
        </div>
      ) : (
        <div className="p-4">
          <h1 className="text-2xl font-bold">{headerText}</h1>
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
