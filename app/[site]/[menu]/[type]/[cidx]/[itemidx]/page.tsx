import { headers } from "next/headers";
import PageDisplay from "app/compo/PageDisplay";
import { getCurrentPage } from "lib/actions";
import { PageType } from "lib/db/schema";
import ItemDisplay from "@/app/compo/ItemDisplay";
interface PageProps {
  params: Promise<{
    site: string;
    pageName: string;
    type: string;
    idxComponent: number;
    index: number;
  }>;
}

export default async function PageComponents({ params }: PageProps) {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");
  const menuItem = headersList.get("x-menu");
  const widgetType = headersList.get("x-wtype");
  const widgetidx = headersList.get("x-widx");
  const itemidx = headersList.get("x-itemidx");

  const currentPage = await getCurrentPage(siteId!, menuItem!);
  return (
    <div>
      <ItemDisplay
        page={currentPage!}
        idxComponent={Number(widgetidx!)}
        siteId={siteId!}
        itemType={widgetType!}
        index={Number(itemidx)} // Convert index to number
      />
    </div>
  );
}
