import { Metadata } from "next";
import { headers } from "next/headers";
import CourseEditor from "@/components/ui/custom/CourseEditor";

import { getCoursebyTitle } from "@/lib/actions";

interface Props {
  params: Promise<{
    site: string;
    name: string;
  }>;
}
export default async function CurrentCourse(props: Props) {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");
  const params = await props.params;
  let name = params.name;
  name = decodeURIComponent(name); // Replace %20 with space

  const currentCourse = await getCoursebyTitle(siteId!, name);
  //<CourseEditor initialCourse={currentCourse![0]} siteId={siteId!} />;
  return (
    <div>
      <p>Course coming soon!</p>
    </div>
  );
}
