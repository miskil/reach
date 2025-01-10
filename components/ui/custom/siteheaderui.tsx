"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import { redirect } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import JoditEditor from "jodit-react";
import { upsertSiteData } from "@/lib/actions";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { MousePointerClick, CircleIcon, Home, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const { adminMode, setAdminMode } = useUser();
  const [headerAdminMode, setHeaderAdminMode] = useState(false);

  const close = () => setIsMenuOpen(false);

  const [loading, setLoading] = useState(false);

  const { user, setUser } = useUser();
  const router = useRouter();

  const adminPath = `${process.env.NEXT_PUBLIC_BASE_URL}/${siteid}/admin`;

  const editor = useRef(null);
  const [content, setContent] = useState<string>(headerdata?.siteHeader || "");

  useEffect(() => {
    setContent(headerdata?.siteHeader!);
  }, [headerdata?.siteHeader]);

  const config = useMemo(
    //  Using of useMemo while make custom configuration is strictly recomended
    () => ({
      //  if you don't use it the editor will lose focus every time when you make any change to the editor, even an addition of one character
      /* Custom image uploader button configuretion to accept image and convert it to base64 format */

      readonly: !headerAdminMode,
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
    [headerAdminMode]
  );

  async function handleSignOut() {
    setUser(null);
    await signOut();
    router.push("/");
  }
  async function handleSave() {
    const formData = new FormData();
    formData.append("siteId", siteid);
    formData.append("existingiconURL", "");
    formData.append("existingiconURL", "");
    formData.append("siteHeader", content || "");
    formData.append("headerColor", "");
    formData.append("backgroundColor", "");
    formData.append("backgroundImage", "");
    formData.append("siteIcon", "");
    formData.append("existingbgImageURL", "");

    await upsertSiteData(formData);

    alert("header saved!");
  }
  const handleUpdate = (newContent: string) => {
    setContent(newContent);
    //onUpdate(newContent);
  };

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Image
            src={headerdata?.siteiconURL || "/favicon.ico"}
            alt="Logo"
            width={40}
            height={40}
            className="mr-2"
          />

          <div>
            {headerAdminMode ? (
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
            {adminMode && (
              <button
                onClick={() => setHeaderAdminMode(!headerAdminMode)}
                className="bg-yellow-500 text-white px-4 py-2 rounded mt-4"
              >
                Toggle {headerAdminMode ? "Preview" : "Admin"} Mode
              </button>
            )}

            {headerAdminMode && (
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded ml-4"
              >
                Save Page
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4  ">
          {user && (
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer size-9 pr-30">
                  <AvatarImage alt={user.name || ""} />
                  <AvatarFallback>
                    {user.email
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="flex flex-col gap-1">
                <DropdownMenuItem className="cursor-pointer">
                  <Link href={adminPath} className="flex w-full items-center">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                </DropdownMenuItem>
                <form action={handleSignOut} className="w-full">
                  <button type="submit" className="flex w-full">
                    <DropdownMenuItem className="w-full flex-1 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
