import React, { useState, useEffect } from "react";
import SectionHeader from "./sectionheader";
import TileGrid from "./TileGrid";
import BannerSlider from "./BannerSlider";
import TextEditor from "./TextEditor";
import { useUser } from "@/lib/auth";
import { Tile, Image, TileWidget } from "@/lib/types"; // Adjust the import path as necessary
import AddComponent from "./AddComponent";
import { SquareX } from "lucide-react"; // Adjust the import path as necessary

interface PageRendererProps {
  siteId: string;
  pageName?: string;
  preview: boolean;
  content: {
    components: Array<{
      id: string;
      type: string;
      widget: any;
    }>;
  };

  onUpdate?: (updatedContent: any) => void;

  addImageUrlToBeDeleted: (imageUrl: string) => void;
}

const PageRenderer: React.FC<PageRendererProps> = ({
  siteId,
  pageName,
  preview,
  content,

  onUpdate,

  addImageUrlToBeDeleted,
}) => {
  const [components, setComponents] = useState(content.components || []);

  useEffect(() => {
    setComponents(content.components || []);
  }, [content]);
  const { modifyMode } = useUser();

  // Function to define the initial structure for widgets
  const initialWidgetByType = (type: string) => {
    switch (type) {
      case "banner":
        return { Image: [] }; // Initialize with an empty images array
      case "sectionheader":
        return {
          backgroundColor: "#ffffff",
          headerText: "Section Header",
        }; // Default styles and text
      case "tilegrid":
        return { Tile: [] }; // Empty tiles array
      case "texteditor":
        return { content: "" };

      default:
        return {}; // Fallback for unknown types
    }
  };

  const addComponent = (type: string) => {
    const newComponent = {
      id: Date.now().toString(),
      type,
      widget: initialWidgetByType(type), // Assign initial structure
    };
    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    if (onUpdate) onUpdate({ components: newComponents });
  };
  const insertComponent = (type: string, index: number) => {
    const newComponent = {
      id: Date.now().toString(),
      type,
      widget: initialWidgetByType(type), // Assign initial structure
    };
    const newComponents = [
      ...components.slice(0, index), // Components before the insertion point
      newComponent, // New component to insert
      ...components.slice(index), // Components after the insertion point
    ];
    setComponents(newComponents);
    if (onUpdate) onUpdate({ components: newComponents });
  };

  const deleteComponent = (id: string) => {
    const componentToDelete = components.find(
      (component) => component.id === id
    );
    if (componentToDelete) {
      if (componentToDelete.type === "tilegrid") {
        for (const tile of (componentToDelete.widget as TileWidget).Tile) {
          if (tile.image) {
            addImageUrlToBeDeleted(tile.image);
          }
        }
      } else if (componentToDelete.type === "Banner") {
        const images = componentToDelete.widget as Image[];
        for (const image of images) {
          if (image.url) {
            addImageUrlToBeDeleted(image.url);
          }
        }
      }
    }

    const newComponents = components.filter((component) => component.id !== id);
    setComponents(newComponents);
    if (onUpdate) onUpdate({ components: newComponents });
  };

  const updateComponentWidget = (id: string, newWidget: any) => {
    const newComponents = components.map((component) =>
      component.id === id ? { ...component, widget: newWidget } : component
    );
    setComponents(newComponents);
    if (onUpdate) onUpdate({ components: newComponents });
  };

  const renderComponent = (
    component: {
      id: string;
      type: string;
      widget: any;
    },
    index: number
  ) => {
    switch (component.type) {
      case "banner":
        return (
          <BannerSlider
            key={component.id}
            siteId={siteId}
            initialImages={component.widget.Image}
            preview={preview}
            onImagesUpdate={(updatedImages) =>
              updateComponentWidget(component.id, {
                ...component.widget,
                Image: updatedImages,
              })
            }
            addImageUrlToBeDeleted={addImageUrlToBeDeleted}
          />
        );
      case "sectionheader":
        return (
          <SectionHeader
            key={component.id}
            preview={preview}
            initialBackgroundColor={component.widget.backgroundColor}
            initialHeaderText={component.widget.headerText}
            onBackgroundColorChange={(color) =>
              updateComponentWidget(component.id, {
                ...component.widget,
                backgroundColor: color,
              })
            }
            onHeaderTextChange={(text) =>
              updateComponentWidget(component.id, {
                ...component.widget,
                headerText: text,
              })
            }
          />
        );
      case "tilegrid":
        return (
          <TileGrid
            key={component.id}
            siteId={siteId}
            pageName={pageName}
            idxComponent={index}
            initialTiles={component.widget.Tile}
            preview={preview}
            onTilesUpdate={(updatedTiles) =>
              updateComponentWidget(component.id, {
                ...component.widget,
                Tile: updatedTiles,
              })
            }
            addImageUrlToBeDeleted={addImageUrlToBeDeleted}
          />
        );
      case "texteditor":
        return (
          <TextEditor
            key={component.id}
            siteId={siteId}
            initialContent={component.widget.content}
            preview={preview}
            onUpdate={(text) =>
              updateComponentWidget(component.id, {
                ...component.widget,
                content: text,
              })
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {modifyMode && (
        <div className="mt-4">
          <AddComponent index={0} onAddComponent={insertComponent} />
        </div>
      )}
      {Array.isArray(components) &&
        components.map((component, index) => (
          <div key={component.id} className="pt-8 relative mb-4">
            {renderComponent(component, index)}
            {modifyMode && (
              <div>
                <button
                  onClick={() => deleteComponent(component.id)}
                  className="absolute top-0 right-0 p-2  rounded"
                >
                  <SquareX />
                </button>
                <div className="mt-4">
                  <AddComponent
                    index={index + 1}
                    onAddComponent={insertComponent}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default PageRenderer;
