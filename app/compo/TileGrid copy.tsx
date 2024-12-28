import React, { useState } from "react";
import ButtonUpload from "../../components/ui/custom/buttonupload"; // Adjust the import path as necessary
import ButtonDelete from "../../components/ui/custom/buttondelete"; // Ensure this path is correct

import { uploadImage, deleteImage } from "../../lib/actions"; // Import the server action
import { Image as ImageIcon, Trash2 } from "lucide-react"; // Adjust the import path as necessary

interface Tile {
  id: number;
  image: string;
  text: string;
}

interface TileGridProps {
  initialTiles: Tile[];
  adminMode: boolean;
  onTilesUpdate: (tiles: Tile[]) => void;
}

const TileGrid: React.FC<TileGridProps> = ({
  initialTiles,
  adminMode,
  onTilesUpdate,
}) => {
  const [tiles, setTiles] = useState<Tile[]>(initialTiles);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTileUpdate = (index: number, updatedTile: Tile) => {
    const updatedTiles = tiles.map((tile, i) =>
      i === index ? updatedTile : tile
    );
    setTiles(updatedTiles);
    onTilesUpdate(updatedTiles);
  };

  const handleTextChange = (index: number, text: string) => {
    const updatedTile: Tile = { ...tiles[index], text };
    handleTileUpdate(index, updatedTile);
  };

  const handleDeleteTile = (index: number) => {
    const updatedTiles = tiles.filter((_, i) => i !== index);
    setTiles(updatedTiles);
  };

  const handleImageUpload = async (file: File, index: number) => {
    setErrorMessage(null); // Reset error message before starting the upload

    if (file) {
      try {
        if (file.size > 1024 * 1024) {
          throw new Error("File size exceeds 1MB");
        }
        const formData = new FormData();
        formData.append("file", file);
        const imageURL = await uploadImage(file); // Call the server action

        if (!imageURL) {
          throw new Error("Failed to upload image");
        }

        const updatedTile: Tile = { ...tiles[index], image: imageURL };
        handleTileUpdate(index, updatedTile);
      } catch (error) {
        //console.error("Failed to upload image:", error);
        setErrorMessage(
          `Error: ${(error as any).code || "Unknown"} - ${
            (error as any).message || "Failed to upload image."
          }`
        );
      }
    }
  };

  const handleAddTile = () => {
    const newTile: Tile = { id: Date.now(), image: "", text: "" };
    const updatedTiles = [...tiles, newTile];
    setTiles(updatedTiles);
    onTilesUpdate(updatedTiles);
  };

  return (
    <div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {tiles.map((tile, index) => (
          <div
            key={tile.id}
            className="p-0  border border-gray-300 rounded-3xl relative group"
          >
            <div className="mb-4">
              {tile.image ? (
                <div className="relative">
                  <img
                    src={tile.image}
                    alt={`Tile ${index}`}
                    className="w-full h-auto rounded-3xl"
                  />
                  {adminMode && (
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-start mt-2 group-hover:flex hidden">
                      <div className="relative group">
                        <ButtonUpload
                          ButtonComponent={ImageIcon}
                          onFileUpload={(file) =>
                            handleImageUpload(file, index)
                          }
                        />
                        <span className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100">
                          Upload Image
                        </span>
                      </div>
                      <div className="relative group">
                        <button
                          className="text-black-500"
                          onClick={() => handleDeleteTile(index)}
                        >
                          <div className="bg-gray-200 rounded-full p-2">
                            <Trash2 />
                          </div>
                        </button>
                        <span className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100">
                          Delete Image
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                adminMode && (
                  <ButtonUpload
                    ButtonComponent={ImageIcon}
                    onFileUpload={(file) => handleImageUpload(file, index)}
                  />
                )
              )}
            </div>
            {adminMode ? (
              <textarea
                value={tile.text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-white text-black rounded-3xl"
              />
            ) : (
              <p>{tile.text}</p>
            )}
          </div>
        ))}
        {adminMode && (
          <div className="p-4 border border-gray-300 rounded flex items-center justify-center h-48">
            <button
              onClick={handleAddTile}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Add Tile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TileGrid;
