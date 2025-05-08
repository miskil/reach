"use client";

import { useState } from "react";
import { blogsType } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/auth";

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

  const router = useRouter();

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
            className="flex justify-between items-center p-4 border rounded"
          >
            <span>{Blog.name}</span>
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
