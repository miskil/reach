import LayoutRenderer from "../compo/LayoutRenderer";
import { getCurrentPage } from "../../lib/actions";
import { headers } from "next/headers";

export default async function SiteHomePage() {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");
  const currentPage = await getCurrentPage(siteId!, "Page2");

  return (
    <div>
      <p> Display Home Page</p>
    </div>
  );
}
