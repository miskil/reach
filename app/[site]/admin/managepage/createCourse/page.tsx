import { headers } from "next/headers";

export default async function CreateCourse() {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");

  return (
    <div>
      <p>{siteId} NEW Course</p>
    </div>
  );
}
