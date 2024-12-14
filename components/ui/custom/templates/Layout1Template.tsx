// components/templates/TemplateTwo.tsx
"use client";
import React, { useRef } from "react";
import Form from "next/form"; // Adjust the import path as necessary
import { upinsertPageData } from "../../../../lib/actions"; // Import the server action
import PageTemplate1 from "../../../ui/custom/templates/PageTemplate1"; // Import the FormData type
import Layout1TemplateProps from "../../../../lib/interfaces";
import TileProps from "../../../../lib/interfaces";

const Layout1Template: React.FC<Layout1TemplateProps> = ({
  bannerImages,
  tiles,
  display,
}) => {
  const bannerSliderRef = useRef<any>(null);

  const handleSubmit = async (formData: FormData) => {
    const bannerImages = bannerSliderRef.current.getImages();
    const tilesData = tiles.map((tile) => tile.ref.current.getData());

    bannerImages.forEach((image: string, index: number) => {
      formData.append("siteId", "aa");
      formData.append("pageTemplate", "Template1");
      formData.append("menuItem", "Home");
      formData.append("pagetitle", "Home");
      formData.append(`bannerImages[${index}]`, image);
    });

    tilesData.forEach((tile, index) => {
      formData.append(`tiles[${index}][image]`, tile.image);
      formData.append(`tiles[${index}][text]`, tile.text);
      formData.append(`tiles[${index}][moreLink]`, tile.moreLink);
    });

    // Call your action here with the formData
    // Example: await yourAction(formData);
  };

  return (
    <Form action={handleSubmit}>
      <PageTemplate1
        bannerImages={bannerImages}
        tiles={tiles}
        bannerSliderRef={bannerSliderRef}
        display={display}
      />
      <div className="p-6">
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </div>
    </Form>
  );
};

export default Layout1Template;
