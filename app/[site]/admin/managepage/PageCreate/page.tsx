import PageEditor from "app/compo/PageEditor";
import { PageType } from "../../../../../lib/db/schema";
import { headers } from "next/headers";

export default async function PageCreate() {
  const pageData: PageType = {
    id: 1,
    siteId: "",
    name: "New Page",
    layout: "defaultLayout",
    content: {},
    menuItem: "exampleMenuItem",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  };
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");

  return (
    <div>
      <PageEditor page={pageData} siteId={siteId!} />
    </div>
  );
}
