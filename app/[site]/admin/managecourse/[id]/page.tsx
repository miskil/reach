import { Metadata } from "next";
import { headers } from "next/headers";
import CourseBuilder from "@/components/ui/custom/coursebuilder";

import { getCoursebyId } from "@/lib/actions";

interface Props {
  params: Promise<{
    site: string;
    id: string;
  }>;
}
export default async function CurrentCourse(props: Props) {
  const params = await props.params;
  const siteId = params.site;
  let id = params.id;

  const currentCourse = await getCoursebyId(siteId!, id);
  return (
    <div>
      <CourseBuilder initialCourse={currentCourse!} siteId={siteId!} />
    </div>
  );
}
