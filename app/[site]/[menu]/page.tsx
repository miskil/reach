import { headers } from "next/headers";
import PageDisplay from "app/compo/PageDisplay";
import { getCurrentPage } from "lib/actions";

export default async function MenuPage() {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");
  const menuItem = headersList.get("x-menu");

  const currentPage = await getCurrentPage(siteId!, menuItem!);
  return (
    <div>
      <PageDisplay page={currentPage!} siteId={siteId!} />
    </div>
  );
}
