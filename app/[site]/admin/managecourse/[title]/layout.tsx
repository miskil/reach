import CourseEditor from "@/components/ui/custom/CourseEditor";
import { headers } from "next/headers";

import { getCoursebyTitle } from "@/lib/actions";
import { Course } from "@/lib/types";

interface Props {
  children: React.ReactNode;
  params: Promise<{
    site: string;
    title: string;
  }>;
}

export default async function courselayout({ children, params }: Props) {
  const blankCourse = {
    title: "",
    pageUrl: "",
    modules: [],
  };
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");
  const resolvedParams = await params;
  const courseTitle = resolvedParams.title;
  const currentCourse = await getCoursebyTitle(siteId!, courseTitle);

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
