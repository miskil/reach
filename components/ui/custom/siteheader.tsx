import { ReactNode } from "react";
import Link from "next/link";

import { getUser } from "@/lib/db/queries";
import SiteHeaderUI from "../../ui/custom/siteheaderui";
import Header from "./testheader";
import { getSiteHeaderElements } from "@/lib/actions";

type SiteHeaderProps = {
  siteid: string;
  HeaderUI: React.ElementType;
};

type RenderClientComponentProps = {};

export default async function SiteHeader({
  siteid,
  HeaderUI,
}: SiteHeaderProps) {
  const headerData = await getSiteHeaderElements(siteid!);

  const adminPath = "/" + siteid + "/admin";
  const isMenuOpen = true;

  return (
    <div>
      <HeaderUI siteid={siteid} headerdata={headerData} />
    </div>
  );
}
