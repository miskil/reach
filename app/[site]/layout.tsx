// app/[slug]/layout.tsx
import { headers } from "next/headers";

import Header from "@/components/ui/custom/testheader";
import SiteHeader from "@/components/ui/custom/siteheader";

import SiteHeaderUI from "@/components/ui/custom/siteheaderui";
import SiteMenus from "@/components/ui/custom/sitemenus";
import { getMenuItems } from "@/lib/actions";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function SlugLayout({ children }: LayoutProps) {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");
  const menus = await getMenuItems(siteId!);

  return (
    <section className="flex flex-col min-h-screen">
      <SiteHeader siteid={siteId!} HeaderUI={SiteHeaderUI} />
      <SiteMenus siteid={siteId!} menusdata={menus} />

      {/*<Header />*/}
      {children}
    </section>
  );
}
