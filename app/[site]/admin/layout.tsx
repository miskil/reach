// app/[slug]/admin/layout.tsx

import GlobalNav from "@/components/ui/global-nav";
import { getUserSiteId } from "@/lib/actions";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: LayoutProps) {
  const slug = (await getUserSiteId()) || "";

  return (
    <div className="[color-scheme:dark]">
      <div className="flex flex-col lg:flex-row overflow-y-scroll bg-gray-1100 bg-[url('/grid.svg')] pb-36">
        {/* Sidebar (GlobalNav) */}
        <div className="lg:w-40 lg:flex-shrink-0">
          <GlobalNav siteId={slug} />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-0 text-left">{children}</div>
      </div>
    </div>
  );
}
