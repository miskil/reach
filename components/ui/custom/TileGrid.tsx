import React, { useState } from "react";
import ButtonUpload from "./buttonupload"; // Adjust the import path as necessary
import ButtonDelete from "./buttondelete"; // Ensure this path is correct
import { Tile } from "@/lib/types"; // Adjust the import path as necessary
import Link from "next/link";

import {
  Image as ImageIcon,
  Trash2,
  SquarePlus,
  ImageUp,
  HeartHandshake,
  ScanBarcode,
  ExternalLink as Share,
  X,
} from "lucide-react"; // Adjust the import path as necessary

import { useUser } from "@/lib/auth";

interface TileGridProps {
  siteId: string;
  pageName?: string;
  idxComponent?: number;
  idxTile?: number;
  initialTiles: Tile[];

  onTilesUpdate: (tiles: Tile[]) => void;

  addImageUrlToBeDeleted: (imageUrl: string) => void;
}

const TileGrid: React.FC<TileGridProps> = ({
  siteId,
  pageName,
  idxComponent,
  idxTile,
  initialTiles,

  onTilesUpdate,

  addImageUrlToBeDeleted,
}) => {
  const [tiles, setTiles] = useState<Tile[]>(initialTiles);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { modifyMode } = useUser();

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
  const handleTitleChange = (index: number, text: string) => {
    const updatedTile: Tile = { ...tiles[index], Title: text };
    handleTileUpdate(index, updatedTile);
  };

  const handleDeleteTile = (index: number) => {
    if (tiles[index].image) {
      addImageUrlToBeDeleted(tiles[index].image);
    }
    const updatedTiles = tiles.filter((_, i) => i !== index);
    setTiles(updatedTiles);
    onTilesUpdate(updatedTiles);
  };
  const handleDeleteTileImage = async (index: number) => {
    if (tiles[index].image) {
      addImageUrlToBeDeleted(tiles[index].image);
      const updatedTile: Tile = { ...tiles[index], image: "" };
      handleTileUpdate(index, updatedTile);
    }
  };

  const handleImageUpload = async (file: File, index: number) => {
    if (tiles[index].image) {
      addImageUrlToBeDeleted(tiles[index].image);
    }
    const imageURL = URL.createObjectURL(file);

    if (!imageURL) return;

    const updatedTile: Tile = {
      ...tiles[index],
      image: imageURL,
      imageFile: file,
    };
    handleTileUpdate(index, updatedTile);
  };

  const handleAddTile = () => {
    const newTile: Tile = {
      id: Date.now(),
      image: "",
      text: "",
      type: "",
    };
    const updatedTiles = [...tiles, newTile];
    setTiles(updatedTiles);
    onTilesUpdate(updatedTiles);
  };

  const handleTypeChange = (index: number, type: string) => {
    const updatedTile: Tile = { ...tiles[index], type };
    handleTileUpdate(index, updatedTile);
  };
  const handleLinkChange = (index: number, more: string) => {
    // Handle link change logic
    const updatedTile: Tile = { ...tiles[index], moreUrl: more };
    handleTileUpdate(index, updatedTile);
  };
  const handleMoreButtonTextChange = (index: number, buttonText: string) => {
    const updatedTile: Tile = { ...tiles[index], moreButtonText: buttonText };
    handleTileUpdate(index, updatedTile);
  };
  const tilesToDisplay =
    idxComponent !== undefined && idxTile !== undefined
      ? [tiles[idxTile]]
      : tiles;

  return (
    <div
      className={`text-sm ${
        modifyMode ? "border border-gray-300 border-dashed p-4" : ""
      } rounded`}
    >
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {tilesToDisplay.map((tile, index) => (
          <div
            key={tile.id}
            className="flex flex-col items-center w-full max-w-lg mx-auto  justify-end pb-4 shadow-lg bg-white relative"
          >
            {modifyMode && (
              <button
                className="absolute top-0 right-0 p-2  text-black rounded z-10"
                onClick={() => handleDeleteTile(index)}
              >
                <X />
              </button>
            )}
            {tile.Title && (
              <h2 className="text-2xl font-bold  bg-blue-300 w-full text-white p-2 text-center">
                {tile.Title}
              </h2>
            )}
            {modifyMode && (
              <input
                type="text"
                placeholder="Enter title"
                value={tile.Title || ""}
                onChange={(e) => handleTitleChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 bg-white rounded mt-2"
              />
            )}
            {tile.image ? (
              <div className="flex-grow relative  w-full overflow-hidden h-80">
                <img
                  src={tile.image}
                  alt={`Tile ${index}`}
                  className="object-cover object-top min-w-full h-full w-full block"
                />
                {/* Image Buttons */}
                {modifyMode && (
                  <div className="absolute bottom-0  left-1/2 transform -translate-x-1/2 w-2/3 flex justify-center gap-1 mb-1  rounded bg-white/50 text-black rounded-3xl">
                    <ButtonUpload
                      ButtonComponent={ImageUp}
                      onFileUpload={(file) => handleImageUpload(file, index)}
                    />
                    <div>
                      <button
                        className="text-black-500"
                        onClick={() => handleDeleteTileImage(index)}
                      >
                        <div className="bg-transparent text-grey px-2 py-1">
                          <X />
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {modifyMode && (
                  <div className="relative">
                    <ButtonUpload
                      ButtonComponent={ImageUp}
                      onFileUpload={(file) => handleImageUpload(file, index)}
                    />
                  </div>
                )}
              </div>
            )}
            {/* Image Buttons */}
            {modifyMode ? (
              <div className="pt-2">
                <textarea
                  value={tile.text}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  className="w-full  border border-gray-300 rounded bg-white text-black text-lg "
                />

                <div className="flex justify-between w-full items-center border-t pt-2">
                  <input
                    type="text"
                    placeholder="more..."
                    value={tile.moreButtonText || ""}
                    onChange={(e) =>
                      handleMoreButtonTextChange(index, e.target.value)
                    }
                    className="w-1/4 p-2 border border-gray-300 bg-white rounded mt-2"
                  />
                  <input
                    type="text"
                    placeholder="More Link"
                    value={tile.moreUrl || ""}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 bg-white rounded mt-2"
                  />
                </div>
                {/* Bottom Row */}
                <div className="flex justify-between w-full items-center border-t pt-2">
                  <button className="p-2 text-black rounded">
                    <Share />
                  </button>

                  <select
                    className="bg-white border border-gray-300 rounded p-2 text-xs"
                    value={tile.type || "info"}
                    onChange={(e) => handleTypeChange(index, e.target.value)}
                  >
                    <option value="">Type</option>
                    <option value="event">Event</option>
                    <option value="info">Info</option>
                    <option value="project">Project</option>
                    <option value="product">Product</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <p className="text-lg">{tile.text}</p>
                <div className="flex justify-center mt-2">
                  {tile.moreUrl && (
                    <a
                      href={tile.moreUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                      className=" h-6 w-12 text-xs bg-blue-500 text-white rounded"
                    >
                      {tile.moreButtonText || "more..."}
                    </a>
                  )}
                </div>
                <div className="flex justify-between w-full items-center  pt-2">
                  <Link
                    href={`/${siteId}/${pageName}/tile/${idxComponent}/${
                      idxTile !== undefined ? idxTile : index
                    }`}
                  >
                    <button className="p-2 text-black rounded">
                      <Share />
                    </button>
                  </Link>

                  {tile.type === "product" && (
                    <button className="p-2 bg-green-500 text-white rounded">
                      <ScanBarcode />
                    </button>
                  )}
                  {tile.type === "project" && (
                    <button className="p-2 bg-red-500 text-white rounded">
                      <HeartHandshake />
                    </button>
                  )}

                  {/* More Button with Modal */}
                </div>
              </div>
            )}

            {/* Image */}
          </div>
        ))}
        {modifyMode && (
          <div className="p-4 border border-gray-300 rounded flex items-center justify-center h-48">
            <button onClick={handleAddTile} className="p-2  rounded">
              <SquarePlus className="h-12 w-12" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TileGrid;
