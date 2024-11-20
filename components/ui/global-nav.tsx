'use client';

import { adminmenu, type Item } from '../../lib/adminmenu';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { Menu, X} from 'lucide-react'
import clsx from 'clsx';
import { useState } from 'react';
//import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';



interface FooterMenuProps {
  openMenu: string | null;
  toggleMenu: (menu: string) => void;
}
export interface GlobalNavProps {
  siteId: string;
}

const  GlobalNav:React.FC<GlobalNavProps> = ({siteId})=> {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
     
    <div className="relative top-0 z-10 flex w-full flex-col border-b border-gray-800 lg:bottom-0 lg:z-auto lg:w-72 lg:border-b-0 lg:border-r lg:border-gray-800">
      <button
          type="button"
          className="group absolute right-0 top-0 flex h-14 items-center gap-x-2 px-4 lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="font-medium text-gray-100 group-hover:text-gray-400">
            Menu
          </div>
          {isOpen ? (
            <X className="block w-6 text-gray-400" />
          ) : (
            <Menu className="block w-6 text-gray-400" />
          )}
        </button>
    <div
        className={clsx('overflow-y-auto lg:static lg:block', {
          'fixed inset-x-0 bottom-0 top-14 mt-px bg-black': isOpen,
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
                    <GlobalNavItem key={item.slug} item={item} close={close}  siteId={siteId}/>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        </div>
    
  );
}

function GlobalNavItem({
  item,
  close,
  siteId
}: {
  item: Item;
  close: () => false | void;
  siteId:string
}) {
  const segment = useSelectedLayoutSegment();
  const isActive = item.slug === segment;
  const h= `${item.slug}`
  console.log(h);
  return (
    <Link
      onClick={close}
      href={`${item.slug}`}
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

export  function FooterMenu({ openMenu, toggleMenu }: FooterMenuProps) {
  return (
    <div className="bg-gray-800 text-white">
      {/* Child items row, displayed horizontally above the parent menu row when a menu is open */}
      {openMenu && (
        <div className="flex justify-around bg-gray-700 p-2">
                {adminmenu. map((section) => {
                  return (

                     <div className="space-y-1">
                  {section.items.map((item) => (

                    openMenu === section.name && (
            <>
              <a href={item.slug} className="p-2 hover:bg-gray-600">{item.name}</a>
           
            </>
          )
                  ))}
                </div>
  

            
             
            );
        })}

         
          
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
export default GlobalNav;