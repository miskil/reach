// app/[slug]/layout.tsx
import { headers } from "next/headers";

import Header from "@/components/ui/custom/testheader";
import SiteHeader from "@/components/ui/custom/siteheader";

import SiteHeaderUI from "@/components/ui/custom/siteheaderui";
import SiteMenus from "@/components/ui/custom/sitemenus";
import { getMenuItems } from "@/lib/actions";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ site: string }>;
}

export default async function SlugLayout({ children, params }: LayoutProps) {
  const { site } = await params; // Access the [site] slug from the URL

  const menus = await getMenuItems(site!);

  return (
    <section className="flex flex-col min-h-screen max-w-screen-xl mx-auto">
      <SiteHeader siteid={site!} HeaderUI={SiteHeaderUI} />
      <SiteMenus siteid={site!} menusdata={menus} />
      {/*<Header />*/}
      {children}
    </section>
  );
}
