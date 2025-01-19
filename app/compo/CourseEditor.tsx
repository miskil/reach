"use client";
// components/CourseEditor.tsx
import { saveCourse } from "../../lib/actions";
import { useState } from "react";

type Topic = {
  id?: number;
  name: string;
  pageUrl: string;
  order: number;
};

type Module = {
  id?: number;
  name: string;
  pageUrl: string;
  topics: Topic[];
  order: number;
};

type Course = {
  id?: number;
  title: string;
  pageUrl: string;
  modules: Module[];
};

export default function CourseEditor({
  siteId,
  initialCourse,
}: {
  siteId: string;
  initialCourse: Course;
}) {
  const [course, setCourse] = useState<Course>(initialCourse);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleCourseChange = (field: keyof Course, value: string) => {
    setCourse({ ...course, [field]: value });
  };

  const handleModuleChange = (
    index: number,
    field: keyof Module,
    value: string
  ) => {
    const updatedModules = [...course.modules];
    updatedModules[index] = { ...updatedModules[index], [field]: value };
    setCourse({ ...course, modules: updatedModules });
  };

  const handleTopicChange = (
    moduleIndex: number,
    topicIndex: number,
    field: keyof Topic,
    value: string
  ) => {
    const updatedModules = [...course.modules];
    const updatedTopics = [...updatedModules[moduleIndex].topics];
    updatedTopics[topicIndex] = {
      ...updatedTopics[topicIndex],
      [field]: value,
    };
    updatedModules[moduleIndex].topics = updatedTopics;
    setCourse({ ...course, modules: updatedModules });
  };

  const addModule = () => {
    setCourse({
      ...course,
      modules: [
        ...course.modules,
        {
          name: "",
          pageUrl: "",
          topics: [],
          order: course.modules.length + 1,
        },
      ],
    });
  };

  const addTopic = (moduleIndex: number) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics = [
      ...updatedModules[moduleIndex].topics,
      {
        name: "",
        pageUrl: "",
        order: updatedModules[moduleIndex].topics.length + 1,
      },
    ];
    setCourse({ ...course, modules: updatedModules });
  };

  const deleteModule = (moduleIndex: number) => {
    const updatedModules = course.modules.filter(
      (_, index) => index !== moduleIndex
    );
    setCourse({ ...course, modules: updatedModules });
  };
  const handleSave = async () => {
    try {
      await saveCourse(siteId, [course][0]);
      alert("Course saved successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to save course");
    }
  };
  const handleSaveCourse = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await saveCourse(siteId, course);
      alert("Course saved successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to save course");
    }
  };
  const deleteTopic = (moduleIndex: number, topicIndex: number) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics = updatedModules[
      moduleIndex
    ].topics.filter((_, index) => index !== topicIndex);
    setCourse({ ...course, modules: updatedModules });
  };
  const resetCourse = () => {
    setCourse({
      title: "",
      pageUrl: "",
      modules: [],
    });
  };

  return (
    <div className="p-4 text-xs">
      <button
        onClick={() => setIsPreviewMode(!isPreviewMode)}
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
      >
        {isPreviewMode ? "Switch to Modify Mode" : "Switch to Preview Mode"}
      </button>
      {/* Course Title and URL */}
      <form onSubmit={handleSaveCourse}>
        <div className="mb-4">
          <label className="block font-medium mb-2">Course Title</label>
          {isPreviewMode ? (
            <a href={course.pageUrl} className="text-blue-500 underline">
              {course.title}
            </a>
          ) : (
            <input
              type="text"
              placeholder="Course Title"
              value={course.title}
              required
              onChange={(e) => handleCourseChange("title", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          )}

          <input
            type="text"
            placeholder="Course Page URL"
            value={course.pageUrl}
            required
            hidden={isPreviewMode}
            onChange={(e) => handleCourseChange("pageUrl", e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        {/* Modules */}
        <div className="mb-4 text-sm">
          {course.modules.map((module, moduleIndex) => (
            <div key={moduleIndex} className="mb-4 pl-2 md:pl-3 lg:pl-2">
              <div className="flex justify-between items-center">
                <label className="block font-medium mb-2">Module </label>
                {!isPreviewMode && (
                  <button
                    type="button"
                    onClick={() => deleteModule(moduleIndex)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                )}
              </div>{" "}
              {isPreviewMode ? (
                <a href={module.pageUrl} className="text-blue-500 underline">
                  {module.name}
                </a>
              ) : (
                <input
                  type="text"
                  placeholder="Module Title"
                  value={module.name}
                  required
                  onChange={(e) =>
                    handleModuleChange(moduleIndex, "name", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                />
              )}
              <input
                type="text"
                placeholder="Module Page URL"
                required
                value={module.pageUrl}
                hidden
                onChange={(e) =>
                  handleModuleChange(moduleIndex, "pageUrl", e.target.value)
                }
                className="w-full border rounded px-2 py-1 "
              />
              {/* Topics */}
              <div className="mt-4">
                {module.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="mb-2 pl-3 md:pl-3 lg:pl-3">
                    <div className="flex justify-between items-center">
                      <label className="block font-medium mb-2">Topic</label>
                      {!isPreviewMode && (
                        <button
                          type="button"
                          onClick={() => deleteTopic(moduleIndex, topicIndex)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      )}
                    </div>{" "}
                    {isPreviewMode ? (
                      <a
                        href={topic.pageUrl}
                        className="text-blue-500 underline"
                      >
                        {topic.name}
                      </a>
                    ) : (
                      <input
                        type="text"
                        placeholder="Topic Title"
                        value={topic.name}
                        required
                        onChange={(e) =>
                          handleTopicChange(
                            moduleIndex,
                            topicIndex,
                            "name",
                            e.target.value
                          )
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    )}
                    <input
                      type="text"
                      placeholder="Topic Page URL"
                      value={topic.pageUrl}
                      required
                      hidden={isPreviewMode}
                      onChange={(e) =>
                        handleTopicChange(
                          moduleIndex,
                          topicIndex,
                          "pageUrl",
                          e.target.value
                        )
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                ))}
                {!isPreviewMode && (
                  <button
                    type="button"
                    onClick={() => addTopic(moduleIndex)}
                    className="bg-blue-500 text-xs text-white px-4 py-2 rounded"
                  >
                    Add Topic
                  </button>
                )}
              </div>
            </div>
          ))}
          {!isPreviewMode && (
            <button
              type="button"
              onClick={addModule}
              className="bg-blue-500 text-xs text-white px-4 py-2 rounded"
            >
              Add Module
            </button>
          )}
        </div>

        {/* Save Button */}
        {!isPreviewMode && (
          <div className="flex">
            <button
              type="submit"
              className="bg-green-500  text-xs text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={resetCourse}
              className="bg-red-500 text-xs text-white px-4 py-2 rounded ml-2"
            >
              Reset
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
