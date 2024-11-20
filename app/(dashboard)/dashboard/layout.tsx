'use client';
// app/child/layout.tsx

import { ReactNode } from 'react';
import clsx from 'clsx';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {GlobalNav,  FooterMenu} from '../../../components/ui/global-nav';
import { TableOfContents,LayoutDashboard, Users, Settings, Shield, Activity, Menu } from 'lucide-react';

export default function ChildLayout({ children }: { children: ReactNode }) {
  // State to track open/close state for each menu's child items
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Toggle the child items for the specified menu
  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar Menu (for large screens) */}
      
      <nav className="hidden lg:flex lg:w-60 lg:flex-col bg-gray-800 text-white p-4">
        {/* Parent Menu Items with Child Items */}
        <GlobalNav/>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4">
        {children}
      </main>

      {/* Footer Menu with Horizontal Child Items Above Footer for Small Screens */}
      <div className="lg:hidden fixed inset-x-0 bottom-0">
        <FooterMenu openMenu={openMenu} toggleMenu={toggleMenu} />
      </div>
    </div>
  );
}