"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/lib/auth";
import { Trash2, Edit } from "lucide-react";

interface CourseListProps {
  siteId: string;
  courses: { name: string; id: string }[];
}

const CourseList: React.FC<CourseListProps> = ({
  siteId: siteId,
  courses: initialCourses,
}) => {
  const [courses, setCourses] =
    useState<{ name: string; id: string }[]>(initialCourses);
  const { user, setUser, adminMode, setAdminMode } = useUser();
  const router = useRouter();
  const pathname = usePathname(); // Use usePathname to get the current path

  // Check if the current path includes "admin"
  const isAdminPath = pathname.includes("admin");
  setAdminMode(isAdminPath);
  let coursePath;
  if (isAdminPath) coursePath = `managecourse`;
  else coursePath = `course`;
  console.log("user", user);
  console.log("adminMode", adminMode);
  console.log("siteId", siteId);

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
            key={course.id}
            className="flex justify-between items-center  border-b border-gray-300"
          >
            {adminMode ? (
              <span>{course.name}</span>
            ) : (
              <span
                className="cursor-pointer text-blue-500 hover:underline"
                onClick={() => router.push(`${coursePath}/${course.id}`)}
              >
                {course.name}
              </span>
            )}
            {adminMode && (
              <div>
                <button
                  onClick={() => router.push(`${coursePath}/${course.id}`)}
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
