"use client"

import { ReactNode } from 'react';
import Link from 'next/link';
import { useState , useEffect} from 'react';
import { redirect } from 'next/navigation';
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { SiteIcon } from '@/components/ui/custom/siteicon';
import { MousePointerClick, CircleIcon, Home, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/lib/auth';
import { signOut, isSiteRegistered, getSiteHeaderElements } from '@/lib/actions';
import { useRouter, usePathname } from 'next/navigation';
import { SiteHeader  as SiteHeaderType} from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';


type SiteHeaderProps = {
  siteid: string;
  headerdata: SiteHeaderType;
};

export default function SiteHeaderUI({ siteid, headerdata }: SiteHeaderProps){

  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [loading,setLoading] =useState(false);
 
  const { user, setUser } = useUser();
  const router = useRouter();

 
 

  const adminPath = "./"+siteid+"/admin";
 
  async function handleSignOut() {
    setUser(null);
    await signOut();
    router.push('/');
  }

  return (
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
           {headerdata?.siteiconURL && (
            <Image
              src={headerdata.siteiconURL}
              alt="Your Site Icon Here"
              width={20}
              height={20}
              className="w-10 h-10 mt-4 object-contain rounded-md border border-gray-300"
            />
          )} <span className="ml-2 text-xl font-semibold text-gray-900">{headerdata?.siteHeader || "Your Site Header Here"}</span>
          </Link>
            <div className="flex items-center space-x-4">
          {user && <Link
            href={adminPath}
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Admin
          </Link>
          }
          {user && (
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer size-9">
                  <AvatarImage alt={user.name || ''} />
                  <AvatarFallback>
                    {user.email
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="flex flex-col gap-1">
                <DropdownMenuItem className="cursor-pointer">
                  <Link href="/dashboard" className="flex w-full items-center">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
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
          ) }
        </div>
       
        </div>
        
          
        </header>
  );
}
