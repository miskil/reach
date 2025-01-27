// Fetch menu data

import { headers } from "next/headers";
import SetMenusForm from "@/components/ui/custom/setmenusform";
import SiteHeader from "@/components/ui/custom/siteheader";
import { getMenuItems } from "@/lib/actions";

export default async function SetMenusPage() {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");
  const menus = await getMenuItems(siteId!);

  return <SetMenusForm siteid={siteId!} menusdata={menus} />;
}
