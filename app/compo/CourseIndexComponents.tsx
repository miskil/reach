import React, { useState } from "react";
import { useAdminMode } from "../context/adminmodecontext"; // Ensure this path is correct

interface CourseIndexComponentsProps {
  courses: Array<{
    id: string;
    title: string;
    modules: Array<{
      id: string;
      title: string;
      topics: Array<{
        id: string;
        title: string;
        type: string; // 'normal' or 'test'
      }>;
    }>;
  }>;
  onAddCourse: (title: string) => void;
  onAddModule: (courseId: string, title: string) => void;
  onAddTopic: (moduleId: string, title: string, type: string) => void;
  onLinkSection: (itemId: string, sectionId: string) => void;
}

const CourseIndexComponents: React.FC<CourseIndexComponentsProps> = ({
  courses,
  onAddCourse,
  onAddModule,
  onAddTopic,
  onLinkSection,
}) => {
  const adminMode = true;
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemType, setNewItemType] = useState("course");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [linkSectionId, setLinkSectionId] = useState("");

  const handleAddItem = () => {
    if (newItemType === "course") {
      onAddCourse(newItemTitle);
    } else if (newItemType === "module" && selectedCourseId) {
      onAddModule(selectedCourseId, newItemTitle);
    } else if (newItemType === "topic" && selectedModuleId) {
      onAddTopic(selectedModuleId, newItemTitle, "normal");
    } else if (newItemType === "test" && selectedModuleId) {
      onAddTopic(selectedModuleId, newItemTitle, "test");
    }
    setNewItemTitle("");
  };

  const handleLinkSection = (itemId: string) => {
    onLinkSection(itemId, linkSectionId);
    setLinkSectionId("");
  };

  return (
    <div className="course-index">
      {adminMode && (
        <div className="add-item">
          <select
            value={newItemType}
            onChange={(e) => setNewItemType(e.target.value)}
          >
            <option value="course">Add Course</option>
            <option value="module">Add Module</option>
            <option value="topic">Add Topic</option>
            <option value="test">Add Test</option>
          </select>
          <input
            type="text"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            placeholder="Title"
          />
          {newItemType === "module" && (
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          )}
          {(newItemType === "topic" || newItemType === "test") && (
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
            >
              <option value="">Select Module</option>
              {courses.flatMap((course) =>
                course.modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))
              )}
            </select>
          )}
          <button onClick={handleAddItem}>Add</button>
        </div>
      )}
      <div className="course-list">
        {courses.map((course) => (
          <div key={course.id} className="course-item">
            <h3>{course.title}</h3>
            {adminMode && (
              <div>
                <input
                  type="text"
                  value={linkSectionId}
                  onChange={(e) => setLinkSectionId(e.target.value)}
                  placeholder="Section ID"
                />
                <button onClick={() => handleLinkSection(course.id)}>
                  Link Section
                </button>
              </div>
            )}
            <div className="module-list">
              {course.modules.map((module) => (
                <div key={module.id} className="module-item">
                  <h4>{module.title}</h4>
                  {adminMode && (
                    <div>
                      <input
                        type="text"
                        value={linkSectionId}
                        onChange={(e) => setLinkSectionId(e.target.value)}
                        placeholder="Section ID"
                      />
                      <button onClick={() => handleLinkSection(module.id)}>
                        Link Section
                      </button>
                    </div>
                  )}
                  <div className="topic-list">
                    {module.topics.map((topic) => (
                      <div key={topic.id} className="topic-item">
                        <p>{topic.title}</p>
                        {adminMode && (
                          <div>
                            <input
                              type="text"
                              value={linkSectionId}
                              onChange={(e) => setLinkSectionId(e.target.value)}
                              placeholder="Section ID"
                            />
                            <button onClick={() => handleLinkSection(topic.id)}>
                              Link Section
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseIndexComponents;
