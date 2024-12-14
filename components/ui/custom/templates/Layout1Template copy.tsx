// components/templates/TemplateTwo.tsx
"use client";
import React, { useRef } from "react";
import BannerSlider from "../../../ui/custom/bannerslider";
import Tile from "../../../ui/custom/tile";
import Form from "next/form"; // Adjust the import path as necessary
import { upinsertPageData } from "../../../../lib/actions"; // Import the server action
import PageTemplate1 from "../../../ui/custom/templates/PageTemplate1"; // Import the FormData type

const Layout1Template: React.FC = () => {
  const bannerSliderRef = useRef<any>(null);
  const tile1Ref = useRef<any>(null);
  const tile2Ref = useRef<any>(null);

  const handleSubmit = async (formData: FormData) => {
    const bannerImages = bannerSliderRef.current.getImages();
    const tile1Data = tile1Ref.current.getData();
    const tile2Data = tile2Ref.current.getData();

    bannerImages.forEach((image: string, index: number) => {
      formData.append("siteId", "aa");
      formData.append("pageTemplate", "Template1");
      formData.append("menuItem", "Home");
      formData.append("pagetitle", "Home");
      formData.append(`bannerImages[${index}]`, image);
      formData.append("order_num", index.toString());
    });
    formData.append("tile1Image", tile1Data.image);
    formData.append("tile1Text", tile1Data.text);
    formData.append("tile1MoreLink", "http://localhost:3000/aa/admin");
    formData.append("order1", "1");
    formData.append("order2", "2");

    formData.append("tile2Image", tile2Data.image);
    formData.append("tile2Text", tile2Data.text);
    formData.append("tile2MoreLink", "http://localhost:3000/aa/admin");

    // Call the server action directly
    await upinsertPageData(formData);

    alert("Data submitted successfully!");
  };

  return (
    <Form action={handleSubmit}>
      <PageTemplate1
        bannerImages={[]}
        tile1Image=""
        tile1Text=""
        tile1MoreLink=""
        tile2Image=""
        tile2Text=""
        tile2MoreLink=""
        bannerSliderRef={bannerSliderRef}
        tile1Ref={tile1Ref}
        tile2Ref={tile2Ref}
        display={false}
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
