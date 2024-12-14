"use client";
import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import BannerSlider from "../../../ui/custom/bannerslider";
import Tile from "../../../ui/custom/tile";

interface PageTemplate1Props {
  bannerImages: string[];
  tile1Image: string;
  tile1Text: string;
  tile1MoreLink: string;
  tile2Image: string;
  tile2Text: string;
  tile2MoreLink: string;
  bannerSliderRef: React.RefObject<any>;
  tile1Ref: React.RefObject<any>;
  tile2Ref: React.RefObject<any>;
  display: boolean;
}

const PageTemplate1 = forwardRef((props: PageTemplate1Props, ref) => {
  const {
    bannerImages,
    tile1Image,
    tile1Text,
    tile1MoreLink,
    tile2Image,
    tile2Text,
    tile2MoreLink,
    bannerSliderRef,
    tile1Ref,
    tile2Ref,
    display,
  } = props;

  useImperativeHandle(ref, () => ({
    getData: () => ({
      bannerImages: bannerSliderRef.current.getImages(),
      tile1Data: tile1Ref.current.getData(),
      tile2Data: tile2Ref.current.getData(),
    }),
  }));

  const [pageName, setPageName] = useState("");
  const [tiles, setTiles] = useState([
    {
      image: tile1Image,
      text: tile1Text,
      moreLink: tile1MoreLink,
      ref: tile1Ref,
    },
    {
      image: tile2Image,
      text: tile2Text,
      moreLink: tile2MoreLink,
      ref: tile2Ref,
    },
  ]);

  const handlePageNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageName(event.target.value);
  };

  const addTile = () => {
    setTiles([
      ...tiles,
      { image: "", text: "", moreLink: "", ref: useRef(null) },
    ]);
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
              text={tile.text}
              moreLink={tile.moreLink}
              display={display}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button
          type="button"
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
