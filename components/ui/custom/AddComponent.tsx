import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CirclePlus } from "lucide-react";

interface AddComponentProps {
  index: number;
  onAddComponent: (type: string, index: number) => void; // Updated to accept type and index
}

const AddComponent: React.FC<AddComponentProps> = ({
  index,
  onAddComponent,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleAddComponent = (type: string) => {
    onAddComponent(type, index); // Pass type and index to the parent function
    setIsMenuOpen(false); // Close the dropdown after selection
  };

  return (
    <div>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded-full flex items-center justify-center shadow-md hover:bg-blue-600">
            <CirclePlus className="h-12 w-12" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="flex flex-col gap-1">
          <DropdownMenuItem onClick={() => handleAddComponent("banner")}>
            <span>BannerSlider</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddComponent("sectionheader")}>
            <span>SectionHeader</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddComponent("tilegrid")}>
            <span>TileGrid</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddComponent("texteditor")}>
            <span>TextBox</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleAddComponent("CourseIndexComponents")}
          >
            <span>TextBox</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AddComponent;
