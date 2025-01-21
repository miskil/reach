"use client";

import { useState, useEffect } from "react";
import PageRenderer from "../compo/pagerenderer";
import { upinsertPage } from "../../lib/actions";
import { PageType, ContentType } from "../../lib/db/schema"; // Adjust the import path as necessary
import { useUser } from "@/lib/auth";
interface PageEditorProps {
  page: PageType;
  siteId: string;
}

const PageEditor: React.FC<PageEditorProps> = ({ page, siteId }) => {
  const [currentPage, setCurrentPage] = useState<PageType | null>(page);
  const { user, setUser, adminMode, setAdminMode } = useUser();
  const [preview, setPreview] = useState(false);

  const handleSave = async () => {
    if (currentPage) {
      await upinsertPage(
        siteId,
        currentPage.name,
        currentPage.layout,
        currentPage.menuItem!,
        currentPage.content
      );
      alert("Page saved!");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentPage((prevPage: PageType | null) =>
      prevPage ? { ...prevPage, [name]: value } : null
    );
  };

  if (!currentPage) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{currentPage.name}</h1>
      {adminMode && (
        <div className="flex items-center space-x-4 text-sm mb-4">
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
        onUpdate={(updatedContent) =>
          setCurrentPage((prevPage: PageType | null) =>
            prevPage ? { ...prevPage, content: updatedContent } : null
          )
        }
      />
    </div>
  );
};

export default PageEditor;
