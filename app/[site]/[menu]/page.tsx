import { headers } from "next/headers";
import PageDisplay from "@/components/ui/custom/PageDisplay";
import { getCurrentPage } from "lib/actions";
import { PageType } from "lib/db/schema";

export default async function MenuPage() {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");
  const menuItem = headersList.get("x-menu");

  const currentPage = await getCurrentPage(siteId!, menuItem!);
  return (
    <div>
      <PageDisplay page={currentPage as PageType} siteId={siteId!} />
    </div>
  );
}
