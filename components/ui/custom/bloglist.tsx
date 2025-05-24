"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/lib/auth";
import { Trash2, Edit } from "lucide-react";
import { blogsType } from "@/lib/db/schema";

interface BlogListProps {
  siteId: string;
  Blogs: blogsType[];
}

const BlogList: React.FC<BlogListProps> = ({
  siteId: siteId,
  Blogs: initialBlogs,
}) => {
  const [blogs, setBlogs] = useState<blogsType[]>(initialBlogs);
  const { user, setUser, adminMode, setAdminMode } = useUser();
  const router = useRouter();
  const pathname = usePathname(); // Use usePathname to get the current path

  // Check if the current path includes "admin"
  const isAdminPath = pathname.includes("admin");
  setAdminMode(isAdminPath);
  let blogPath;
  if (isAdminPath) blogPath = `manageblogs/BlogUpdate`;
  else blogPath = `blogs`;
  console.log("user", user);
  console.log("adminMode", adminMode);
  console.log("siteId", siteId);

  const handleCreateBlog = () => {
    router.push(`manageblogs/BlogCreate`);
  };

  const handleDeleteBlog = () => {
    //call delete course sarver action
  };

  return (
    <div className="p-4 text-xsm">
      <h1 className="text-2xl font-bold mb-4">Blogs</h1>
      {adminMode && (
        <div className="mt-4">
          <button
            onClick={handleCreateBlog}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create New Blog
          </button>
        </div>
      )}

      {/*
    
      */}

      <ul className="mt-4 space-y-2">
        {blogs.map((blog) => (
          <li
            key={blog.id}
            className="flex justify-between items-center  border-b border-gray-300"
          >
            {adminMode ? (
              <span>{blog.name}</span>
            ) : (
              <span
                className="cursor-pointer text-blue-500 hover:underline"
                onClick={() => router.push(`${blogPath}/${blog.name}`)}
              >
                {blog.name}
              </span>
            )}
            {adminMode && (
              <div>
                <button
                  onClick={() => router.push(`${blogPath}/${blog.name}`)}
                  className=" text-black px-4 py-2 rounded"
                >
                  <Edit />
                </button>

                <button
                  onClick={handleDeleteBlog}
                  className=" text-black px-4 py-2 rounded"
                >
                  <Trash2 />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
