"use client";

import { useState, useEffect } from "react";
import PageRenderer from "./pagerenderer";
import {
  upinsertBlog,
  getBlogCategories,
  insertCategory,
  getTags,
  insertTag, // Adjust the import path as necessary
} from "@/lib/actions";
import { blogsType, ContentType } from "@/lib/db/schema"; // Adjust the import path as necessary
import { Tile, Image, TileWidget, BannerWidget } from "@/lib/types"; // Adjust the import path as necessary
import { useUser } from "@/lib/auth";
import { handleS3ImageUpload, deleteS3Image } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useUnsavedChanges } from "@/lib/useUnsavedChanges";
import DropDownWithAdd from "./DropdownwitAdd";

interface BlogEditorProps {
  blog: blogsType;
  siteId: string;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ blog, siteId }) => {
  const [currentBlog, setCurrentBlog] = useState<blogsType | null>(blog);
  const { modifyMode } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);
  const [author, setAuthor] = useState(currentBlog?.author || "");
  const [category, setCategory] = useState(currentBlog?.category || "");
  const [tags, setTags] = useState(currentBlog?.tags || "");

  const [imagesToBeDeleted, setImagesToBeDeleted] = useState<string[]>([]);

  const router = useRouter();
  const [isDirty, setIsDirty] = useState(false);

  // Use the custom hook
  useUnsavedChanges(isDirty);

  const handleSave = async () => {
    if (currentBlog) {
      await saveImages();
      await upinsertBlog(
        siteId,
        currentBlog.name,
        currentBlog.layout,
        currentBlog.menuItem!,
        currentBlog.category!,
        currentBlog.tags!,
        currentBlog.author!,
        currentBlog.authorbio!,
        currentBlog.authorimage!,
        currentBlog.blogImageURL!,
        currentBlog.content
      );
      setCurrentBlog((prev) =>
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

      alert("Blog saved!");
    }
  };

  const saveImages = async () => {
    if (!currentBlog) return;

    // Ensure content is parsed correctly
    let parsedContent: ContentType;
    try {
      parsedContent =
        typeof currentBlog.content === "string"
          ? JSON.parse(currentBlog.content)
          : (currentBlog.content as ContentType);
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
    setCurrentBlog((prevBlog) =>
      prevBlog
        ? {
            ...prevBlog,
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
    setCurrentBlog((prevBlog: blogsType | null) =>
      prevBlog ? { ...prevBlog, [name]: value } : null
    );
    setIsDirty(true);
  };

  const handleCategorySelect = (selectedItem: string) => {
    setCategory(selectedItem);
    setIsDirty(true); // Mark as dirty when category is changed

    setCurrentBlog((prevBlog) =>
      prevBlog ? { ...prevBlog, category: selectedItem } : null
    );
  };

  const handleCategoryInsert = async (newItem: string) => {
    console.log("Inserted:", newItem);
    await insertCategory(siteId, newItem); // Insert into DB
    setIsDirty(true); // Mark as dirty when category is changed

    fetchCategories(); // Re
  };
  const handleTagSelect = (selectedItem: string) => {
    setTags(selectedItem);
    setIsDirty(true); // Mark as dirty when category is changed

    setCurrentBlog((prevBlog) =>
      prevBlog ? { ...prevBlog, tags: selectedItem } : null
    );
  };

  const handleTagInsert = async (newItem: string) => {
    console.log("Inserted:", newItem);
    await insertTag(siteId, newItem); // Insert into DB
    setIsDirty(true); // Mark as dirty when category is changed

    fetchTags(); // Re
  };
  const fetchCategories = async () => {
    const categories = await getBlogCategories(siteId);
    return categories.filter(
      (category): category is string => category !== null
    );
  };
  const fetchTags = async () => {
    const Tags = await getTags(siteId);
    return Tags.filter((tag): tag is string => tag !== null);
  };
  if (!currentBlog) return <p>Loading...</p>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Main Content Section */}
      <main
        className={`p-4 bg-white transition-all ${
          modifyMode
            ? isExpanded
              ? "lg:w-3/4  w-full"
              : "lg:w-[calc(100%-3rem)] w-full"
            : "w-full"
        }`}
      >
        <h1 className="text-2xl font-bold">{currentBlog.name}</h1>

        <PageRenderer
          siteId={siteId}
          content={(currentBlog.content as ContentType) || []}
          onUpdate={(updatedContent) => {
            setCurrentBlog((prevBlog: blogsType | null) =>
              prevBlog ? { ...prevBlog, content: updatedContent } : null
            );
            setIsDirty(true);
          }}
          addImageUrlToBeDeleted={addImageUrlToBeDeleted}
        />
      </main>

      {/* Aside Section */}
      {modifyMode && (
        <aside
          className={`border border-gray-300 bg-gray-100 transition-all 
                      ${
                        isExpanded
                          ? "lg:w-1/4  w-full p-4"
                          : "lg:w-12  w-full p-2 flex items-center justify-center cursor-pointer"
                      }`}
        >
          {!isExpanded ? (
            <button
              className="rotate-180 text-gray-500"
              onClick={() => setIsExpanded(true)} // Limit onClick to this button
            >
              ➤
            </button>
          ) : (
            <div className="space-y-4 text-sm relative">
              <button
                className="absolute top-2 right-2 text-gray-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
              >
                ✖
              </button>
              <div>
                <label htmlFor="BlogName" className="block mb-1">
                  Blog Name:
                </label>
                <input
                  type="text"
                  id="BlogName"
                  name="name"
                  value={currentBlog.name}
                  onChange={handleInputChange}
                  className="w-full p-1 border border-gray-300 rounded bg-white text-black"
                />
              </div>
              <div>
                <label htmlFor="Author" className="block mb-1">
                  Author:
                </label>
                <input
                  type="text"
                  id="Author"
                  name="author"
                  value={currentBlog.author || ""}
                  onChange={handleInputChange}
                  className="w-full p-1 border border-gray-300 rounded bg-white text-black"
                />
              </div>
              <div>
                <label htmlFor="Category" className="block mb-1">
                  Category:
                </label>

                <DropDownWithAdd
                  fetchItems={fetchCategories}
                  onSelect={handleCategorySelect}
                  onInsert={handleCategoryInsert}
                  value={category}
                />
              </div>
              <div>
                <label htmlFor="Tags" className="block mb-1">
                  Tags:
                </label>

                <DropDownWithAdd
                  fetchItems={fetchTags}
                  onSelect={handleTagSelect}
                  onInsert={handleTagInsert}
                  value={tags}
                />
              </div>
              {/* Check Box for Course Material */}
              <div>
                <label className="block mb-1">Course Material:</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="courseMaterial"
                    name="contentType"
                    value="courseMaterial"
                    onChange={(e) => {
                      console.log("Course Material selected:", e.target.value);
                      setIsDirty(true); // Mark as dirty when the radio button is selected
                    }}
                    className="cursor-pointer"
                  />
                  <label htmlFor="courseMaterial" className="cursor-pointer">
                    Course Material
                  </label>
                </div>
              </div>

              <div>
                {isDirty && (
                  <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Save Blog
                  </button>
                )}
              </div>
            </div>
          )}
        </aside>
      )}
    </div>
  );
};

export default BlogEditor;
