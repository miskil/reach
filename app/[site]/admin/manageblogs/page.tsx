import BlogList from "@/components/ui/custom/bloglist";
import { getSiteBlogs } from "@/lib/actions";

export default async function ManagePage({
  params,
}: {
  params: { site: string };
}) {
  const siteId = params.site;

  if (!siteId) {
    return <div>Error: Site ID is missing .</div>;
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
