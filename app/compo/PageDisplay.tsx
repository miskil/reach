"use client";

import { useState, useEffect } from "react";
import { upinsertPage } from "../../lib/actions";
import { PageType } from "../../lib/db/schema"; // Adjust the import path as necessary
import { ContentType } from "../../lib/db/schema";
interface PageContent {
  components: Array<{
    id: string;
    type: string;
    widget: any;
  }>;
}

import PageRenderer from "../compo/pagerenderer";

interface PageDisplayProps {
  page: PageType;
  siteId: string;
}

content: {
  components: Array<{
    id: string;
    type: string;
    widget: any;
  }>;
}

const PageDisplay: React.FC<PageDisplayProps> = ({ page, siteId }) => {
  const [currentPage, setCurrentPage] = useState<PageType | null>(page);

  if (!currentPage) return <p>Page Not Available.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{currentPage!.name}</h1>

      <PageRenderer
        siteId={siteId}
        pageName={page.name}
        content={currentPage.content as ContentType}
        adminMode={false}
        onUpdate={(updatedContent) =>
          setCurrentPage((prevPage: PageType | null) =>
            prevPage ? { ...prevPage, content: updatedContent } : null
          )
        }
      />
    </div>
  );
};

export default PageDisplay;
