"use client";

import { useState } from "react";
import { createPage, getSitePages } from "../../lib/actions";
import { PageType } from "../../lib/db/schema";
import { useRouter } from "next/navigation";

interface PageListProps {
  siteId: string;
  pages: PageType[];
}

const PageList: React.FC<PageListProps> = ({
  siteId: siteId,
  pages: initialPages,
}) => {
  const [pages, setPages] = useState<PageType[]>(initialPages);

  const router = useRouter();

  const handleCreatePage = async () => {
    router.push(`managepage/PageCreate`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pages</h1>
      <button
        onClick={handleCreatePage}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create New Page
      </button>
      <ul className="mt-4 space-y-4">
        {pages.map((page) => (
          <li
            key={page.name}
            className="flex justify-between items-center p-4 border rounded"
          >
            <span>{page.name}</span>
            <button
              onClick={() => router.push(`managepage/PageUpdate/${page.name}`)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PageList;
