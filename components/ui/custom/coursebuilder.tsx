"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Eye, Copy, Clipboard, Menu } from "lucide-react";
import { CourseProps } from "@/lib/types";
import { saveCourse } from "@/lib/actions";
import { useUser } from "@/lib/auth";

const ReactQuill: any = dynamic(() => import("react-quill-new"), {
  ssr: false,
});
import "react-quill-new/dist/quill.snow.css";

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

  /* ─────────────── quill toolbar ─────────────── */
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      ["link", "blockquote", "code-block"],
      [{ color: ["#f00", "#0f0", "#00f", "#ff0"] }, { background: [] }],
      ["image"],
    ],
  };

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
      await saveCourse(siteId, course);
      console.log("Course saved!");
      alert("Course saved!");
    } catch (err) {
      console.error(err);
      alert(err);
    }
  };

  /* ─────────────── render quill editor ───────────── */
  const renderBlockEditor = (blockId: string, name: string) => (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Editing Block: {name}</h2>
      <ReactQuill
        key={blockId} // remount per block
        value={getBlockContent(blockId)}
        onChange={(html: string) => updateBlockContent(blockId, html)}
        modules={modules}
        readOnly={mode === "normal"}
        className="h-80"
      />
    </div>
  );

  /* ---------- UI helpers (add/copy etc.) stay unchanged ---------- */
  const addModule = () => {
    setCourse((p) => ({
      ...p,
      modules: [
        ...(p.modules || []),
        {
          name: "New Module",
          content_id: `module-content-${Date.now()}`,
          content: "",
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
                  name: "New Topic",
                  content_id: `topic-content-${Date.now()}`,
                  content: "",
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
    <div className="md:flex h-screen">
      {/* mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <h1 className="text-lg font-semibold">Course Builder</h1>
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
        className={`md:block bg-gray-50 border-r md:w-1/3 w-full overflow-y-auto p-4 ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        {modifyMode && (
          <div className="flex justify-end mb-4">
            <Button onClick={handleSaveCourse}>Save</Button>
          </div>
        )}

        {/* course card */}
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              {modifyMode ? (
                <input
                  value={course.name}
                  onChange={(e) =>
                    setCourse({ ...course, name: e.target.value })
                  }
                  className="font-semibold border bg-white rounded px-2 py-1"
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
                <div key={m.content_id} className="border rounded-lg p-3">
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
                        className="text-sm bg-white font-medium border rounded px-2 py-1"
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
                            className="border bg-white rounded px-2 py-1"
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
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* editor pane */}
      <main className="md:w-2/3 flex-1 p-4">
        {activeBlockId && renderBlockEditor(activeBlockId, activeBlockName!)}
      </main>
    </div>
  );
}
