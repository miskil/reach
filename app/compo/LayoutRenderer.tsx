import BannerSlider from "./BannerSlider";
import TileGrid from "./TileGrid";
import LayoutTwo from "./Layout2";

interface LayoutRendererProps {
  layout: string;
  content: any;
  adminMode: boolean;
  onUpdate?: (updatedContent: any) => void;
}

const LayoutRenderer: React.FC<LayoutRendererProps> = ({
  layout,
  content,
  adminMode,
  onUpdate,
}) => {
  switch (layout) {
    case "layout-1":
      return (
        <>
          <BannerSlider
            initialImages={content.bannerImages || []}
            adminMode={adminMode}
            onImagesUpdate={(updatedImages) =>
              onUpdate({ ...content, bannerImages: updatedImages })
            }
          />
          <TileGrid
            initialTiles={content.tiles || []}
            adminMode={adminMode}
            onTilesUpdate={(updatedTiles) =>
              onUpdate({ ...content, tiles: updatedTiles })
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
          onUpdate={(updatedData) => onUpdate({ ...content, ...updatedData })}
        />
      );
    default:
      return <p>Unsupported layout</p>;
  }
};

export default LayoutRenderer;
