import LayoutRenderer from "../compo/LayoutRenderer";
import { getCurrentPage } from "../../lib/actions";
import { headers } from "next/headers";
import PageDisplay from "../compo/PageDisplay";

export default async function SiteHomePage() {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");
  const currentPage = await getCurrentPage(siteId!, "Page2");

  return (
    <div>
      <PageDisplay page={currentPage[0]} siteId={siteId!} />
    </div>
  );
}
