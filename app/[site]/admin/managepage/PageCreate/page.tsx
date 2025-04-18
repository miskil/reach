import PageEditor from "@/components/ui/custom/PageEditor";
import { PageType } from "@/lib/db/schema";

export default async function PageCreate({
  params,
}: {
  params: { site: string };
}) {
  const siteId = params.site;
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

  return (
    <div>
      <PageEditor page={pageData} siteId={siteId!} />
    </div>
  );
}
