"use client";

import { useState } from "react";
import { createPage, getSitePages } from "@/lib/actions";
import { CourseType } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/auth";
import { Trash2, Edit } from "lucide-react";

interface CourseListProps {
  siteId: string;
  courses: CourseType[];
}

const CourseList: React.FC<CourseListProps> = ({
  siteId: siteId,
  courses: initialCourses,
}) => {
  const [courses, setCourses] = useState<CourseType[]>(initialCourses);
  const { user, setUser, adminMode, setAdminMode } = useUser();

  const router = useRouter();

  const handleCreateCourse = () => {
    router.push(`managecourse/createCourse`);
  };

  const handleDeleteCourse = () => {
    //call delete course sarver action
  };

  return (
    <div className="p-4 text-xsm">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      {adminMode && (
        <div className="mt-4">
          <button
            onClick={handleCreateCourse}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create New Course
          </button>
        </div>
      )}

      {/*
    
      */}

      <ul className="mt-4 space-y-2">
        {courses.map((course) => (
          <li
            key={course.title}
            className="flex justify-between items-center  border-b border-gray-300"
          >
            <span>{course.title}</span>
            {adminMode && (
              <div>
                <button
                  onClick={() => router.push(`managecourse/${course.title}`)}
                  className=" text-black px-4 py-2 rounded"
                >
                  <Edit />
                </button>

                <button
                  onClick={handleDeleteCourse}
                  className=" text-black px-4 py-2 rounded"
                >
                  <Trash2 />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
