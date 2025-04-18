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
  const params = await props.params;
  const siteId = params.site;

  let name = params.name;
  name = decodeURIComponent(name); // Replace %20 with space

  const currentPage = await getCurrentPage(siteId!, name);
  return (
    <div>
      <PageDisplay page={currentPage} siteId={siteId!} />
    </div>
  );
}
