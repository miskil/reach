import React, { useState, useEffect } from "react";
import SectionHeader from "../compo/sectionheader";
import TileGrid from "../compo/TileGrid";
import BannerSlider from "../compo/BannerSlider";
import TextEditor from "../compo/TextEditor";

interface PageRendererProps {
  siteId: string;
  content: {
    components: Array<{
      id: string;
      type: string;
      widget: any;
    }>;
  };
  adminMode: boolean;
  onUpdate?: (updatedContent: any) => void;
}

const PageRenderer: React.FC<PageRendererProps> = ({
  siteId,
  content,
  adminMode,
  onUpdate,
}) => {
  const [components, setComponents] = useState(content.components || []);

  useEffect(() => {
    setComponents(content.components || []);
  }, [content]);

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

  const deleteComponent = (id: string) => {
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

  const renderComponent = (component: {
    id: string;
    type: string;
    widget: any;
  }) => {
    switch (component.type) {
      case "banner":
        return (
          <BannerSlider
            key={component.id}
            siteId={siteId}
            initialImages={component.widget.Image}
            adminMode={adminMode}
            onImagesUpdate={(updatedImages) =>
              updateComponentWidget(component.id, {
                ...component.widget,
                Image: updatedImages,
              })
            }
          />
        );
      case "sectionheader":
        return (
          <SectionHeader
            key={component.id}
            adminMode={adminMode}
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
            initialTiles={component.widget.Tile}
            adminMode={adminMode}
            onTilesUpdate={(updatedTiles) =>
              updateComponentWidget(component.id, {
                ...component.widget,
                Tile: updatedTiles,
              })
            }
          />
        );
      case "texteditor":
        return (
          <TextEditor
            key={component.id}
            siteId={siteId}
            initialContent={component.widget.content}
            adminMode={adminMode}
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
      {Array.isArray(components) &&
        components.map((component) => (
          <div key={component.id} className="relative mb-4">
            {renderComponent(component)}
            {adminMode && (
              <button
                onClick={() => deleteComponent(component.id)}
                className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      {adminMode && (
        <div className="mt-4">
          <select
            onChange={(e) => addComponent(e.target.value)}
            className="p-2 border border-gray-300 bg-white text-black rounded"
            defaultValue=""
          >
            <option value="" disabled>
              Add Component
            </option>
            <option value="banner">Banner</option>
            <option value="sectionheader">Section Header</option>
            <option value="tilegrid">Tile Grid</option>
            <option value="texteditor">Text Editor</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default PageRenderer;
