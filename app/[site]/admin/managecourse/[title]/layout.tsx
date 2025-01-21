import CourseEditor from "../../../../compo/CourseEditor";
import { headers } from "next/headers";

import { getCoursebyTitle } from "../../../../../lib/actions";
import { Course } from "@/lib/types";

interface LayoutProps {
  children: React.ReactNode;
  params: { name: string };
}
export default async function courselayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { title: string }; // Dynamic route parameter
}) {
  const blankCourse = {
    title: "",
    pageUrl: "",
    modules: [],
  };
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");

  const currentCourse = await getCoursebyTitle(siteId!, params.title);

  return (
    <main className="min-h-screen p-4">
      <div className="flex flex-col lg:flex-row overflow-y-scroll bg-gray-1100 bg-[url('/grid.svg')] pb-36">
        {/* Sidebar  */}
        <div className="lg:w-60 lg:flex-shrink-0">
          <CourseEditor siteId={siteId || ""} initialCourse={currentCourse!} />
        </div>

        {/* Divider */}
        <div className="w-1 bg-gray-200"></div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-0 text-left">{children}</div>
      </div>
    </main>
  );
}
