import LayoutRenderer from "../../../../../compo/LayoutRenderer";
import { Metadata } from "next";
import { headers } from "next/headers";
import { getCurrentPage } from "../../../../../../lib/actions";
import BannerSlider from "../../../../../compo/BannerSlider";

import TileGrid from "@/app/compo/TileGrid";
import { PageType } from "@/lib/db/schema";
import ItemDisplay from "@/app/compo/ItemDisplay";

type PageProps = {
  params: {
    menu: string;
    pagelayout: string;
    type: string;
    index: number;
  };
};

export default async function PageComponents({ params }: PageProps) {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");
  const { menu, pagelayout, type, index } = params;

  const currentPage = await getCurrentPage(siteId!, menu);

  if (!currentPage) {
    return <div>Page Not Found</div>;
  }

  return (
    <div>
      <ItemDisplay
        page={currentPage}
        siteId={siteId!}
        itemType={type}
        index={index}
      />
    </div>
  );
}
