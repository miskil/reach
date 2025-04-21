import BlogList from "@/components/ui/custom/bloglist";
import { getSiteBlogs } from "@/lib/actions";

export default async function ManagePage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;

  if (!site) {
    return <div>Error: Site ID is missing .</div>;
  }

  let pages;
  try {
    pages = await getSiteBlogs(site);
  } catch (error) {
    console.error("Failed to fetch site pages:", error);
    return <div>Error: Failed to fetch site pages.</div>;
  }

  return <BlogList siteId={site} Blogs={pages} />;
}
