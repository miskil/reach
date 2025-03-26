"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";

import { redirect } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import JoditEditor from "jodit-react";
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

type SiteHeaderProps = {
  siteid: string;
  headerdata: SiteHeaderType;
};

export default function SiteHeaderUI({ siteid, headerdata }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const { user, setUser, modifyMode, setModifyMode, adminMode, setAdminMode } =
    useUser();
  if (user) {
    setAdminMode(true);
  }

  console.log("user in SiteHeaderUI", user);
  const [preview, setpreview] = useState(false);

  const close = () => setIsMenuOpen(false);

  const [loading, setLoading] = useState(false);

  const editor = useRef(null);
  const [content, setContent] = useState<string>(headerdata?.siteHeader || "");
  const [siteIcon, setSiteIcon] = useState<string>(
    headerdata?.siteiconURL || "/favicon.ico"
  );
  const [newIconFile, setNewIconFile] = useState<File | null>(null);
  const [newBgImageFile, setNewBgImageFile] = useState<File | null>(null);
  const Base = `${process.env.NEXT_PUBLIC_BASE_URL}/${siteid}`;

  useEffect(() => {
    setContent(headerdata?.siteHeader!);
    setSiteIcon(headerdata?.siteiconURL!);
  }, [headerdata]);

  const config = useMemo(
    //  Using of useMemo while make custom configuration is strictly recomended
    () => ({
      //  if you don't use it the editor will lose focus every time when you make any change to the editor, even an addition of one character
      /* Custom image uploader button configuretion to accept image and convert it to base64 format */

      readonly: !modifyMode,
      placeholder: "Type here...",
      toolbarAdaptive: false,
      removeButtons: [
        "underline",
        "superscript",
        "subscript",
        "strikethrough",
        "align",
        "|",
        "ul",
        "ol",
        "|",
        "indent",
        "outdent",
        "file",
        "table",
        "fullsize",
        "preview",
        "print",
        "about",
        "hr",
        "symbol",
        "find",
        "copyformat",
        "selectall",
        "cutselection",
        "delete",
        "ClassName",
      ],

      uploader: {
        insertImageAsBase64URI: true,
        imagesExtensions: ["jpg", "png", "jpeg", "gif", "svg", "webp"], // this line is not much important , use if you only strictly want to allow some specific image format
      },
    }),
    [modifyMode]
  );

  useUnsavedChanges(isDirty);
  async function handleSave() {
    const formData = new FormData();
    formData.append("siteId", siteid);
    formData.append("existingiconURL", "");
    formData.append("existingiconURL", "");
    formData.append("siteHeader", content || "");
    formData.append("headerColor", "");
    formData.append("backgroundColor", "");
    formData.append("backgroundImage", "");
    formData.append("siteIcon", newIconFile || "");
    formData.append("existingbgImageURL", "");

    await upsertSiteData(formData);
    setIsDirty(false);

    alert("header saved!");
  }
  const handleUpdate = (newContent: string) => {
    setContent(newContent);
    setIsDirty(true);
    //onUpdate(newContent);
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
    <header className="border-b border-gray-200">
      {user && <AdminBar />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Link href={Base}>
              <Image
                src={siteIcon || "/favicon.ico"}
                alt="Logo"
                width={40}
                height={40}
                className="mr-2"
                unoptimized={true}
              />
            </Link>
            {modifyMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                title="Upload Site Icon"
              />
            )}
          </div>

          <div>
            {modifyMode ? (
              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                onBlur={handleUpdate} // Save content on blur
                onChange={(newContent) => handleUpdate(newContent)}
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: content }}></div>
            )}
          </div>

          <div>
            {isDirty && modifyMode && (
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded ml-4"
              >
                Save Page
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
