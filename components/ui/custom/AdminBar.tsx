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
    router.refresh();
  };

  const handleCourseClick = () => {
    router.push(CoursePath);
  };

  return (
    <div className=" w-full bg-black text-white p-4 py-2 flex flex-col md:flex-row ">
      {/* Left-side menu */}
      <div className="flex flex-row flex-wrap md:flex-nowrap p-4 space-x-4">
        <button
          onClick={handlePageClick}
          className={`flex items-center space-x-2 text-sm font-semibold hover:text-gray-300 ${
            adminMode ? "text-white" : "text-gray-400"
          }`}
        >
          <LayoutTemplate className="h-4 w-4" />
          <span>Pages</span>
        </button>
        <button
          onClick={handleBlogsClick}
          className={`flex items-center space-x-2 text-sm font-semibold hover:text-gray-300 ${
            adminMode ? "text-white" : "text-gray-400"
          }`}
        >
          <PanelTop className="h-4 w-4" />
          <span>Blogs</span>
        </button>
        <button
          onClick={handleCourseClick}
          className="flex items-center space-x-2 text-sm font-semibold hover:text-gray-300 "
        >
          <PanelsTopLeft className="h-4 w-4" />
          <span>Courses</span>
        </button>
      </div>
      {/* Right-side controls */}
      <div className="flex-1 flex flex-row justify-end items-center p-4 space-x-4">
        {showModifySwitch && isAdminPath && (
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold">Modify</span>

            <Switch.Root
              className="w-12 h-6 bg-gray-400 rounded-full relative data-[state=checked]:bg-green-500 transition"
              checked={modifyMode}
              onCheckedChange={setModifyMode}
            >
              <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-md transition-transform translate-x-0 data-[state=checked]:translate-x-6" />
            </Switch.Root>
          </div>
        )}
        <div className="flex items-center space-x-4  ">
          {user && (
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer size-9 pr-30">
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
                  className={`cursor-pointer
                  ${adminMode ? "font-bold" : ""}`}
                  onClick={handleManagePageClick}
                >
                  <Home className="mr-2 h-4 w-4" />
                  <span>Manage Page</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`cursor-pointer
                  ${adminMode ? "font-bold" : ""}`}
                  onClick={handleManageBlogsClick}
                >
                  <Home className="mr-2 h-4 w-4" />
                  <span>Manage Blogs</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`cursor-pointer
                  ${adminMode ? "font-bold" : ""}`}
                  onClick={handleManageCourseClick}
                >
                  <Home className="mr-2 h-4 w-4" />
                  <span>Manage Course</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`cursor-pointer
                  ${adminMode ? "font-bold" : ""}`}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBar;
