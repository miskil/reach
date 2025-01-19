import { getCurrentPage } from "../../../lib/actions";
import { headers } from "next/headers";
import PageDisplay from "../../compo/PageDisplay";

export default async function CoursePage() {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");
  const currentPage = await getCurrentPage(siteId!, "home");

  if (!currentPage) {
    return <div>Home Page not found for {siteId}</div>;
  } else {
    return (
      <div>
        <p>Course Page</p>
        {/*
        <PageDisplay page={currentPage} siteId={siteId!} />
        */}
      </div>
    );
  }
}
