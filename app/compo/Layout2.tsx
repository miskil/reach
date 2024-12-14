interface LayoutTwoProps {
  bannerImage: string;
  text: string;
  adminMode: boolean;
  onUpdate: (data: { bannerImage: string; text: string }) => void;
}

const LayoutTwo: React.FC<LayoutTwoProps> = ({
  bannerImage,
  text,
  adminMode,
  onUpdate,
}) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpdate({ bannerImage: URL.createObjectURL(file), text });
    }
  };

  interface HandleTextUpdate {
    (newText: string): void;
  }

  const handleTextUpdate: HandleTextUpdate = (newText) => {
    onUpdate({ bannerImage, text: newText });
  };

  return (
    <div className="p-4">
      <div className="relative w-full">
        <img src={bannerImage} alt="Banner" className="w-full" />
        {adminMode && (
          <label className="absolute top-2 left-2 bg-gray-300 px-4 py-2 rounded cursor-pointer">
            Replace Banner
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>
      <div className="mt-4">
        {adminMode ? (
          <textarea
            value={text}
            onChange={(e) => handleTextUpdate(e.target.value)}
            className="border p-2 w-full"
          />
        ) : (
          <p>{text}</p>
        )}
      </div>
    </div>
  );
};

export default LayoutTwo;
