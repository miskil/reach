"use client";

import * as Switch from "@radix-ui/react-switch";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useUser } from "@/lib/auth";
import { MousePointerClick, CircleIcon, Home, LogOut } from "lucide-react";
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

const AdminBar: React.FC = () => {
  const { user, setUser, modifyMode, setModifyMode, adminMode, setAdminMode } =
    useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModifySwitch, setShowModifySwitch] = useState(false);
  const router = useRouter();

  const pathname = usePathname();
  const siteid = pathname.split("/")[1]; // Get the first segment after "/"
  console.log("siteId", siteid);
  const adminPath = `${process.env.NEXT_PUBLIC_BASE_URL}/${siteid}/admin/managepage`;
  const ManagePagePath = `${process.env.NEXT_PUBLIC_BASE_URL}/${siteid}/admin/managepage`;
  const ManageCoursePath = `${process.env.NEXT_PUBLIC_BASE_URL}/${siteid}/admin/managecourse`;
  const ManageBlogsPath = `${process.env.NEXT_PUBLIC_BASE_URL}/${siteid}/admin/manageblogs`;

  const Base = `${process.env.NEXT_PUBLIC_BASE_URL}/${siteid}`;

  const handleAdminClick = () => {
    setAdminMode(!adminMode);
    router.refresh;
    router.push(adminPath);
  };
  const handleManagePageClick = () => {
    setAdminMode(!adminMode);
    setShowModifySwitch(true);
    router.refresh;
    router.push(ManagePagePath);
  };
  const handleManageBlogsClick = () => {
    setAdminMode(!adminMode);
    setShowModifySwitch(true);
    router.refresh;
    router.push(ManageBlogsPath);
  };
  const handleManageCourseClick = () => {
    setAdminMode(!adminMode);
    router.refresh;
    router.push(ManageCoursePath);
  };
  async function handleSignOut() {
    setUser(null);
    await signOut();
    router.push("/");
  }

  return (
    <div className=" w-full bg-black text-white p-4 flex justify-end items-center space-x-4">
      {showModifySwitch && (
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
  );
};

export default AdminBar;
