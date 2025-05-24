import { ReactNode } from "react";
import Link from "next/link";

import { getUser } from "@/lib/db/queries";
import SiteHeaderUI from "../../ui/custom/siteheaderui";

import { getSiteHeaderElements } from "@/lib/actions";
import { SiteHeader as SiteHeaderType } from "@/lib/db/schema";
import { TextContent } from "@/lib/types";

type SiteHeaderProps = {
  siteid: string;
  HeaderUI: React.ElementType;
};

type RenderClientComponentProps = {};

export default async function SiteHeader({
  siteid,
  HeaderUI,
}: SiteHeaderProps) {
  let headerData = await getSiteHeaderElements(siteid!);
  if (!headerData) {
    headerData = {
      id: 0,
      siteId: siteid,
      content: {
        id: "default-id",
        textHtml: "",
        contentStyle: {
          backgroundColor: "#ffffff",
        },
        bkgImageFile: null,
        width: "100%",
        height: "100%",
      } as TextContent,
      siteiconURL: "/favicon.ico", // Default site icon
      createdAt: new Date(),
    };
  }
  console.log("headerData", headerData);
  return (
    <div>
      <HeaderUI siteid={siteid} headerdata={headerData} />
    </div>
  );
}
