"use client";

import { adminmenu, type Item } from "../../lib/adminmenu";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
//import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

interface FooterMenuProps {
  openMenu: boolean | false;
  siteId: string;
  //toggleMenu: (menu: string) => void;
}
export interface GlobalNavProps {
  siteId: string;
}

const GlobalNav: React.FC<GlobalNavProps> = ({ siteId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <div className="relative top-0 z-10 flex w-full flex-col border-b border-gray-800 lg:bottom-0 lg:z-auto lg:w-72 lg:border-b-0 lg:border-r lg:border-gray-800">
      <div
        className={clsx("overflow-y-auto lg:static lg:block", {
          "fixed inset-x-0 bottom-0 top-14 mt-px bg-black": isOpen,
          hidden: !isOpen,
        })}
      >
        {adminmenu.map((section) => {
          return (
            <div key={section.name}>
              <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400/80">
                <div>{section.name}</div>
              </div>

              <div className="space-y-1">
                {section.items.map((item) => (
                  <GlobalNavItem
                    key={item.slug}
                    item={item}
                    close={close}
                    siteId={siteId}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className=" fixed bottom-0 w-full lg:hidden ">
        <FooterMenu openMenu={isOpen} siteId={siteId} />
      </div>
    </div>
  );
};

function GlobalNavItem({
  item,
  close,
  siteId,
}: {
  item: Item;
  close: () => false | void;
  siteId: string;
}) {
  const segment = useSelectedLayoutSegment();
  const isActive = item.slug === segment;

  return (
    <Link
      onClick={close}
      href={`${process.env.NEXT_PUBLIC_BASE_URL}/${siteId}/${item.slug}`}
      className={clsx(
        "block rounded-md px-3 py-2 text-sm font-medium hover:text-gray-300",
        {
          "text-gray-400 hover:bg-gray-800": !isActive,
          "text-white": isActive,
        }
      )}
    >
      {item.name}
    </Link>
  );
}

export function FooterMenu({ openMenu, siteId }: FooterMenuProps) {
  return (
    <div className="bg-gray-800 text-white">
      {/* Child items row, displayed horizontally above the parent menu row when a menu is open */}
      <div className="flex overflow-x-auto bg-gray-700 p-1">
        {adminmenu.map((section) => {
          return (
            <nav className="flex p-2">
              <div className="flex space-x-2">
                {section.items.map((item) => (
                  <GlobalNavItem
                    key={item.slug}
                    item={item}
                    close={close}
                    siteId={siteId}
                  />
                ))}
              </div>
            </nav>
          );
        })}
      </div>
    </div>
  );
}
export default GlobalNav;
