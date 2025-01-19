import React, { useState, useEffect } from "react";
import SectionHeader from "../compo/sectionheader";
import TileGrid from "../compo/TileGrid";
import BannerSlider from "../compo/BannerSlider";
import TextEditor from "../compo/TextEditor";
import CourseIndexComponents from "./CourseIndexComponents"; // Ensure this path is correct
import { useUser } from "@/lib/auth";

interface CourseIndexComponentsProps {
  courses: Array<{
    id: string;
    title: string;
    modules: Array<{
      id: string;
      title: string;
      topics: Array<{
        id: string;
        title: string;
        type: string; // 'normal' or 'test'
      }>;
    }>;
  }>;
  onAddCourse: (title: string) => void;
  onAddModule: (courseId: string, title: string) => void;
  onAddTopic: (moduleId: string, title: string, type: string) => void;
  onLinkSection: (itemId: string, sectionId: string) => void;
}

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
}

const PageRenderer: React.FC<PageRendererProps> = ({
  siteId,
  pageName,
  preview,
  content,

  onUpdate,
}) => {
  const [components, setComponents] = useState(content.components || []);
  const [courseIndexComponentsProps, setCourseIndexComponentsProps] =
    useState<CourseIndexComponentsProps>({
      courses: [],
      onAddCourse: () => {},
      onAddModule: () => {},
      onAddTopic: () => {},
      onLinkSection: () => {},
    });

  useEffect(() => {
    setComponents(content.components || []);
  }, [content]);
  const { user, setUser, adminMode, setAdminMode } = useUser();

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
      case "CourseIndexComponents":
        return { CourseIndexComponentsProps: courseIndexComponentsProps };

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
      case "CourseIndexComponents":
        return (
          <CourseIndexComponents
            key={component.id}
            courses={courseIndexComponentsProps.courses}
            onAddCourse={courseIndexComponentsProps.onAddCourse}
            onAddModule={courseIndexComponentsProps.onAddModule}
            onAddTopic={courseIndexComponentsProps.onAddTopic}
            onLinkSection={courseIndexComponentsProps.onLinkSection}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {Array.isArray(components) &&
        components.map((component, index) => (
          <div key={component.id} className="relative mb-4">
            {renderComponent(component, index)}
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
      {adminMode && preview && (
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
            <option value="CourseIndexComponents">Course Index</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default PageRenderer;
