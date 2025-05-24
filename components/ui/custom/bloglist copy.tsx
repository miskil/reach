"use client";

import { useState } from "react";
import { blogsType } from "@/lib/db/schema";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/lib/auth";
import Link from "next/link";

interface BlogListProps {
  siteId: string;
  Blogs: blogsType[];
}

const BlogList: React.FC<BlogListProps> = ({
  siteId: siteId,
  Blogs: initialBlogs,
}) => {
  const [Blogs, setBlogs] = useState<blogsType[]>(initialBlogs);
  const { user, setUser, adminMode, setAdminMode } = useUser();
  // Check if the current path includes "admin"

  const router = useRouter();
  const pathname = usePathname(); // Use usePathname to get the current path

  const isAdminPath = pathname.includes("admin");
  setAdminMode(isAdminPath);

  const handleCreateBlog = () => {
    router.push(`manageblogs/BlogCreate`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Blogs</h1>

      {adminMode && (
        <div className="mt-4">
          <button
            onClick={() => {
              handleCreateBlog();
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Create Blog
          </button>
        </div>
      )}

      <ul className="mt-4 space-y-4">
        {Blogs.map((Blog) => (
          <li
            key={Blog.name}
            className="flex justify-between items-center  border-b border-gray-300"
          >
            <span
              className="cursor-pointer text-blue-500 hover:underline"
              onClick={() => router.push(`/blogs/${Blog.name}`)}
            >
              {Blog.name}
            </span>
            {adminMode && (
              <button
                onClick={() =>
                  router.push(`manageblogs/BlogUpdate/${Blog.name}`)
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

export default BlogList;
