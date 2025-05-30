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
    <section className="flex flex-col min-h-screen w-full">
      {/* Header should have explicit height or grow as needed */}
      <div className="flex-shrink-0">
        <SiteHeader siteid={site!} HeaderUI={SiteHeaderUI} />
      </div>
      {/*<div className="flex-shrink-0">
        <SiteMenus siteid={site!} menusdata={menus} />
      </div>
        */}
      {/* Content fills remaining height */}
      <main className="flex-1 w-full overflow-auto">{children}</main>
    </section>
  );
}
