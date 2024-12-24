import React, { useState } from "react";
import ButtonUpload from "../../components/ui/custom/buttonupload"; // Adjust the import path as necessary
import { uploadImage, deleteImage } from "../../lib/actions"; // Import the server action
import { Image as ImageIcon } from "lucide-react"; // Adjust the import path as necessary

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tiles.map((tile, index) => (
          <div key={tile.id} className="p-0 border border-gray-300 rounded">
            <div className="mb-4">
              {tile.image ? (
                <div>
                  <img
                    src={tile.image}
                    alt={`Tile ${index}`}
                    className="w-full h-auto"
                  />
                  {adminMode && (
                    <div className="flex justify-between mt-2">
                      <ButtonUpload
                        ButtonComponent={ImageIcon}
                        onFileUpload={(file) => handleImageUpload(file, index)}
                      />
                      <button
                        className="text-red-500"
                        onClick={() => handleDeleteTile(index)}
                      >
                        Delete
                      </button>
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
                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
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
