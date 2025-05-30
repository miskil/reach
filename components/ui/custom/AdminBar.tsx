"use client";

import * as Switch from "@radix-ui/react-switch";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { subdomainURL } from "@/lib/utils";

import { useUser } from "@/lib/auth";
import {
  MousePointerClick,
  CircleIcon,
  Home,
  LogOut,
  LayoutTemplate,
  PanelsTopLeft,
  PanelTop,
  SquarePen,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  signOut,
  isSiteRegistered,
  getSiteHeaderElements,
} from "@/lib/actions";
type AdminBarProps = {
  siteid: string;
};

const AdminBar: React.FC<AdminBarProps> = ({ siteid }) => {
  const pathname = usePathname();
  const isAdminPath = pathname.includes("/admin");

  const { user, setUser, modifyMode, setModifyMode, adminMode, setAdminMode } =
    useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModifySwitch, setShowModifySwitch] = useState(true);
  const router = useRouter();

  console.log("siteId", siteid);
  const adminPath = subdomainURL(siteid, "admin/managepage");
  const ManagePagePath = subdomainURL(siteid, "admin/managepage");
  const ManageCoursePath = subdomainURL(siteid, "admin/managecourse");
  const ManageBlogsPath = subdomainURL(siteid, "admin/manageblogs");
  const BlogsPath = subdomainURL(siteid, "blogs");
  const PagesPath = subdomainURL(siteid, "pages");
  const CoursePath = subdomainURL(siteid, "course");

  const InviteMemberPath = subdomainURL(siteid, "admin/members/invite");
  const Base = `${process.env.NEXT_PUBLIC_BASE_URL}/${siteid}`;
  const BaseURL = `${process.env.NEXT_PUBLIC_BASE_URL}`;

  const handleAdminClick = () => {
    setAdminMode(!adminMode);

    router.push(adminPath);
    router.refresh;
  };
  const handleManagePageClick = () => {
    setAdminMode(true);
    setModifyMode(true);
    setShowModifySwitch(true);

    router.push(ManagePagePath);
    router.refresh;
  };
  const handleManageBlogsClick = () => {
    setAdminMode(true);
    setModifyMode(true);
    setShowModifySwitch(true);

    router.push(ManageBlogsPath);
    router.refresh;
  };
  const handleInviteMemberClick = () => {
    setAdminMode(!adminMode);
    setShowModifySwitch(true);

    router.push(InviteMemberPath);
    router.refresh;
  };
  const handleManageCourseClick = () => {
    setAdminMode(true);
    setShowModifySwitch(true);
    router.push(ManageCoursePath);
    router.refresh;
  };

  async function handleSignOut() {
    setUser(null);
    await signOut();
    router.push(BaseURL);
  }
  const handlePageClick = () => {
    router.push(PagesPath);
  };

  const handleBlogsClick = () => {
    router.push(BlogsPath);
  };

  const handleCourseClick = () => {
    router.push(CoursePath);
  };

  return (
    <div className="w-full bg-grey text-gray-700 px-4 py-1 flex items-center justify-between h-auto md:h-10 min-h-[2.5rem]">
      {/* Left-side menu */}
      <div className="flex items-center gap-2 md:gap-4 overflow-x-auto scrollbar-none">
        <button
          onClick={handlePageClick}
          className="flex flex-col md:flex-row items-center p-1 rounded-md hover:bg-gray-300"
        >
          <LayoutTemplate
            className={`h-5 w-5 ${pathname.includes("/pages") ? "text-blue-400" : ""}`}
          />
          <span className="mt-0.5 md:mt-0 md:ml-2 text-[10px] md:text-sm font-medium">
            Pages
          </span>
        </button>
        <button
          onClick={handleBlogsClick}
          className="flex flex-col md:flex-row items-center p-1 rounded-md hover:bg-gray-300"
        >
          <PanelTop
            className={`h-5 w-5 ${pathname.includes("/blogs") ? "text-blue-400" : ""}`}
          />
          <span className="mt-0.5 md:mt-0 md:ml-2 text-[10px] md:text-sm font-medium">
            Blogs
          </span>
        </button>
        <button
          onClick={handleCourseClick}
          className="flex flex-col md:flex-row items-center p-1 rounded-md hover:bg-gray-300"
        >
          <PanelsTopLeft
            className={`h-5 w-5 ${pathname.includes("/courses") ? "text-blue-400" : ""}`}
          />
          <span className="mt-0.5 md:mt-0 md:ml-2 text-[10px] md:text-sm font-medium">
            Courses
          </span>
        </button>
      </div>

      {/* Right-side controls */}
      <div className="flex md:ml-auto flex-row items-center gap-4 mt-2 md:mt-0">
        {showModifySwitch && isAdminPath && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Modify</span>
            <button
              onClick={() => setModifyMode(!modifyMode)}
              className={`flex items-center justify-center p-1.5 rounded-md transition-colors ${
                modifyMode
                  ? "bg-green-500 text-white"
                  : "bg-gray-400 text-gray-700"
              }`}
              aria-pressed={modifyMode}
              title={modifyMode ? "Modify mode on" : "Modify mode off"}
            >
              <SquarePen className="h-4 w-4" />
            </button>
          </div>
        )}
        {user ? (
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer size-9">
                <AvatarImage alt={user.name || ""} />
                <AvatarFallback className="text-black">
                  {user.email
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              <DropdownMenuItem
                className={`cursor-pointer ${adminMode ? "font-bold" : ""}`}
                onClick={handleManagePageClick}
              >
                <Home className="mr-2 h-4 w-4" />
                <span>Manage Page</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`cursor-pointer ${adminMode ? "font-bold" : ""}`}
                onClick={handleManageBlogsClick}
              >
                <Home className="mr-2 h-4 w-4" />
                <span>Manage Blogs</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`cursor-pointer ${adminMode ? "font-bold" : ""}`}
                onClick={handleManageCourseClick}
              >
                <Home className="mr-2 h-4 w-4" />
                <span>Manage Course</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`cursor-pointer ${adminMode ? "font-bold" : ""}`}
                onClick={handleInviteMemberClick}
              >
                <Home className="mr-2 h-4 w-4" />
                <span>Invite Member</span>
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
        ) : (
          <a
            href={`${BaseURL}/sign-in`}
            className="inline-flex items-center justify-center rounded-md bg-gray-300 px-2 py-1 text-[10px] font-medium text-gray-700 hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
          >
            Sign In
          </a>
        )}
      </div>
    </div>
  );
};

export default AdminBar;
