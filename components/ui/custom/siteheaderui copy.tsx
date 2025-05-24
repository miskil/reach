"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
//import dynamic from "next/dynamic";
import { subdomainURL } from "@/lib/utils";

import { redirect } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";

import { upsertSiteData } from "@/lib/actions";
import AdminBar from "./AdminBar";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUnsavedChanges } from "@/lib/useUnsavedChanges";

import { useUser } from "@/lib/auth";
import {
  signOut,
  isSiteRegistered,
  getSiteHeaderElements,
} from "@/lib/actions";
import { useRouter, usePathname } from "next/navigation";
import { SiteHeader as SiteHeaderType } from "@/lib/db/schema";
import { getUser } from "@/lib/db/queries";
import { TextContent } from "@/lib/types";
import RichTextEditor, { RichTextEditorHandle } from "./richEditor"; // Assuming you have a RichTextEditor component
import RichTextPreview from "./RichTextPreview";
import { ViewHorizontalIcon } from "@radix-ui/react-icons";
type SiteHeaderProps = {
  siteid: string;
  headerdata: SiteHeaderType;
};

export default function SiteHeaderUI({ siteid, headerdata }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const { user, setUser, modifyMode, setModifyMode, adminMode, setAdminMode } =
    useUser();
  const [bkgImageFile, setBkgImageFile] = useState<File | null>(null);
  const [contentStyle, setContentStyle] = useState<React.CSSProperties>({});
  const [editorSize, setEditorSize] = useState({
    width: "w-[600px]",
    height: "h-[300px]",
  });
  const [outputSize, setOutputSize] = useState({
    width: "w-[600px]",
    height: "h-[300px]",
  });
  const editorRef = useRef<RichTextEditorHandle>(null);

  /* ─────────────── quill toolbar ─────────────── */

  useEffect(() => {
    if (user) {
      setAdminMode(true);
    }
  }, [user]);

  const [preview, setpreview] = useState(false);

  const close = () => setIsMenuOpen(false);

  const [loading, setLoading] = useState(false);

  const editor = useRef(null);
  const [content, setContent] = useState<TextContent>(
    (headerdata?.content as TextContent) || { textHtml: "" }
  );
  const [html, setHtml] = useState(content.textHtml);
  const [siteIcon, setSiteIcon] = useState<string>(
    headerdata?.siteiconURL || "/favicon.ico"
  );
  const [newIconFile, setNewIconFile] = useState<File | null>(null);
  const [newBgImageFile, setNewBgImageFile] = useState<File | null>(null);
  const Base = `${process.env.NEXT_PUBLIC_BASE_URL}/${siteid}`;

  useEffect(() => {
    setContent((headerdata?.content as TextContent) || { text: "" });
    setSiteIcon(headerdata?.siteiconURL!);
  }, [headerdata]);

  useUnsavedChanges(isDirty);
  async function handleSave() {
    const updated = {
      ...content,
      textHtml: html,
      contentStyle: editorRef.current?.getStyle() || {},
      bkgImageFile: bkgImageFile || null,
      width: content.width || "100%",
      height: "100%",
    };
    setContent(updated); // optional, if needed elsewhere
    setIsDirty(false);

    const formData = new FormData();
    formData.append("siteId", siteid);
    formData.append("siteHeader", JSON.stringify(updated)); // ✅ use updated, not stale state
    formData.append("siteIcon", newIconFile || "");

    await upsertSiteData(formData);

    alert("header saved!");
  }
  const handleUpdatehandleUpdate = () => {
    const updated = {
      ...content,
      textHtml: html,
      contentStyle: editorRef.current?.getStyle() || {},
      bkgImageFile: bkgImageFile || null,
      width: content.width || "100%",
      height: "100%",
    };
    setContent(updated); // Update the content state

    //setContent(updatedContent); // Update the content state

    setIsDirty(true);
    //onUpdate(newContent);
  };
  const handleBkgImageFileChange = (file: File) => {
    setBkgImageFile(file);

    setIsDirty(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewIconFile(file);
      setSiteIcon(URL.createObjectURL(file)); // Show a preview of the uploaded image
      setIsDirty(true);
    }
  };
  return (
    <header className="border-b border-gray-200 w-full">
      <AdminBar siteid={siteid} />
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Different layout approach - flex column on mobile, position relative on larger screens */}
        <div className="w-full min-h-[10vh] sm:min-h-[12vh] flex flex-col sm:block relative py-3 sm:py-4">
          {/* Site Icon - rendered first in mobile flow, positioned absolutely on larger screens */}
          <div className="flex justify-center mb-3 sm:mb-0 sm:absolute sm:left-4 md:left-6 sm:top-1/2 sm:-translate-y-1/2 sm:z-10">
            <div className="relative">
              <Link
                href={subdomainURL(siteid, "/")}
                className="flex items-center justify-center"
              >
                <Image
                  src={siteIcon || "/favicon.ico"}
                  alt="Logo"
                  width={0}
                  height={0}
                  sizes="(max-width: 640px) 60px, (max-width: 768px) 60px, 70px"
                  className="w-[60px] h-[60px] sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px]"
                  unoptimized
                />
              </Link>

              {modifyMode && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  title="Upload Site Icon"
                />
              )}
            </div>
          </div>

          {/* Content/Preview - rendered second in mobile flow */}
          <div className="w-full">
            {modifyMode ? (
              <div className="relative">
                {isDirty && (
                  <button
                    onClick={handleSave}
                    className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded z-20 shadow-md text-xs sm:text-sm transition-colors"
                  >
                    Save
                  </button>
                )}
                <RichTextEditor
                  ref={editorRef}
                  id="siteheader-editor"
                  initialContent={content?.textHtml || ""}
                  initialStyle={content.contentStyle || {}}
                  onChange={(html) => {
                    setHtml(html);
                    setIsDirty(true);
                  }}
                  className="w-full min-h-[10vh] sm:min-h-[10vh] sm:pl-20 md:pl-28"
                  onBkgImageFileChange={handleBkgImageFileChange}
                />
              </div>
            ) : (
              <div
                className="w-full min-h-[10vh] sm:min-h-[12vh] sm:pl-20 md:pl-28 py-2"
                style={content.contentStyle}
                dangerouslySetInnerHTML={{ __html: content.textHtml }}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
