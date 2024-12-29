"use client";

import { useState, useEffect } from "react";
import LayoutRenderer from "../compo/LayoutRenderer";
import { upinsertPage } from "../../lib/actions";
import { PageType } from "../../lib/db/schema"; // Adjust the import path as necessary

interface PageEditorProps {
  page: PageType;
  siteId: string;
}

const PageEditor: React.FC<PageEditorProps> = ({ page, siteId }) => {
  const [currentPage, setCurrentPage] = useState<PageType | null>(page);
  const [adminMode, setAdminMode] = useState(true);

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
          <label htmlFor="layout" className="block mb-1">
            Layout:
          </label>
          <select
            id="layout"
            name="layout"
            value={currentPage.layout}
            onChange={handleInputChange}
            className="p-1 border border-gray-300 rounded bg-white text-black"
          >
            <option value="">Select Layout</option>
            <option value="layout-1">Layout 1</option>
            <option value="layout-2">Layout 2</option>
          </select>
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
      </div>

      <button
        onClick={() => setAdminMode(!adminMode)}
        className="bg-yellow-500 text-white px-4 py-2 rounded mt-4"
      >
        Toggle {adminMode ? "Preview" : "Admin"} Mode
      </button>
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded ml-4"
      >
        Save Page
      </button>
      <LayoutRenderer
        siteId={siteId}
        layout={currentPage.layout}
        content={currentPage.content}
        adminMode={adminMode}
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
