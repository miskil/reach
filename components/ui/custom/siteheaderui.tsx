"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";

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

const ReactQuill: any = dynamic(() => import("react-quill-new"), {
  ssr: false,
});
import "react-quill-new/dist/quill.snow.css";

type SiteHeaderProps = {
  siteid: string;
  headerdata: SiteHeaderType;
};

export default function SiteHeaderUI({ siteid, headerdata }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const { user, setUser, modifyMode, setModifyMode, adminMode, setAdminMode } =
    useUser();

  /* ─────────────── quill toolbar ─────────────── */
  const headerId = `header-${siteid}-text`;

  const modules = useMemo(
    () => ({
      toolbar: {
        container: `#${headerId}-toolbar`,
      },
    }),
    [headerId]
  );

  useEffect(() => {
    if (user) {
      setAdminMode(true);
    }
  }, [user]);

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
      {user && <AdminBar siteid={siteid} />}
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
              <>
                <div id={`${headerId}-toolbar`}>
                  <span className="ql-formats">
                    <select className="ql-header">
                      <option value="1"></option>
                      <option value="2"></option>
                      <option></option>
                    </select>
                    <select className="ql-font"></select>
                  </span>
                  <span className="ql-formats">
                    <button className="ql-bold"></button>
                    <button className="ql-italic"></button>
                    <button className="ql-underline"></button>
                    <button className="ql-strike"></button>
                  </span>
                  <span className="ql-formats">
                    <select className="ql-align"></select>
                  </span>
                  <span className="ql-formats">
                    <button className="ql-list" value="ordered"></button>
                    <button className="ql-list" value="bullet"></button>
                  </span>
                  <span className="ql-formats">
                    <button className="ql-link"></button>
                    <button className="ql-blockquote"></button>
                    <button className="ql-code-block"></button>
                  </span>
                  <span className="ql-formats">
                    <select className="ql-color"></select>
                    <select className="ql-background"></select>
                  </span>
                  <span className="ql-formats">
                    <button className="ql-image"></button>
                  </span>
                </div>
                <ReactQuill
                  value={content}
                  onChange={(html: string) => handleUpdate(html)}
                  modules={modules}
                  readOnly={!modifyMode}
                  className="h-20 max-h-40 overflow-y-auto"
                />
              </>
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
