import { Metadata } from "next";
import { headers } from "next/headers";
import PageEditor from "app/compo/PageEditor";

import { getCurrentPage } from "../../../../../../lib/actions";

type PageProps = {
  params: { name: string }; // Define the type of the dynamic parameter
};

export default async function CurrentPage({ params }: PageProps) {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");

  let { name } = params;
  name = decodeURIComponent(name); // Replace %20 with space

  const currentPage = (await getCurrentPage(siteId!, name))[0];
  return (
    <div>
      <PageEditor page={currentPage} siteId={siteId!} />
    </div>
  );
}
