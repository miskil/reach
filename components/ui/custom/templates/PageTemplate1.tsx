"use client";
import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import BannerSlider from "../../../ui/custom/bannerslider";
import Tile from "../../../ui/custom/tile";
import { getDisplayName } from "next/dist/shared/lib/utils";

interface TileProps {
  image: string;
  text: string;
  moreLink: string;
  ref: React.RefObject<any>;
  display: boolean;
}

interface PageTemplate1Props {
  bannerImages: string[];
  tiles: TileProps[];
  bannerSliderRef: React.RefObject<any>;
  display: boolean;
}

const PageTemplate1 = forwardRef((props: PageTemplate1Props, ref) => {
  const { bannerImages, tiles = [], bannerSliderRef, display } = props;

  useImperativeHandle(ref, () => ({
    getData: () => ({
      bannerImages: bannerSliderRef.current.getImages(),
      tilesData: tiles.map((tile) => tile.ref.current.getData()),
    }),
  }));

  const [pageName, setPageName] = useState("");

  const handlePageNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageName(event.target.value);
  };

  const addTile = () => {
    /**
   // setTiles([
      ...tiles,
      { image: "", text: "", moreLink: "", ref: useRef(null), display },
    ]);
     */
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-center mb-4">
        <input
          type="text"
          name="pageName"
          value={pageName}
          onChange={handlePageNameChange}
          placeholder="Enter page name"
          required
          className="text-sm px-3 py-2 border rounded-md text-black bg-white"
        />
      </div>
      <section className="w-full mb-4">
        <BannerSlider
          ref={bannerSliderRef}
          initialImages={bannerImages}
          display={display}
        />
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {tiles.map((tile, index) => (
          <div key={index} className="col-span-1">
            <Tile
              ref={tile.ref}
              initialImage={tile.image}
              initialText={tile.text}
              moreLink={tile.moreLink}
              display={tile.display}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={addTile}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Add Tile
        </button>
      </div>
    </div>
  );
});

export default PageTemplate1;
