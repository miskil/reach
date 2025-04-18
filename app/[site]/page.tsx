import { getCurrentPage } from "@/lib/actions";
import { headers } from "next/headers";
import PageDisplay from "@/components/ui/custom/PageDisplay";

export default async function SiteHomePage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params; // Access the [site] slug from the URL
  const currentPage = await getCurrentPage(site!, "home");

  if (!currentPage) {
    return <div>Home Page not found for {site}</div>;
  } else {
    return (
      <div>
        <PageDisplay page={currentPage} siteId={site!} />
      </div>
    );
  }
}
