import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import ButtonUpload from "./buttonupload";
import { ChevronLeft, ChevronRight, Image } from "lucide-react"; // Adjust the import path as necessary

interface BannerSliderProps {
  initialImages: string[];
  display: boolean;
}

const BannerSlider = forwardRef<any, BannerSliderProps>(
  ({ initialImages, display }, ref) => {
    const [images, setImages] = useState<string[]>(initialImages);
    const [currentIndex, setCurrentIndex] = useState(0);

    useImperativeHandle(ref, () => ({
      getImages: () => images,
    }));

    const handleFileUpload = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages((prevImages) => [...prevImages, e.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    };

    const handlePrevClick = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    };

    const handleNextClick = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    };

    return (
      <div className="relative w-full h-64 bg-gray-200">
        {images!.length > 0 && (
          <img
            src={images[currentIndex]}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
          <button
            type="button"
            onClick={handlePrevClick}
            className="p-2 bg-blue-500 text-white rounded"
          >
            <ChevronLeft />
          </button>
        </div>
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
          <button
            type="button"
            onClick={handleNextClick}
            className="p-2 bg-blue-500 text-white rounded"
          >
            <ChevronRight />
          </button>
        </div>
        {!display && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <ButtonUpload
              ButtonComponent={Image}
              onFileUpload={handleFileUpload}
            />
          </div>
        )}
      </div>
    );
  }
);

export default BannerSlider;
