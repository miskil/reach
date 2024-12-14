import { headers } from "next/headers";
import SetPageForm from "../../../../components/ui/custom/setpageform";

export default async function SetPage() {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");

  return <SetPageForm siteid={siteId!} />;
}
