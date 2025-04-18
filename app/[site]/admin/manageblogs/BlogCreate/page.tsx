import BlogEditor from "@/components/ui/custom/BlogEditor";
import { blogsType } from "@/lib/db/schema";
import { headers } from "next/headers";

import { type Metadata } from "next";

export default async function Page({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const blogData: blogsType = {
    id: 1,
    siteId: "",
    name: "New Blog",
    layout: "defaultLayout",
    category: "",
    tags: "", // Comma-separated tags
    author: "Admin", // Default author
    authorbio: "Admin Bio", // Default author bio
    authorimage: "/default-author-image.png", // Default author image
    blogImageURL: "/default-blog-image.png", // Default blog image URL

    content: {},
    menuItem: "exampleMenuItem",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  };
  const { site } = await params;

  return (
    <div>
      <BlogEditor blog={blogData} siteId={site!} />
    </div>
  );
}
