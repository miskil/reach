"use client";

import { useState } from "react";
import { createPage, getSitePages } from "@/lib/actions";
import { PageType } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/auth";
import Link from "next/link";

interface PageListProps {
  siteId: string;
  pages: PageType[];
  admin?: boolean;
}

const PageList: React.FC<PageListProps> = ({
  siteId: siteId,
  pages: initialPages,
  admin = false,
}) => {
  const [pages, setPages] = useState<PageType[]>(initialPages);
  const { user, setUser, adminMode, setAdminMode } = useUser();

  const router = useRouter();

  const handleCreatePage = () => {
    router.push(`managepage/PageCreate`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pages</h1>

      {admin && adminMode && (
        <div className="mt-4">
          <button
            onClick={() => {
              handleCreatePage();
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Create Page
          </button>
        </div>
      )}

      <ul className="mt-4 space-y-4">
        {pages.map((page) => (
          <li
            key={page.name}
            className="flex justify-between items-center  border-b border-gray-300"
          >
            <Link
              href={`/pages/${page.name}`}
              className="text-blue-500 hover:underline"
            >
              {page.name}
            </Link>
            {admin && adminMode && (
              <button
                onClick={() =>
                  router.push(`managepage/PageUpdate/${page.name}`)
                }
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PageList;
