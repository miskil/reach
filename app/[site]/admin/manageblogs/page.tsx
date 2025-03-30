import { headers } from "next/headers";
import BlogList from "@/components/ui/custom/bloglist";
import { getSiteBlogs } from "@/lib/actions";

export default async function ManagePage() {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");

  if (!siteId) {
    return <div>Error: Site ID is missing in the headers.</div>;
  }

  let pages;
  try {
    pages = await getSiteBlogs(siteId);
  } catch (error) {
    console.error("Failed to fetch site pages:", error);
    return <div>Error: Failed to fetch site pages.</div>;
  }

  return <BlogList siteId={siteId} Blogs={pages} />;
}
