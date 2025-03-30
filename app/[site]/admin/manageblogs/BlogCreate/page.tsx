import BlogEditor from "@/components/ui/custom/BlogEditor";
import { blogsType } from "@/lib/db/schema";
import { headers } from "next/headers";

export default async function BlogCreate() {
  const blogData: blogsType = {
    id: 1,
    siteId: "",
    name: "New Blog",
    layout: "defaultLayout",
    content: {},
    menuItem: "exampleMenuItem",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  };
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");

  return (
    <div>
      <BlogEditor blog={blogData} siteId={siteId!} />
    </div>
  );
}
