import CourseEditor from "@/components/ui/custom/CourseEditor";
import { headers } from "next/headers";

import { getCoursebyTitle } from "@/lib/actions";
import { Course } from "@/lib/types";

export default async function courselayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const blankCourse = {
    id: 0,
    title: "",
    pageUrl: "",
    modules: [],
  };
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");

  return (
    <main className="min-h-screen p-4">
      <div className="flex flex-col lg:flex-row overflow-y-scroll bg-gray-1100 bg-[url('/grid.svg')] pb-36">
        {/* Sidebar  */}
        <div className="lg:w-60 lg:flex-shrink-0">
          <CourseEditor siteId={siteId || ""} initialCourse={blankCourse!} />
        </div>

        {/* Divider */}
        <div className="w-1 bg-gray-200"></div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-0 text-left">{children}</div>
      </div>
    </main>
  );
}
