import { Metadata } from "next";
import { headers } from "next/headers";
import PageEditor from "@/components/ui/custom/PageEditor";

import { getCurrentPage } from "../../../../../lib/actions";

interface Props {
  params: Promise<{
    site: string;
    title: string;
    module: string;
  }>;
}
export default async function CoursePage(props: Props) {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");
  const params = await props.params;
  let name = params.module;
  const site = params.site;
  name = decodeURIComponent(name); // Replace %20 with space

  const currentPage = await getCurrentPage(siteId!, name);

  return (
    <div>
      <PageEditor page={currentPage!} siteId={siteId!} />
    </div>
  );
}
