"use client";

import { useState, useEffect } from "react";
import LayoutRenderer from "../../../../../compo/LayoutRenderer";
import { upinsertPage } from "../../../../../../lib/actions";
interface PageEditorProps {
  params: { name: string };
  siteId: string;
}

const PageEditor: React.FC<PageEditorProps> = ({ params, siteId }) => {
  const [page, setPage] = useState(null);
  const [adminMode, setAdminMode] = useState(true);

  const handleSave = async () => {
    if (page) {
      await upinsertPage(siteId, page.name, page.content);
      alert("Page saved!");
    }
  };

  if (!page) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{page.name}</h1>
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
        layout={page.layout}
        content={page.content}
        adminMode={adminMode}
        onUpdate={(updatedContent) =>
          setPage({ ...page, content: updatedContent })
        }
      />
    </div>
  );
};

export default PageEditor;
