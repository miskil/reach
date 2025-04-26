import { Metadata } from "next";
import CourseBuilder from "@/components/ui/custom/coursebuilder";

interface Props {
  params: Promise<{
    site: string;
    name: string;
  }>;
}
export default async function CurrentCourse(props: Props) {
  const { site, name } = await props.params;
  //const {siteId} = params.site; // Access the [site] slug from the URL
  //let name = params.name;
  const name1 = decodeURIComponent(name); // Replace %20 with space

  //const currentCourse = await getCoursebyTitle(site!, name1);
  //<CourseEditor initialCourse={currentCourse![0]} siteId={siteId!} />;
  return (
    <div>
      <CourseBuilder
        siteId={site}
        initialCourse={{
          id: "1",
          siteId: site,
          name: "Example Course", // Ensure this is properly initialized
          content_id: `course-${Date.now()}`,
          content: "Course content",
          modules: [],
        }}
      />
    </div>
  );
}
