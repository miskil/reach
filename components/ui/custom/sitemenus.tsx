"use client";

import { useState, useRef, useEffect } from "react";
import { SiteMenusType } from "@/lib/db/schema";
type SiteMenuProps = {
  siteid: string;
  menusdata: SiteMenusType[];
};

export default function SiteMenus({ siteid, menusdata }: SiteMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-2">
        <button
          className="block md:hidden text-gray-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          Menu
        </button>
        <ul
          className={`md:flex md:items-center ${
            isOpen ? "block" : "hidden"
          } space-y-2 md:space-y-0 md:space-x-4`}
        >
          {menusdata.map((menu) => (
            <li key={menu.id} className="hover:underline">
              <a href={menu.url}>{menu.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
