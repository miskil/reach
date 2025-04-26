import { headers } from "next/headers";
import CourseList from "@/components/ui/custom/CourseList";
import { getCourses } from "@/lib/actions";

export default async function AllCourses({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;

  if (!site) {
    return <div>Error: Site ID is missing .</div>;
  }

  let courses;
  try {
    courses = await getCourses(site);
  } catch (error) {
    console.error("Failed to fetch site pages:", error);
    return <div>Error: Failed to fetch site courses.</div>;
  }

  return <CourseList siteId={site} courses={courses} />;
}
