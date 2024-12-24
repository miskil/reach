"use client";

import { useState, useEffect } from "react";
import LayoutRenderer from "./LayoutRenderer";
import { upinsertPage } from "../../lib/actions";
import { PageType } from "../../lib/db/schema"; // Adjust the import path as necessary
import Link from "next/link";
import {itemDisplay from "@/app/compo/ItemDisplay";

interface PageDisplayProps {
  page: PageType;
  siteId: string;
}

const PageDisplay: React.FC<PageDisplayProps> = ({ page, siteId }) => {
  const [currentPage, setCurrentPage] = useState<PageType | null>(page);

  if (!currentPage) return <p>Page Not Available.</p>;
  const content: any = currentPage.content;

  return (

    <div className="p-4">
      <h1 className="text-2xl font-bold">{currentPage!.name}</h1>
      <Link
        href={`${siteId}/${currentPage.name}/${currentPage.layout}/banner/0`}
      >
        banner
      </Link>
      <Link href={`${siteId}/${currentPage.name}/${currentPage.layout}/tile/0`}>
        {" "}
        tile1
      </Link>
      <Link href={`${siteId}/${currentPage.name}/${currentPage.layout}/tile/1`}>
        tile2
      </Link>
      <span>
        {" "}
        (URL: /{`${siteId}/${currentPage.name}/${currentPage.layout}/tile/1`})
      </span>
    </div>
  );
};

export default PageDisplay;
