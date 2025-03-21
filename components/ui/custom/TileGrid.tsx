import React, { useState } from "react";
import ButtonUpload from "./buttonupload"; // Adjust the import path as necessary
import ButtonDelete from "./buttondelete"; // Ensure this path is correct
import { Tile } from "@/lib/types"; // Adjust the import path as necessary
import Link from "next/link";

import {
  Image as ImageIcon,
  Trash2,
  HeartHandshake,
  ScanBarcode,
  Share,
  X,
} from "lucide-react"; // Adjust the import path as necessary

import { useUser } from "@/lib/auth";

interface TileGridProps {
  siteId: string;
  pageName?: string;
  idxComponent?: number;
  idxTile?: number;
  initialTiles: Tile[];
  preview: boolean;

  onTilesUpdate: (tiles: Tile[]) => void;

  addImageUrlToBeDeleted: (imageUrl: string) => void;
}

const TileGrid: React.FC<TileGridProps> = ({
  siteId,
  pageName,
  idxComponent,
  idxTile,
  initialTiles,
  preview,
  onTilesUpdate,

  addImageUrlToBeDeleted,
}) => {
  const [tiles, setTiles] = useState<Tile[]>(initialTiles);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user, setUser, adminMode, setAdminMode } = useUser();

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
    <div className="text-sm">
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {tilesToDisplay.map((tile, index) => (
          <div
            key={tile.id}
            className="flex flex-col items-center w-full max-w-lg mx-auto  justify-end pb-4 shadow-lg bg-white relative"
          >
            {adminMode && preview && (
              <button
                className="absolute top-0 right-0 p-2  text-black rounded z-10"
                onClick={() => handleDeleteTile(index)}
              >
                <X />
              </button>
            )}
            {tile.image ? (
              <div className="flex-grow relative  w-full overflow-hidden h-80">
                <img
                  src={tile.image}
                  alt={`Tile ${index}`}
                  className="object-cover  object-top h-full w-full block"
                />
                {/* Image Buttons */}
                {adminMode && preview && (
                  <div className="absolute bottom-0  left-1/2 transform -translate-x-1/2 w-2/3 flex justify-center gap-1 mb-1  rounded bg-white/50 text-black rounded-3xl">
                    <ButtonUpload
                      ButtonComponent={ImageIcon}
                      onFileUpload={(file) => handleImageUpload(file, index)}
                    />
                    <div>
                      <button
                        className="text-black-500"
                        onClick={() => handleDeleteTileImage(index)}
                      >
                        <div className="bg-transparent text-grey px-2 py-1">
                          <Trash2 />
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {adminMode && preview && (
                  <div className="relative">
                    <ButtonUpload
                      ButtonComponent={ImageIcon}
                      onFileUpload={(file) => handleImageUpload(file, index)}
                    />
                  </div>
                )}
              </div>
            )}
            {/* Image Buttons */}
            {adminMode && preview ? (
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
                    <Link href={tile.moreUrl}>
                      <button className=" h-6 w-12 text-xs bg-blue-500 text-white rounded">
                        {tile.moreButtonText || "more..."}
                      </button>
                    </Link>
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
        {adminMode && preview && (
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

{
  /** 
          <div
            key={tile.id}
            className="p-0 border border-gray-300 rounded-3xl relative group"
          >
            <div className="mb-4">
              {tile.image && (
                <div className="relative">
                  <img
                    src={tile.image}
                    alt={`Tile ${index}`}
                    className="w-full h-auto rounded-3xl"
                  />
                </div>
              )}
              {adminMode && preview && (
                <div className="absolute top-0 left-0 right-0 flex items-center justify-start mt-2 hidden group-hover:flex">
                  {/* Upload Button 
                  <div className="pr-2 relative group">
                    <ButtonUpload
                      ButtonComponent={ImageIcon}
                      onFileUpload={(file) => handleImageUpload(file, index)}
                    />
                    {/** 
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100">
                      Upload Image
                    </span>
                    
                  </div>

                  {/* Delete Button 
                  <div className="relative group">
                    <button
                      className="text-black-500"
                      onClick={() => handleDeleteTile(index)}
                    >
                      <div className="bg-gray-200 rounded-full p-2">
                        <Trash2 />
                      </div>
                    </button>
                    {/** 
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100">
                      Delete Tile
                    </span>
                    *
                  </div>
                  <div className="relative group ml-auto">
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
                    {/*
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100">
                      Select Category
                    </span>
                    *
                  </div>
                </div>
              )}
            </div>
            {adminMode && preview ? (
              <textarea
                value={tile.text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-white text-black rounded-3xl"
              />
            ) : (
              <p>{tile.text}</p>
            )}
            <div className="flex justify-between mt-2">
              <Link
                href={`/${siteId}/${pageName}/tile/${idxComponent}/${
                  idxTile !== undefined ? idxTile : index
                }`}
              >
                <button className="p-2 text-black rounded">
                  <Share />
                </button>
              </Link>
              {!adminMode && preview && tile.type === "product" && (
                <button className="p-2 bg-green-500 text-white rounded">
                  <ScanBarcode />
                </button>
              )}
              {!adminMode && preview && tile.type === "project" && (
                <button className="p-2 bg-red-500 text-white rounded">
                  <HeartHandshake />
                </button>
              )}
            </div>

            <div className="flex justify-center mt-2">
              <Link href={tile.more || "#"}>
                <button className="p-2 bg-blue-500 text-white rounded">
                  More
                </button>
              </Link>
            </div>
            {adminMode && preview && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Enter link"
                  value={tile.more || ""}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  className="w-full p-2 border bg-white text-xm border-gray-300 rounded"
                />
              </div>
            )}
          </div>
  
  
  */
}

export default TileGrid;
