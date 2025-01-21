import { Metadata } from "next";
import { headers } from "next/headers";
import PageEditor from "app/compo/PageEditor";

import { getCurrentPage } from "../../../../lib/actions";

interface Props {
  params: Promise<{
    site: string;
    name: string;
  }>;
}
export default async function CurrentPage(props: Props) {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");
  const params = await props.params;
  let name = params.name;
  name = decodeURIComponent(name); // Replace %20 with space

  const currentPage = await getCurrentPage(siteId!, name);
  return (
    <div>
      <PageEditor page={currentPage!} siteId={siteId!} />
    </div>
  );
}
