import { Metadata } from "next";
import { headers } from "next/headers";
import PageDisplay from "@/components/ui/custom/PageEditor";

import { getCurrentPage } from "@/lib/actions";

interface Props {
  params: Promise<{
    site: string;
    name: string;
  }>;
}
export default async function CurrentPage(props: Props) {
  const { site, name } = await props.params;
  //const siteId = params.site;

  //let name = params.name;
  const name1 = decodeURIComponent(name); // Replace %20 with space

  const currentPage = await getCurrentPage(site!, name1);
  return (
    <div>
      {currentPage && <PageDisplay page={currentPage} siteId={site!} />}
    </div>
  );
}
