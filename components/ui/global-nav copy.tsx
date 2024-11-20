'use client';

import { adminmenu, type Item } from '../../lib/adminmenu';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { Menu, X} from 'lucide-react'
import clsx from 'clsx';
import { useState } from 'react';
interface FooterMenuProps {
  openMenu: string | null;
  toggleMenu: (menu: string) => void;
}

export function GlobalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <div className="fixed top-0 z-10 flex w-full flex-col border-b border-red-800  lg:bottom-0 lg:z-auto lg:w-full lg:border-b-0 lg:border-r lg:border-red-800">
      <div className="flex h-14 items-center px-4 py-4 lg:h-auto">
        <Link
          href="/"
          className="group flex w-full items-center gap-x-2.5"
          onClick={close}
        >
        
        </Link>
      </div>
      <button
        type="button"
        className="group absolute right-0 top-0 flex h-14 items-center gap-x-2 px-4 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="font-medium text-gray-100 group-hover:text-gray-400">
          Menu
        </div>
        {isOpen ? (
           <X/>
        ) : (
          <Menu/>
           
          )}
      </button>

      <div
     
        //className={clsx('overflow-y-auto lg:static lg:block', {
        //  'fixed inset-x-0 bottom-0 top-14 mt-px bg-black': isOpen,
        //  hidden: !isOpen,
        //})}
          className={clsx(
            'overflow-y-auto', // Allows vertical scrolling when content overflows
            {
              // Mobile-specific styles (Footer layout)
              'fixed inset-x-0 bottom-0 bg-black flex flex-row justify-around': isOpen, // Positions as footer with horizontal layout
              hidden: !isOpen, // Hides the element when `isOpen` is false

              // Large screens (Aside layout)
              'lg:static lg:block lg:w-full lg:flex-col lg:border-r lg:border-gray-200': true, // Converts to vertical aside on large screens
            }
          )}
        
      >
        <nav className="space-y-6 px-2 pb-24 pt-5">
          {adminmenu.map((section) => {
            return (
              <div key={section.name}>
                <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400/80">
                  <div>{section.name}</div>
                </div>

                <div className="space-y-1">
                  {section.items.map((item) => (
                    <GlobalNavItem key={item.slug} item={item} close={close} />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function GlobalNavItem({
  item,
  close,
}: {
  item: Item;
  close: () => false | void;
}) {
  const segment = useSelectedLayoutSegment();
  const isActive = item.slug === segment;

  return (
    <Link
      onClick={close}
      href={`/${item.slug}`}
      className={clsx(
        'block rounded-md px-3 py-2 text-sm font-medium hover:text-gray-300',
        {
          'text-gray-400 hover:bg-gray-800': !isActive,
          'text-white': isActive,
        },
      )}
    >
      {item.name}
    </Link>
  );
}


export default function FooterMenu({ openMenu, toggleMenu }: FooterMenuProps) {
  return (
    <div className="bg-gray-800 text-white">
      {/* Child items row, displayed horizontally above the parent menu row when a menu is open */}
      {openMenu && (
        <div className="flex justify-around bg-gray-700 p-2">


          {openMenu === 'home' && (
            <>
              <a href="#" className="p-2 hover:bg-gray-600">Home Subitem 1</a>
              <a href="#" className="p-2 hover:bg-gray-600">Home Subitem 2</a>
            </>
          )}
          {openMenu === 'about' && (
            <>
              <a href="#" className="p-2 hover:bg-gray-600">About Subitem 1</a>
              <a href="#" className="p-2 hover:bg-gray-600">About Subitem 2</a>
            </>
          )}
          {openMenu === 'services' && (
            <>
              <a href="#" className="p-2 hover:bg-gray-600">Services Subitem 1</a>
              <a href="#" className="p-2 hover:bg-gray-600">Services Subitem 2</a>
            </>
          )}
          {openMenu === 'contact' && (
            <>
              <a href="#" className="p-2 hover:bg-gray-600">Contact Subitem 1</a>
              <a href="#" className="p-2 hover:bg-gray-600">Contact Subitem 2</a>
            </>
          )}


        </div>
      )}

      {/* Parent Menu (horizontal layout for small screens) */}
      <nav className="flex justify-around p-4">

      
       {adminmenu. map((section) => {
            return (

              <div key={section.name}>
                  <button onClick={() => toggleMenu(section.name)} className="p-2 hover:bg-gray-700">
                      {section.name}
                  </button>
  

            
              </div>
            );
        })}
      </nav>
    </div>
  );
}
