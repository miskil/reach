import BannerSlider from "./BannerSlider";
import TileGrid from "./TileGrid";
import LayoutTwo from "./Layout2";

interface LayoutRendererProps {
  siteId: string;
  layout: string;
  content: any;
  adminMode: boolean;
  onUpdate?: (updatedContent: any) => void;
}

const LayoutRenderer: React.FC<LayoutRendererProps> = ({
  siteId,
  layout,
  content,
  adminMode,
  onUpdate,
}) => {
  switch (layout) {
    case "layout-1":
      return (
        <>
          <div className="pb-8">
            <BannerSlider
              siteId={siteId}
              initialImages={content.bannerImages || []}
              adminMode={adminMode}
              onImagesUpdate={(updatedImages) =>
                onUpdate &&
                onUpdate({ ...content, bannerImages: updatedImages })
              }
            />
          </div>
          <TileGrid
            siteId={siteId}
            initialTiles={content.tiles || []}
            adminMode={adminMode}
            onTilesUpdate={(updatedTiles) =>
              onUpdate && onUpdate({ ...content, tiles: updatedTiles })
            }
          />
        </>
      );
    case "layout-2":
      return (
        <LayoutTwo
          bannerImage={content.bannerImage || ""}
          text={content.text || ""}
          adminMode={adminMode}
          onUpdate={(updatedData) =>
            onUpdate && onUpdate({ ...content, ...updatedData })
          }
        />
      );
    default:
      return <p>Unsupported layout</p>;
  }
};

export default LayoutRenderer;
