"use client";

import { useState, useEffect } from "react";
import PageRenderer from "../compo/pagerenderer";
import { upsertSiteData } from "@/lib/actions";
import { SiteHeader as SiteHeaderType } from "@/lib/db/schema";
import SiteHeader from "./siteheader";

interface SiteHeaderEditorProps {
  siteId: string;
  header: SiteHeaderType;
}

const SiteHeaderEditor: React.FC<SiteHeaderEditorProps> = ({
  siteId,
  header,
}) => {
  const [siteIconURL, setSiteIcon] = useState(header?.siteiconURL || null);
  const [siteHeader, setSiteHeader] = useState(header?.siteHeader || null);
  const [headerColor, setHeaderColor] = useState(
    header?.headerTextColor || null
  );
  const [backgroundColor, setBackgroundColor] = useState(
    header?.headerBkgColor || null
  );
  const [backgroundImage, setBackgroundImage] = useState(
    header?.headerBkgImageURL || null
  );
  const [siteIconFile, setSiteIconFile] = useState<File | null>(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(
    null
  );
  const [adminMode, setAdminMode] = useState(true);

  const handleSave = async () => {
    // Call the server-side function to update the site header in the database
    const formData = new FormData();
    formData.append("siteId", siteId);
    formData.append("siteIcon", siteIconURL || "");
    formData.append("siteHeader", siteHeader || "");
    formData.append("headerColor", headerColor || "");
    formData.append("backgroundColor", backgroundColor || "");
    formData.append("backgroundImage", backgroundImage || "");
    if (siteIconFile) formData.append("siteIconFile", siteIconFile);
    if (backgroundImageFile)
      formData.append("backgroundImageFile", backgroundImageFile);

    await upsertSiteData(formData);

    alert("header saved!");
  };

  const handleInputChange = (name: string, value: any) => {
    switch (name) {
      case "siteIcon":
        setSiteIcon(value);
        break;
      case "siteHeader":
        setSiteHeader(value);
        break;
      case "headerColor":
        setHeaderColor(value);
        break;
      case "backgroundColor":
        setBackgroundColor(value);
        break;
      case "backgroundImage":
        setBackgroundImage(value);
        break;
      case "backgroundImageFile":
        setBackgroundImageFile(value);
        break;
      case "siteIconFile":
        setSiteIconFile(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-4">
      <SiteHeader
        adminMode={adminMode}
        siteIcon={siteIconURL || ""}
        siteHeader={siteHeader || ""}
        headerColor={headerColor || ""}
        backgroundColor={backgroundColor || ""}
        backgroundImage={backgroundImage || ""}
        onUpdate={handleInputChange}
      />
    </div>
  );
};

export default SiteHeaderEditor;
