"use client";

import { useState, useEffect } from "react";
import PageRenderer from "./pagerenderer";
import { upinsertPage } from "@/lib/actions";
import { PageType, ContentType } from "@/lib/db/schema"; // Adjust the import path as necessary
import { Tile, Image, TileWidget, BannerWidget } from "@/lib/types"; // Adjust the import path as necessary
import { useUser } from "@/lib/auth";
import { handleS3ImageUpload, deleteS3Image } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useUnsavedChanges } from "@/lib/useUnsavedChanges";

interface PageEditorProps {
  page: PageType;
  siteId: string;
}

const PageEditor: React.FC<PageEditorProps> = ({ page, siteId }) => {
  const [currentPage, setCurrentPage] = useState<PageType | null>(page);
  const { user, setUser, adminMode, setAdminMode } = useUser();
  const [preview, setPreview] = useState(false);
  const [imagesToBeDeleted, setImagesToBeDeleted] = useState<string[]>([]);

  const router = useRouter();
  const [isDirty, setIsDirty] = useState(false);

  // Use the custom hook
  useUnsavedChanges(isDirty);

  const handleSave = async () => {
    if (currentPage) {
      await saveImages();
      await upinsertPage(
        siteId,
        currentPage.name,
        currentPage.layout,
        currentPage.menuItem!,
        currentPage.content
      );
      setCurrentPage((prev) =>
        prev
          ? {
              ...prev,
              content:
                typeof prev.content === "string"
                  ? JSON.stringify(JSON.parse(prev.content))
                  : prev.content,
            }
          : null
      );
      setIsDirty(false);

      alert("Page saved!");
    }
  };
  /*
  const saveImages = async () => {
    if (!currentPage) return;

    // Ensure content is parsed correctly
    let parsedContent: ContentType;
    try {
      parsedContent =
        typeof currentPage.content === "string"
          ? JSON.parse(currentPage.content)
          : (currentPage.content as ContentType);
    } catch (error) {
      console.error("Failed to parse content:", error);
      return;
    }

    if (!parsedContent || !Array.isArray(parsedContent.components)) return;

    // Delete images from S3
    for (const imageUrl of imagesToBeDeleted) {
      await deleteS3Image(siteId, imageUrl);
    }

    // Ensure a new reference for updated components
    const updatedComponents = parsedContent.components.map(
      async (component) => {
        if (component.type === "tilegrid") {
          return {
            ...component,
            widget: {
              ...component.widget,
              Tile: component.widget.Tile.map(
                async (tile: Tile): Promise<Tile> => {
                  if (tile.imageFile) {
                    const imageURL = await handleS3ImageUpload(
                      tile.imageFile,
                      siteId
                    );
                    return {
                      ...tile,
                      image: imageURL ?? "",
                      imageFile: undefined,
                    };
                  }
                  return tile;
                }
              ),
            },
          };
        } else if (component.type === "banner") {
          return {
            ...component,
            widget: await Promise.all(
              (component.widget as Image[]).map(async (image) => {
                if (image.imageFile) {
                  const imageURL = await handleS3ImageUpload(
                    image.imageFile,
                    siteId
                  );
                  return { ...image, url: imageURL, imageFile: undefined };
                }
                return image;
              })
            ),
          };
        }
        return component;
      }
    );

    // Wait for all async operations to complete
    const resolvedComponents = await Promise.all(updatedComponents);

    // Update state while preserving other content properties
    setCurrentPage((prevPage) =>
      prevPage
        ? {
            ...prevPage,
            content: JSON.stringify({
              ...parsedContent, // Preserve original structure
              components: resolvedComponents,
            }),
          }
        : null
    );

    setImagesToBeDeleted([]); // Clear the list after saving
  };
  */

  const saveImages = async () => {
    if (!currentPage) return;

    // Ensure content is parsed correctly
    let parsedContent: ContentType;
    try {
      parsedContent =
        typeof currentPage.content === "string"
          ? JSON.parse(currentPage.content)
          : (currentPage.content as ContentType);
    } catch (error) {
      console.error("Failed to parse content:", error);
      return;
    }

    if (!parsedContent || !Array.isArray(parsedContent.components)) return;

    // Delete images from S3
    for (const imageUrl of imagesToBeDeleted) {
      await deleteS3Image(siteId, imageUrl);
    }

    // Ensure a new reference for updated components
    const updatedContent: ContentType["components"] =
      parsedContent.components.map((component) => ({ ...component }));

    console.log(updatedContent);

    for (const component of updatedContent) {
      if (component.type === "tilegrid") {
        for (const tile of (component.widget as TileWidget).Tile) {
          if (tile.imageFile) {
            const imageURL = await handleS3ImageUpload(tile.imageFile, siteId);
            if (imageURL) {
              tile.image = imageURL;
              delete tile.imageFile; // Remove imageFile after upload
            }
          }
        }
      } else if (component.type === "banner") {
        for (const image of component.widget.Image) {
          if (image.imageFile) {
            const imageURL = await handleS3ImageUpload(image.imageFile, siteId);
            if (imageURL) {
              image.url = imageURL;
              delete image.imageFile; // Remove imageFile after upload
            }
          }
        }
      }
    }

    // Update state while preserving other content properties
    setCurrentPage((prevPage) =>
      prevPage
        ? {
            ...prevPage,
            content: JSON.stringify({
              ...parsedContent, // Preserve original structure
              components: updatedContent,
            }),
          }
        : null
    );

    setImagesToBeDeleted([]); // Clear the list after saving
  };

  const addImageUrlToBeDeleted = (imageUrl: string) => {
    setImagesToBeDeleted((prev) => [...prev, imageUrl]);
    setIsDirty(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentPage((prevPage: PageType | null) =>
      prevPage ? { ...prevPage, [name]: value } : null
    );
    setIsDirty(true);
  };

  if (!currentPage) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{currentPage.name}</h1>
      {adminMode && (
        <div className="flex flex-wrap items-center space-x-4 sm:space-x-2 text-sm mb-4">
          <div>
            <label htmlFor="pageName" className="block mb-1">
              Page Name:
            </label>
            <input
              type="text"
              id="pageName"
              name="name"
              value={currentPage.name}
              onChange={handleInputChange}
              className="p-1 border border-gray-300 rounded bg-white text-black"
            />
          </div>

          <div>
            <label htmlFor="menuItem" className="block mb-1">
              Menu Item (Optional):
            </label>
            <input
              type="text"
              id="menuItem"
              name="menuItem"
              value={currentPage.menuItem || ""}
              onChange={handleInputChange}
              className="p-1 border border-gray-300 rounded bg-white text-black"
            />
          </div>

          <div>
            <button
              onClick={() => setPreview(!preview)}
              className="bg-yellow-500 text-white px-4 py-2 rounded mt-4"
            >
              {preview ? "Preview" : "Modify"}
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded ml-4"
            >
              Save Page
            </button>
          </div>
        </div>
      )}

      <PageRenderer
        siteId={siteId}
        content={(currentPage.content as ContentType) || []}
        preview={preview}
        onUpdate={(updatedContent) => {
          setCurrentPage((prevPage: PageType | null) =>
            prevPage ? { ...prevPage, content: updatedContent } : null
          );
          setIsDirty(true);
        }}
        addImageUrlToBeDeleted={addImageUrlToBeDeleted}
      />
    </div>
  );
};

export default PageEditor;
