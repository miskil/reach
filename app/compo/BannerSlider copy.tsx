import { useState } from "react";

interface Image {
  id: number;
  url: string;
}

interface BannerSliderProps {
  images: Image[];
  adminMode: boolean;
  onImagesUpdate: (images: Image[]) => void;
}

const BannerSlider = ({
  images,
  adminMode,
  onImagesUpdate,
}: BannerSliderProps) => {
  const [localImages, setLocalImages] = useState(images);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImage: Image = {
        id: Date.now(),
        url: URL.createObjectURL(file),
      }; // Mock upload
      const updatedImages: Image[] = [...localImages, newImage];
      setLocalImages(updatedImages);
      onImagesUpdate(updatedImages);
    }
  };

  const handleImageDelete = (index: number): void => {
    const updatedImages: Image[] = localImages.filter((_, i) => i !== index);
    setLocalImages(updatedImages);
    onImagesUpdate(updatedImages);
  };

  return (
    <div className="relative w-full">
      <div className="overflow-hidden">
        <div className="flex">
          {localImages.map((image, index) => (
            <div key={index} className="relative">
              <img src={image.url} alt={`Slide ${index}`} className="w-full" />
              {adminMode && (
                <button
                  onClick={() => handleImageDelete(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {adminMode && (
        <div className="mt-4">
          <label className="block bg-gray-300 px-4 py-2 rounded cursor-pointer">
            Upload Image
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default BannerSlider;
