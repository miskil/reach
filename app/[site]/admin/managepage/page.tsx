import { headers } from "next/headers";
import PageList from "@/components/ui/custom/pagelist";
import { getSitePages } from "@/lib/actions";

export default async function ManagePage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;

  if (!site) {
    return <div>Error: Site ID is missing in the headers.</div>;
  }

  let pages;
  try {
    pages = await getSitePages(site);
  } catch (error) {
    console.error("Failed to fetch site pages:", error);
    return <div>Error: Failed to fetch site pages.</div>;
  }

  return <PageList siteId={site} pages={pages} admin={true} />;
}
