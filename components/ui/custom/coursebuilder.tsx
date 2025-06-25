"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Eye,
  Copy,
  Clipboard,
  Menu,
  Trash2,
  Loader2,
} from "lucide-react";
import { CourseProps } from "@/lib/types";
import { saveCourse } from "@/lib/actions";
import { useUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { deleteCourse, deleteModule, deleteTopic } from "@/lib/actions";

import RichEditor from "./richEditor";
import RichTextPreview from "./RichTextPreview";
import toast from "react-hot-toast";

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
/*import quillModules from "@/lib/quillConfig"; // Assuming you have a quillModules file for the toolbar configuration

//const ReactQuill: any = dynamic(() => import("react-quill-new"), {
  ssr: false,
});
import "react-quill-new/dist/quill.snow.css";
*/
export default function CourseBuilder({
  siteId,
  mode = "admin",
  initialCourse,
}: {
  siteId: string;
  mode?: "admin" | "normal";
  initialCourse: CourseProps;
}) {
  /* ─────────────── state ─────────────── */
  const [course, setCourse] = useState<CourseProps>(initialCourse);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [activeBlockName, setActiveBlockName] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<any | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { modifyMode } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedItems, setDeletedItems] = useState<{
    courses: string[];
    modules: string[];
    topics: string[];
  }>({
    courses: [],
    modules: [],
    topics: [],
  });

  const router = useRouter();

  const [showDeleteDialog, setShowDeleteDialog] = useState<{
    type: "course" | "module" | "topic";
    id: string;
  } | null>(null);

  const courseEditorId = `course-editorId-${siteId}`;
  const modules = useMemo(
    () => ({
      toolbar: {
        container: `#${courseEditorId}-toolbar`,
      },
    }),
    [courseEditorId]
  );
  /* ─────────────── helper: pick block content ─────────────── */
  const getBlockContent = (content_id: string): string => {
    if (content_id === course.content_id) return course.content;
    for (const m of course.modules) {
      if (m.content_id === content_id) return m.content;
      for (const t of m.topics)
        if (t.content_id === content_id) return t.content;
    }
    return "";
  };

  /* ─────────────── helper: update block content ───────────── */
  const updateBlockContent = (content_id: string, html: string) => {
    setCourse((prev) => {
      if (content_id === prev.content_id) return { ...prev, content: html };

      const modules = prev.modules.map((m) => ({
        ...m,
        content: m.content_id === content_id ? html : m.content,
        topics: m.topics.map((t) =>
          t.content_id === content_id ? { ...t, content: html } : t
        ),
      }));
      return { ...prev, modules };
    });
  };

  /* ─────────────── switch editor after flush ─────────────── */
  const handleBlockClick = (id: string, name: string) => {
    // Let any pending setCourse finish, then switch
    setTimeout(() => {
      setActiveBlockId(id);
      setActiveBlockName(name);
    }, 0);
  };

  /* ─────────────── save entire course (button) ───────────── */
  const handleSaveCourse = async () => {
    try {
      // First, handle deletions
      for (const courseId of deletedItems.courses) {
        await handleDeleteCourse(courseId);
      }
      for (const moduleId of deletedItems.modules) {
        await handleDeleteModule(moduleId);
      }
      for (const topicId of deletedItems.topics) {
        await handleDeleteTopic(topicId);
      }
      await saveCourse(siteId, course);
      console.log("Course saved!");
      alert("Course saved!");
    } catch (err) {
      console.error(err);
      alert(err);
    }
  };
  const handleFrontendDelete = (
    type: "course" | "module" | "topic",
    id: string
  ) => {
    const isExisting = (type: "module" | "topic", id: string) => {
      if (type === "module") {
        return !id.startsWith("module-temp-id"); // Existing if it does NOT start with "module-temp-id"
      } else if (type === "topic") {
        return !id.startsWith("topic-temp-id"); // Existing if it does NOT start with "topic-temp-id"
      }
      return false; // Default case (shouldn't happen)
    };
    if (type === "module" || type === "topic") {
      if (isExisting(type, id)) {
        setDeletedItems((prev) => ({
          ...prev,
          [type === "module" ? "modules" : "topics"]: [
            ...prev[type === "module" ? "modules" : "topics"],
            id,
          ],
        }));
      }
    } else if (type === "course") {
      setDeletedItems((prev) => ({
        ...prev,
        courses: [...prev.courses, id],
      }));
    }

    // Remove the item from the visible course object
    if (type === "course") {
      setCourse({
        ...course,
        name: "",
        content: "",
        modules: [],
      });
    } else if (type === "module") {
      setCourse((prev) => ({
        ...prev,
        modules: [...prev.modules].filter((module) => module.id !== id),
      }));
    } else if (type === "topic") {
      setCourse((prev) => ({
        ...prev,
        modules: prev.modules.map((module) => ({
          ...module,
          topics: [...module.topics].filter((topic) => topic.id !== id),
        })),
      }));
    }
  };

  async function handleDeleteCourse(courseId: string) {
    const result = await deleteCourse(siteId, courseId);

    if (!result.success) {
      throw new Error(result.error || "Failed to delete course");
    }
  }
  async function handleDeleteModule(moduleId: string) {
    if (!moduleId) return;
    const result = await deleteModule(siteId, moduleId);
    if (!result.success) {
      throw new Error(result.error || "Failed to delete Module");
    }
  }

  async function handleDeleteTopic(topicId: string) {
    if (!topicId) return;
    const result = await deleteTopic(siteId, topicId);
    if (!result.success) {
      throw new Error(result.error || "Failed to delete Topic");
    }
  }

  const handleDelete = async () => {
    if (!showDeleteDialog) return; // Ensure there is a valid dialog state

    try {
      setIsDeleting(true);

      // Call the appropriate delete function based on the type
      if (showDeleteDialog.type === "course") {
        await handleDeleteCourse(showDeleteDialog.id); // Delete the course
      } else if (showDeleteDialog.type === "module") {
        await handleDeleteModule(showDeleteDialog.id); // Delete the module
      } else if (showDeleteDialog.type === "topic") {
        await handleDeleteTopic(showDeleteDialog.id); // Delete the topic
      }

      // Show success toast
      toast.success("Deleted successfully");

      // Refresh or update the UI
      router.refresh();
    } catch (error) {
      console.error("Error deleting:", error);

      // Show error toast

      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Error deleting course: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(null); // Close the dialog
    }
  };

  /* ─────────────── render quill editor ───────────── */
  const renderBlockEditor = (blockId: string, name: string) => (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">{name}</h2>

      {modifyMode ? (
        <RichEditor
          id={blockId} // remount per block
          initialContent={getBlockContent(blockId)}
          onChange={(html: string) => updateBlockContent(blockId, html)}
        />
      ) : (
        <RichTextPreview html={getBlockContent(blockId)} />
      )}
    </div>
  );

  /* ---------- UI helpers (add/copy etc.) stay unchanged ---------- */
  const addModule = () => {
    setCourse((p) => ({
      ...p,
      modules: [
        ...(p.modules || []),
        {
          id: "module-temp-id-" + Date.now(),

          name: "New Module",
          content_id: `module-content-${Date.now()}`,
          content: "",
          contentStyle: {},
          bkgImageFile: null,
          width: "100%",
          height: "100%",
          topics: [],
        },
      ],
    }));
  };

  const addTopic = (moduleId: string) => {
    setCourse((p) => ({
      ...p,
      modules: p.modules.map((m) =>
        m.content_id === moduleId
          ? {
              ...m,
              topics: [
                ...m.topics,
                {
                  id: "topic-temp-id-" + Date.now(),
                  name: "New Topic",
                  content_id: `topic-content-${Date.now()}`,
                  content: "",
                  contentStyle: {},
                  bkgImageFile: null,
                  width: "100%",
                  height: "100%",
                },
              ],
            }
          : m
      ),
    }));
  };

  const copyModuleToClipboard = (m: any) =>
    setCopiedItem({ type: "module", content: m });
  const copyTopicToClipboard = (t: any) =>
    setCopiedItem({ type: "topic", content: t });

  const pasteCopiedItem = (targetModuleId: string) => {
    if (!copiedItem) return;
    if (copiedItem.type === "module") {
      addModule();
    } else {
      setCourse((p) => ({
        ...p,
        modules: p.modules.map((m) =>
          m.content_id === targetModuleId
            ? {
                ...m,
                topics: [
                  ...m.topics,
                  {
                    ...copiedItem.content,
                    blockId: `block-topic-${Date.now()}`,
                  },
                ],
              }
            : m
        ),
      }));
    }
    setCopiedItem(null);
  };

  /* ─────────────── UI layout ─────────────── */
  return (
    <div className="md:flex h-screen relative">
      {/* mobile header */}
      <div className="md:hidden flex items-center justify-between p-4">
        <h1 className="text-lg font-semibold">{course.name}</h1>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* sidebar */}
      <aside
        className={`
    bg-white/80 backdrop-blur-sm border-r shadow-lg
    transition-transform duration-300 ease-in-out z-30
    overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100
    h-[calc(100vh-4rem)]
    md:relative md:top-0 md:w-1/3 md:translate-x-0 md:block
    fixed top-20 left-0 w-3/4
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        {modifyMode && (
          <div className="flex justify-end mb-4">
            <Button onClick={handleSaveCourse}>Save</Button>
          </div>
        )}

        {/* course card */}
        <div className="rounded-2xl shadow-sm">
          <div className="p-4">
            <div className="flex justify-between items-center">
              {modifyMode ? (
                <input
                  value={course.name}
                  onChange={(e) =>
                    setCourse({ ...course, name: e.target.value })
                  }
                  className="font-semibold bg-white rounded px-2 py-1"
                />
              ) : (
                <h2
                  className="font-semibold cursor-pointer"
                  onClick={() =>
                    handleBlockClick(course.content_id, course.name)
                  }
                >
                  {course.name}
                </h2>
              )}

              <div className="flex gap-2">
                {modifyMode && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      handleBlockClick(course.content_id, course.name)
                    }
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                )}
                {modifyMode && (
                  <Button size="icon" variant="ghost" onClick={addModule}>
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
                {modifyMode && copiedItem?.type === "module" && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => pasteCopiedItem(course.content_id)}
                  >
                    <Clipboard className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* modules */}
            <div className="mt-4 space-y-4">
              {course.modules.map((m) => (
                <div key={m.content_id} className="rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-center">
                    {modifyMode ? (
                      <input
                        value={m.name}
                        onChange={(e) =>
                          setCourse((p) => ({
                            ...p,
                            modules: p.modules.map((x) =>
                              x.content_id === m.content_id
                                ? { ...x, name: e.target.value }
                                : x
                            ),
                          }))
                        }
                        className="text-sm bg-white font-medium rounded px-2 py-1"
                      />
                    ) : (
                      <h3
                        className="text-sm font-medium cursor-pointer"
                        onClick={() => handleBlockClick(m.content_id, m.name)}
                      >
                        {m.name}
                      </h3>
                    )}

                    <div className="flex gap-1">
                      {modifyMode && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleBlockClick(m.content_id, m.name)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      {modifyMode && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => copyModuleToClipboard(m)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          {copiedItem?.type === "topic" && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => pasteCopiedItem(m.content_id)}
                            >
                              <Clipboard className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => addTopic(m.content_id)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              setShowDeleteDialog({
                                type: "module",
                                id: m.id ?? "",
                              })
                            }
                            className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* topics */}
                  <ul className="mt-2 space-y-1 text-sm pl-4">
                    {m.topics.map((t) => (
                      <li
                        key={t.content_id}
                        className="flex justify-between items-center"
                      >
                        {modifyMode ? (
                          <input
                            value={t.name}
                            onChange={(e) =>
                              setCourse((p) => ({
                                ...p,
                                modules: p.modules.map((x) =>
                                  x.content_id === m.content_id
                                    ? {
                                        ...x,
                                        topics: x.topics.map((y) =>
                                          y.content_id === t.content_id
                                            ? { ...y, name: e.target.value }
                                            : y
                                        ),
                                      }
                                    : x
                                ),
                              }))
                            }
                            className="bg-white rounded px-2 py-1"
                          />
                        ) : (
                          <span
                            className="cursor-pointer"
                            onClick={() =>
                              handleBlockClick(t.content_id, t.name)
                            }
                          >
                            {t.name}
                          </span>
                        )}

                        <div className="flex gap-1">
                          {modifyMode && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                handleBlockClick(t.content_id, t.name)
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          {modifyMode && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => copyTopicToClipboard(t)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          )}
                          {modifyMode && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                setShowDeleteDialog({
                                  type: "topic",
                                  id: t.id ?? "",
                                })
                              }
                              className="text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <AlertDialog
          open={!!showDeleteDialog}
          onOpenChange={() => setShowDeleteDialog(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete {showDeleteDialog?.type}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this {showDeleteDialog?.type}?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowDeleteDialog(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  handleFrontendDelete(
                    showDeleteDialog!.type,
                    showDeleteDialog!.id
                  )
                }
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
      </aside>

      {/* editor pane */}
      <main className="md:w-2/3 flex-1 p-4 ml-auto">
        {activeBlockId && renderBlockEditor(activeBlockId, activeBlockName!)}
      </main>
    </div>
  );
}
