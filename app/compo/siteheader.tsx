import React, { useState } from "react";

interface HeaderProps {
  adminMode: boolean;
  siteIcon: string;
  siteHeader: string;
  headerColor: string;
  backgroundColor: string;
  backgroundImage: string;
  onUpdate: (name: string, value: any) => void;
}
const SiteHeader: React.FC<HeaderProps> = ({
  adminMode,
  siteIcon,
  siteHeader,
  headerColor,
  backgroundColor,
  backgroundImage,
  onUpdate,
}) => {
  const [icon, setIcon] = useState(siteIcon);

  const [header, setHeader] = useState(siteHeader);
  const [color, setColor] = useState(headerColor);
  const [bgColor, setBgColor] = useState(backgroundColor);
  const [bgImage, setBgImage] = useState(backgroundImage);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [bgImageFile, setBgImageFile] = useState<File | null>(null);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      onUpdate("siteIconFile", file);
    }
  };

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setHeader(text);
    onUpdate("siteHeader", text);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setColor(color);
    onUpdate("headerColor", color);
  };

  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setBgColor(color);
    onUpdate(backgroundColor, color);
  };

  const handleBgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBgImageFile(file);
      onUpdate("backgroundImageFile", file);
    }
  };

  return (
    <header
      className="p-4"
      style={{
        backgroundColor: bgColor,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center">
        {adminMode ? (
          <div className="flex items-center">
            <input type="file" accept="image/*" onChange={handleIconChange} />
            {icon && (
              <img
                src={icon}
                alt="Site Icon"
                className="h-10 w-10 object-cover ml-2"
              />
            )}
          </div>
        ) : (
          <img src={icon} alt="Site Icon" className="h-10 w-10 object-cover" />
        )}
        <div className="ml-4">
          {adminMode ? (
            <input
              type="text"
              value={header}
              onChange={handleHeaderChange}
              style={{ color }}
              className="text-2xl font-bold"
            />
          ) : (
            <h1 style={{ color }} className="text-2xl font-bold">
              {header}
            </h1>
          )}
        </div>
      </div>
      {adminMode && (
        <div className="mt-4">
          <label className="block mb-2">Header Text Color</label>
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="mb-4"
          />
          <label className="block mb-2">Background Color</label>
          <input
            type="color"
            value={bgColor}
            onChange={handleBgColorChange}
            className="mb-4"
          />
          <label className="block mb-2">Background Image</label>
          <input type="file" accept="image/*" onChange={handleBgImageChange} />
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
