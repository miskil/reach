"use client";

import { useState, useEffect } from "react";

import BannerSlider from "./BannerSlider";
import TileGrid from "./TileGrid";
import { PageType } from "../../lib/db/schema"; // Adjust the import path as necessary

interface PageDisplayProps {
  page: PageType;
  siteId: string;
  itemType: string;
  index: number;
}

const ItemDisplay: React.FC<PageDisplayProps> = ({
  page,
  siteId,
  itemType,
  index,
}) => {
  const [currentPage, setCurrentPage] = useState<PageType | null>(page);
  const [content, setContent] = useState<any | null>(page.content);

  if (!currentPage) return <p>Page Not Available.</p>;

  return (
    <div className="p-4">
      {itemType === "banner" && (
        <BannerSlider
          siteId={siteId}
          initialImages={content.bannerImages || []}
          adminMode={false}
          onImagesUpdate={(updatedImages) => {}}
        />
      )}
      {itemType === "tile" && (
        <TileGrid
          siteId={siteId}
          initialTiles={content.tiles || []}
          adminMode={false}
          onTilesUpdate={(updatedTiles) => {}}
        />
      )}
    </div>
  );
};

export default ItemDisplay;
