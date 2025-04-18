import { headers } from "next/headers";
import CourseList from "@/components/ui/custom/CourseList";
import { getCourses } from "@/lib/actions";

export default async function ManageCourses({
  params,
}: {
  params: { site: string };
}) {
  const siteId = params.site;

  if (!siteId) {
    return <div>Error: Site ID is missing .</div>;
  }

  let courses;
  try {
    courses = await getCourses(siteId);
  } catch (error) {
    console.error("Failed to fetch site pages:", error);
    return <div>Error: Failed to fetch site courses.</div>;
  }

  return <CourseList siteId={siteId} courses={courses} />;
}
