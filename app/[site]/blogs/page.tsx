import { headers } from "next/headers";
import BlogList from "@/components/ui/custom/bloglist";
import { getSiteBlogs } from "@/lib/actions";

export default async function Blogs({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params; // Access the [site] slug from the URL

  if (!site) {
    return <div>Error: Site ID is missing .</div>;
  }

  let blogs;
  try {
    blogs = await getSiteBlogs(site);
  } catch (error) {
    console.error("Failed to fetch site blogs:", error);
    return <div>Error: Failed to fetch site blogs.</div>;
  }

  return <BlogList siteId={site} Blogs={blogs} />;
}
