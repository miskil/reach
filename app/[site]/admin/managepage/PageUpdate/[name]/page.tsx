import { Metadata } from "next";

import PageEditor from "@/components/ui/custom/PageEditor";

import { getCurrentPage } from "@/lib/actions";

interface Props {
  params: Promise<{
    site: string;
    name: string;
  }>;
}
export default async function CurrentPage(props: Props) {
  const params = await props.params;
  let name = params.name;
  const siteId = params.site;
  name = decodeURIComponent(name); // Replace %20 with space

  const currentPage = await getCurrentPage(siteId!, name);
  return (
    <div>
      <PageEditor page={currentPage!} siteId={siteId!} />
    </div>
  );
}
