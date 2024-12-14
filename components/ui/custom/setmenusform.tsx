"use client";
import { useState } from "react";
import { addMenu, deleteMenu, getMenuItems } from "@/lib/actions";
import { revalidatePath } from "next/cache";
import { SiteMenusType } from "@/lib/db/schema";

type SiteMenuProps = {
  siteid: string;
  menusdata: SiteMenusType[];
};
export default function SetMenusForm({ siteid, menusdata }: SiteMenuProps) {
  // Server actions

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Menu Management</h1>
      <div className="mb-6">
        <form
          action={addMenu}
          method="post"
          className="p-4 border rounded-md bg-gray-100"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="menuItem"
              required
              className="w-full px-3 py-2 border rounded-md text-black bg-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">URL</label>
            <input
              type="text"
              name="url"
              required
              className="w-full px-3 py-2 border rounded-md text-black bg-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Order</label>
            <input
              type="number"
              name="order_num"
              required
              className="w-full px-3 py-2 border rounded-md text-black bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add Menu
          </button>

          {siteid && <input type="hidden" name="siteId" value={siteid} />}
        </form>
      </div>

      <h2 className="text-xl font-semibold mb-4">Existing Menus</h2>
      <ul className="space-y-2">
        {menusdata.map((menu) => (
          <li
            key={menu.id}
            className="flex justify-between items-center p-4 border rounded-md bg-white"
          >
            <span>
              {menu.order_num}. <a href={menu.url}>{menu.menuItem}</a>
            </span>
            <form action={() => deleteMenu(menu.id)} method="post">
              <button
                type="submit"
                className="px-3 py-1 bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
