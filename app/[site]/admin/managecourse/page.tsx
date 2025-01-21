import { headers } from "next/headers";
import CourseList from "../../../compo/CourseList";
import { getCourses } from "@/lib/actions";

export default async function ManageCourses() {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");

  if (!siteId) {
    return <div>Error: Site ID is missing in the headers.</div>;
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
