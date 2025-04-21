import React, { useState, useImperativeHandle, forwardRef } from "react";
import ButtonUpload from "./buttonupload";
import { Image } from "lucide-react"; // Adjust the import path as necessary

interface TileProps {
  initialImage: string;
  initialText: string;
  moreLink: string;
  display: boolean;
}

const Tile = forwardRef<any, TileProps>(
  ({ initialImage, initialText, moreLink, display }, ref) => {
    const [image, setImage] = useState<string | null>(initialImage);
    const [text, setText] = useState(initialText);

    useImperativeHandle(ref, () => ({
      getData: () => ({ image, text }),
    }));

    const handleFileUpload = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    };

    const handleTextChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      setText(event.target.value);
    };

    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 mb-4">
          {image ? (
            <img
              src={image}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
          ) : (
            !display && (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <ButtonUpload
                  ButtonComponent={Image}
                  onFileUpload={handleFileUpload}
                />
              </div>
            )
          )}
        </div>
        <div className="flex-1">
          {display ? (
            <p>{text}</p>
          ) : (
            <>
              <label htmlFor="text" className="block mb-2">
                Enter Text:
              </label>
              <textarea
                id="text"
                value={text}
                onChange={handleTextChange}
                className="p-2 border border-gray-300 w-full h-full bg-white text-black"
              />
            </>
          )}
        </div>
        <div className="mt-4">
          <a href={moreLink} className="text-blue-500 hover:underline">
            more...
          </a>
        </div>
      </div>
    );
  }
);

export default Tile;
