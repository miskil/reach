import { getCurrentPage } from "@/lib/actions";
import { headers } from "next/headers";
import PageDisplay from "@/components/ui/custom/PageDisplay";

export default async function SiteHomePage({
  params,
}: {
  params: { site: string };
}) {
  const siteId = params.site; // Access the [site] slug from the URL
  const currentPage = await getCurrentPage(siteId!, "home");

  if (!currentPage) {
    return <div>Home Page not found for {siteId}</div>;
  } else {
    return (
      <div>
        <PageDisplay page={currentPage} siteId={siteId!} />
      </div>
    );
  }
}
