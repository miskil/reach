import React, { useState, useImperativeHandle, forwardRef } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react"; // Adjust the import path as necessary
import ButtonUpload from "../../components/ui/custom/buttonupload";
import { uploadImage, deleteImage } from "../../lib/actions"; // Import the server action

interface Image {
  id: number;
  url: string;
}

interface BannerSliderProps {
  initialImages: Image[];
  adminMode: boolean;
  onImagesUpdate: (images: Image[]) => void;
}

const BannerSlider = forwardRef<any, BannerSliderProps>(
  ({ initialImages, adminMode, onImagesUpdate }, ref) => {
    const [localImages, setLocalImages] = useState<Image[]>(initialImages);
    const [currentIndex, setCurrentIndex] = useState(0);

    useImperativeHandle(ref, () => ({
      getImages: () => localImages,
    }));

    const handleImageUpload = async (file: File) => {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const imageURL = await uploadImage(file); // Call the server action
          const newImage: Image = {
            id: Date.now(),
            url: imageURL, // URL returned from the server
          };
          const updatedImages: Image[] = [...localImages, newImage];
          setLocalImages(updatedImages);
          onImagesUpdate(updatedImages);
        } catch (error) {
          console.error("Failed to upload image:", error);
        }
      }
    };

    const handleImageDelete = async (index: number): Promise<void> => {
      const imageToDelete = localImages[index];

      const updatedImages: Image[] = localImages.filter((_, i) => i !== index);
      setLocalImages(updatedImages);
      onImagesUpdate(updatedImages);
      if (currentIndex >= updatedImages.length) {
        setCurrentIndex(updatedImages.length - 1);
      }
      try {
        await deleteImage(imageToDelete.url); // Call the server action to delete the image
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
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
      <div className="relative w-full h-64 bg-gray-200">
        {localImages.length > 0 && (
          <img
            src={localImages[currentIndex].url}
            alt={`Slide ${currentIndex}`}
            className="w-full h-full object-cover"
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
        {adminMode && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <ButtonUpload
              ButtonComponent={ImageIcon}
              onFileUpload={handleImageUpload}
            />
          </div>
        )}
        {adminMode && localImages.length > 0 && (
          <button
            onClick={() => handleImageDelete(currentIndex)}
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1"
          >
            Delete
          </button>
        )}
      </div>
    );
  }
);

export default BannerSlider;
