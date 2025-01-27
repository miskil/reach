"use client";
import React, { useState } from "react";

interface PageHeaderProps {
  onSubmit: (pageName: string, layout: string, menuItem?: string) => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onSubmit }) => {
  const [pageName, setPageName] = useState("");
  const [layout, setLayout] = useState("");
  const [menuItem, setMenuItem] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (pageName && layout) {
      onSubmit(pageName, layout, menuItem);
    } else {
      alert("Page name and layout are required.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center space-x-4 text-sm"
    >
      <div>
        <label htmlFor="pageName" className="block mb-1">
          Page Name:
        </label>
        <input
          type="text"
          id="pageName"
          value={pageName}
          onChange={(e) => setPageName(e.target.value)}
          required
          className="p-1 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="layout" className="block mb-1">
          Layout:
        </label>
        <select
          id="layout"
          value={layout}
          onChange={(e) => setLayout(e.target.value)}
          required
          className="p-1 border border-gray-300 rounded"
        >
          <option value="">Select Layout</option>
          <option value="layout1">Layout 1</option>
          <option value="layout2">Layout 2</option>
          <option value="layout3">Layout 3</option>
        </select>
      </div>
      <div>
        <label htmlFor="menuItem" className="block mb-1">
          Menu Item (Optional):
        </label>
        <input
          type="text"
          id="menuItem"
          value={menuItem}
          onChange={(e) => setMenuItem(e.target.value)}
          className="p-1 border border-gray-300 rounded"
        />
      </div>
      <button type="submit" className="p-1 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  );
};

export default PageHeader;
