"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/lib/auth";
import { Trash2, Edit, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { deleteCourse } from "@/lib/actions";
import { subdomainURL } from "@/lib/utils";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleDeleteCourse = async (course_id: string) => {
    try {
      setIsDeleting(true);

      // Call the server action to delete the course
      const result = await deleteCourse(siteId, course_id);

      if (!result.success) {
        throw new Error(result.error || "Failed to delete course");
      }

      toast.success("Course deleted successfully");
      // Update the courses state to remove the deleted course
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== course_id)
      );

      // Redirect to courses list page
      const gotoPath = subdomainURL(siteId, "admin/managecourse");
      router.push(gotoPath);
      router.refresh(); // Refresh the router to ensure data is up-to-date
    } catch (error) {
      console.error("Error deleting course:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Error deleting course: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
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
                  onClick={() => setShowDeleteDialog(true)}
                  className=" text-black px-4 py-2 rounded"
                >
                  <Trash2 />
                </button>
                {/* Confirmation Dialog */}
                <AlertDialog
                  open={showDeleteDialog}
                  onOpenChange={setShowDeleteDialog}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Course</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{course.name}"? This
                        action cannot be undone. All course content and
                        associated data will be permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setShowDeleteDialog(false)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteCourse(course.id)} // Pass course.id to deleteCourse
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
