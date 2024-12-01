// app/[slug]/layout.tsx
import { headers } from "next/headers";

import Header from "@/components/ui/custom/testheader";
import SiteHeader from "@/components/ui/custom/siteheader";

import SiteHeaderUI from "@/components/ui/custom/siteheaderui";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function SlugLayout({ children }: LayoutProps) {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");

  return (
    <section className="flex flex-col min-h-screen">
      <SiteHeader siteid={siteId!} HeaderUI={SiteHeaderUI} />
      {/*<Header />*/}
      {children}
    </section>
  );
}
