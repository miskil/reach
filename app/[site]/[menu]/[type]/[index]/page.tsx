import { Metadata } from "next";
import { headers } from "next/headers";
import { getCurrentPage } from "../../../../../lib/actions";

import { PageType } from "@/lib/db/schema";
import ItemDisplay from "@/app/compo/ItemDisplay";

interface PageProps {
  params: Promise<{
    site: string;
    menu: string;
    type: string;
    index: number;
  }>;
}

export default async function PageComponents({ params }: PageProps) {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");
  const resolvedParams = await params;
  const { site, menu, type, index } = resolvedParams;

  if (!siteId) {
    return <div>Site ID not found</div>;
  }

  const currentPage = await getCurrentPage(siteId, menu);

  if (!currentPage) {
    return <div>Page Not Found</div>;
  }

  return (
    <div>
      <ItemDisplay
        page={currentPage}
        siteId={siteId}
        itemType={type}
        index={index} // Convert index to number
      />
    </div>
  );
}
