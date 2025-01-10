"use client";
import React, { useState } from "react";
import { upsertSiteData } from "@/lib/actions";
import SiteHeader from "./siteheader";
import { SiteHeader as SiteHeaderType } from "@/lib/db/schema";

interface SiteHeaderEditorProps {
  siteId: string;
  header: SiteHeaderType;
}

const SiteHeaderEditor: React.FC<SiteHeaderEditorProps> = ({
  siteId,
  header,
}) => {
  const [siteIcon, setSiteIcon] = useState(header.siteiconURL);
  const [siteHeader, setSiteHeader] = useState(header.siteHeader);
  const [headerColor, setHeaderColor] = useState(header.headerTextColor);
  const [backgroundColor, setBackgroundColor] = useState(header.headerBkgColor);
  const [backgroundImage, setBackgroundImage] = useState(
    header.headerBkgImageURL
  );
  const [siteIconFile, setSiteIconFile] = useState<File | null>(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(
    null
  );

  const handleUpdate = async (updatedHeader: {
    siteId: string;
    siteIcon?: string;
    siteHeader?: string;
    headerColor?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    siteIconFile?: File;
    backgroundImageFile?: File;
  }) => {
    if (updatedHeader.siteIcon !== undefined)
      setSiteIcon(updatedHeader.siteIcon);
    if (updatedHeader.siteHeader !== undefined)
      setSiteHeader(updatedHeader.siteHeader);
    if (updatedHeader.headerColor !== undefined)
      setHeaderColor(updatedHeader.headerColor);
    if (updatedHeader.backgroundColor !== undefined)
      setBackgroundColor(updatedHeader.backgroundColor);
    if (updatedHeader.backgroundImage !== undefined)
      setBackgroundImage(updatedHeader.backgroundImage);
    if (updatedHeader.siteIconFile !== undefined)
      setSiteIconFile(updatedHeader.siteIconFile);
    if (updatedHeader.backgroundImageFile !== undefined)
      setBackgroundImageFile(updatedHeader.backgroundImageFile);

    // Call the server-side function to update the site header in the database
    const formData = new FormData();
    formData.append("siteId", siteId);
    formData.append("siteIcon", updatedHeader.siteIcon || siteIcon || "");
    formData.append("siteHeader", updatedHeader.siteHeader || siteHeader || "");
    formData.append(
      "headerColor",
      updatedHeader.headerColor || headerColor || ""
    );
    formData.append(
      "backgroundColor",
      updatedHeader.backgroundColor || backgroundColor || ""
    );
    formData.append(
      "backgroundImage",
      updatedHeader.backgroundImage || backgroundImage || ""
    );
    if (updatedHeader.siteIconFile)
      formData.append("siteIconFile", updatedHeader.siteIconFile);
    if (updatedHeader.backgroundImageFile)
      formData.append("backgroundImageFile", updatedHeader.backgroundImageFile);

    await upsertSiteData(formData);
  };

  return (
    <div>
      <SiteHeader
        adminMode={true}
        siteIcon={siteIcon}
        siteHeader={siteHeader}
        headerColor={headerColor}
        backgroundColor={backgroundColor}
        backgroundImage={backgroundImage}
        onUpdate=()=> {
          
        }
      />
    </div>
  );
};

export default SiteHeaderEditor;
