import React, { useState, useImperativeHandle, forwardRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Trash2,
} from "lucide-react"; // Adjust the import path as necessary
import ButtonUpload from "./buttonupload";
import { useUser } from "@/lib/auth";
import { Image } from "@/lib/types"; // Adjust the import path as necessary

interface BannerSliderProps {
  siteId: string;
  initialImages: Image[];

  onImagesUpdate: (images: Image[]) => void;
  addImageUrlToBeDeleted: (imageUrl: string) => void;
}

const BannerSlider: React.FC<BannerSliderProps> = ({
  siteId,
  initialImages,

  onImagesUpdate,
  addImageUrlToBeDeleted,
}) => {
  const [localImages, setLocalImages] = useState<Image[]>(initialImages);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { modifyMode } = useUser();

  const handleImageUpload = async (file: File) => {
    const imageURL = URL.createObjectURL(file);
    if (!imageURL) return;

    const newImage: Image = {
      id: Date.now(),
      url: imageURL, // URL returned from the server
      imageFile: file,
    };
    const updatedImages: Image[] = [...localImages, newImage];

    setLocalImages(updatedImages);
    onImagesUpdate(updatedImages);
  };

  const handleImageDelete = async (index: number): Promise<void> => {
    const imageToDelete = localImages[index];

    const updatedImages: Image[] = localImages.filter((_, i) => i !== index);
    setLocalImages(updatedImages);
    onImagesUpdate(updatedImages);
    if (updatedImages.length === 0) {
      setCurrentIndex(0); // Reset index if no images left
    } else {
      setCurrentIndex((prevIndex) =>
        prevIndex >= updatedImages.length ? updatedImages.length - 1 : prevIndex
      );
    }
    addImageUrlToBeDeleted(imageToDelete.url);
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? localImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === localImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full h-[400] bg-gray-200">
      {localImages.length > 0 && (
        <img
          src={localImages[currentIndex].url}
          alt={`Slide ${currentIndex}`}
          className="w-full  h-auto max-h-[400px] object-cover"
        />
      )}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
        <button
          onClick={handlePrevClick}
          className="p-2 bg-blue-500 text-white rounded"
        >
          <ChevronLeft />
        </button>
      </div>
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
        <button
          onClick={handleNextClick}
          className="p-2 bg-blue-500 text-white rounded"
        >
          <ChevronRight />
        </button>
      </div>
      {modifyMode && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex  items-center space-x-2">
          <ButtonUpload
            ButtonComponent={ImageIcon}
            onFileUpload={handleImageUpload}
          />

          <div>
            {localImages.length > 0 && (
              <button
                onClick={() => handleImageDelete(currentIndex)}
                className="bg-transparent text-grey px-2 py-1"
              >
                <Trash2 />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerSlider;
