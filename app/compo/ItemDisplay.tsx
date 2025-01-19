"use client";

import { useState, useEffect } from "react";

import BannerSlider from "./BannerSlider";
import TileGrid from "./TileGrid";
import { PageType } from "../../lib/db/schema"; // Adjust the import path as necessary

interface PageDisplayProps {
  page: PageType;
  siteId: string;
  itemType: string;
  idxComponent: number;
  index: number;
}

interface contentType {
  components: Array<{
    id: string;
    type: string;
    widget: any;
  }>;
}
const ItemDisplay: React.FC<PageDisplayProps> = ({
  page,
  siteId,
  itemType,
  idxComponent,
  index,
}) => {
  const [currentPage, setCurrentPage] = useState<PageType | null>(page);
  const [content, setContent] = useState<contentType | null>(
    page.content as contentType | null
  );

  if (!currentPage) return <p>Page Not Available.</p>;

  return (
    <div className="p-4">
      {itemType === "banner" && (
        <BannerSlider
          siteId={siteId}
          initialImages={content!.components[idxComponent].widget.Image || []}
          preview={false}
          onImagesUpdate={(updatedImages) => {}}
        />
      )}
      {itemType === "tile" && (
        <TileGrid
          siteId={siteId}
          pageName={currentPage.name}
          idxTile={index}
          idxComponent={idxComponent}
          initialTiles={content!.components[idxComponent].widget.Tile || []}
          preview={false}
          onTilesUpdate={(updatedTiles) => {}}
        />
      )}
    </div>
  );
};

export default ItemDisplay;
