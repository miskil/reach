"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="p-4 bg-gray-800 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Logo
          </Link>
          <button
            className="md:hidden block"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="material-icons">menu</span>
          </button>
          <ul
            className={clsx(
              "md:flex md:items-center md:static fixed top-16 right-0 bg-gray-200 w-40 transition-transform transform",
              {
                "translate-x-0": menuOpen,
                "translate-x-full": !menuOpen,
                "md:w-auto md:h-auto md:bg-transparent md:translate-x-0": true,
                "bottom-16": true,
              }
            )}
          >
            <li className="md:ml-4 mt-2 md:mt-0">
              <Link
                href="/about"
                className="block px-4 py-2 md:inline text-black"
              >
                About
              </Link>
            </li>
            <li className="md:ml-4 mt-2 md:mt-0">
              <Link
                href="/services"
                className="block px-4 py-2 md:inline text-black"
              >
                Services
              </Link>
            </li>
            <li className="md:ml-4 mt-2 md:mt-0 hidden sm:block">
              <Link
                href="/contact"
                className="block px-4 py-2 md:inline text-black"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <footer className="sm:hidden p-4 bg-transparent text-black fixed bottom-0 w-full">
        <div className="container mx-auto">
          <Link href="/contact" className="block px-4 py-2 text-black">
            Contact
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Header;
