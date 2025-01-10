import { headers } from "next/headers";
import SiteHeaderEditor from "../../../compo/siteHeaderEditor";
import { getSiteHeaderElements } from "@/lib/actions";
import SiteHeader from "../../../../components/ui/custom/siteheader";
interface SiteHeaderData {
  siteIcon: string;
  siteHeader: string;
  headerColor: string;
  backgroundColor: string;
  backgroundImage: string;
}
export default async function SetSiteHeaderPage() {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");
  const headerData = await getSiteHeaderElements(siteId!);

  return <SiteHeaderEditor siteId={siteId!} header={headerData!} />;
}
