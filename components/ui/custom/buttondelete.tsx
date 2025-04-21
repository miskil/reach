import React from "react";

interface ButtonDeleteProps {
  ButtonComponent: React.ElementType;
  onDelete: () => void;
}

const ButtonDelete: React.FC<ButtonDeleteProps> = ({
  ButtonComponent,
  onDelete,
}) => {
  const handleButtonClick = () => {
    onDelete();
  };

  return (
    <div>
      <button onClick={handleButtonClick}>
        <ButtonComponent />
      </button>
    </div>
  );
};

export default ButtonDelete;
