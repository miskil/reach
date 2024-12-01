"use client";

import Link from "next/link";

import Form from "next/form";
import { upsertSiteData, SiteDataInput } from "@/lib/actions";

import { useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ActionState } from "@/lib/auth/middleware";
import { SiteHeader as SiteHeaderType } from "@/lib/db/schema";
import { getSiteHeaderElements } from "@/lib/actions";

type SiteHeaderProps = {
  siteid: string;
  headerdata: SiteHeaderType;
};

interface SiteData {
  headerText: string;
  icon: File | null;
}
export default function SetSiteHeaderForm({
  siteid,
  headerdata,
}: SiteHeaderProps) {
  const [siteHeader, setSiteHeaderData] = useState(headerdata || null);
  const [siteHeaderText, setSiteHeaderText] = useState(
    headerdata?.siteHeader || ""
  );

  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const [existingiconURL, setexitingIconURL] = useState(
    headerdata?.siteiconURL || ""
  );
  const [existingbgImageURL, setExistingbgImageURL] = useState(
    headerdata?.headerBkgImageURL || ""
  );
  const [iconPreview, setIconPreview] = useState(headerdata?.siteiconURL || "");
  const [siteicon, setSiteicon] = useState<File | null>(null);

  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState("text-base");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgImage, setBgImage] = useState<File | null>(null);
  const [bgImagePreview, setBgImagePreview] = useState(
    headerdata?.headerBkgImageURL || ""
  );

  const fontSizestw = [
    { label: "Small", value: "text-sm" },
    { label: "Base", value: "text-base" },
    { label: "Large", value: "text-lg" },
    { label: "Extra Large", value: "text-xl" },
    { label: "2XL", value: "text-2xl" },
  ];

  const fontSizes = [
    { label: "Small", value: "0.875rem" },
    { label: "Base", value: "1rem" },
    { label: "Large", value: "1.125rem" },
    { label: "Extra Large", value: "1.25rem" },
    { label: "2XL", value: "1.5rem" },
  ];

  // Access the document object here
  const fontPicker = document.getElementById("headerFontSize");
  const colorPicker = document.getElementById("headerTextColor");
  const bgColorPicker = document.getElementById("headerBkgColor");
  const bgImagePicker = document.getElementById("headerBkgImage");

  const previewHeaderText = document.getElementById("headrerTextPreview");

  if (bgImagePicker && previewHeaderText) {
    // Set the initial background color
    const abc = `url(${bgImagePreview})`;
    console.log("URL " + abc);
    previewHeaderText.style.backgroundImage = abc;
    previewHeaderText.style.backgroundSize = "cover";

    // Update the background color on input change
    bgImagePicker.addEventListener("input", () => {
      previewHeaderText.style.backgroundImage = abc;
      previewHeaderText.style.backgroundSize = "cover";
    });
  } else {
    console.error("Element(s) not found. Please check the IDs.");
  }

  if (bgColorPicker && previewHeaderText) {
    // Set the initial background color

    previewHeaderText.style.backgroundColor = bgColorPicker.value;

    // Update the background color on input change
    bgColorPicker.addEventListener("input", () => {
      previewHeaderText.style.backgroundColor = bgColorPicker.value;
    });
  } else {
    console.error("Element(s) not found. Please check the IDs.");
  }

  if (fontPicker && previewHeaderText) {
    // Set the initial background color

    previewHeaderText.style.fontSize = fontPicker.value;

    // Update the background color on input change
    fontPicker.addEventListener("select", () => {
      previewHeaderText.style.fontSize = fontPicker.value;
    });
  } else {
    console.error("Element(s) not found. Please check the IDs.");
  }

  if (colorPicker && previewHeaderText) {
    // Set the initial background color

    previewHeaderText.style.color = colorPicker.value;

    // Update the background color on input change
    colorPicker.addEventListener("input", () => {
      previewHeaderText.style.color = colorPicker.value;
    });
  } else {
    console.error("Element(s) not found. Please check the IDs.");
  }

  const handleBackgroundImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const errors: string[] = [];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        errors.push("Thumbnail must be an image file.");
      }

      // Validate file size (2MB max)
      const maxFileSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxFileSize) {
        errors.push("Thumbnail size must be less than 2MB.");
      }

      setErrors(errors);

      if (errors.length === 0) {
        setBgImage(file);
        setBgImagePreview(URL.createObjectURL(file));
      }
    }
  };
  const handleIconButtonClick = () => {
    //fileInputRef.current?.click();
  };
  const handleSiteIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const errors: string[] = [];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        errors.push("Thumbnail must be an image file.");
      }

      // Validate file size (2MB max)
      const maxFileSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxFileSize) {
        errors.push("Thumbnail size must be less than 2MB.");
      }

      setErrors(errors);

      if (errors.length === 0) {
        setSiteicon(file);
        setIconPreview(URL.createObjectURL(file));
      }
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col   px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Form className="" action={upsertSiteData}>
          <div>
            <div className="flex items-center space-x-4">
              {iconPreview && (
                <img
                  src={iconPreview}
                  alt="Icon preview"
                  className="h-10 text-slate-900 w-12  object-contain "
                />
              )}
              <p id="headrerTextPreview" className="h-10 w-40">
                {siteHeaderText!}
              </p>
            </div>
          </div>
          <div className="flex start-end  space-x-4">
            <Label
              htmlFor="siteIcon"
              className="h-10 block text-sm font-medium text-gray-700"
            >
              Site Icon
            </Label>
            <Label
              htmlFor="siteHeader"
              className="block mt-8 text-sm font-medium text-gray-700"
            >
              Header Text
            </Label>
          </div>

          <div className="mt-8 flex items-center space-x-4">
            <button
              onClick={handleIconButtonClick}
              className="relative inline-flex text-sm sm:text-base rounded-full font-medium border-2 border-transparent transition-colors outline-transparent focus:outline-transparent disabled:opacity-50 disabled:pointer-events-none disabled:opacity-40 disabled:hover:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
        text-white bg-[#4040F2] hover:bg-[#3333D1] focus:border-[#B3B3FD] focus:bg-[#4040F2] px-4 py-1 sm:py-1.5 sm:px-5"
            >
              Site Icon
            </button>
            <div className="mt-1">
              <Input
                id="siteHeader"
                name="siteHeader"
                type="text"
                value={siteHeaderText!}
                autoComplete="text"
                onChange={(e) => setSiteHeaderText(e.target.value)}
                required
                maxLength={50}
                className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Enter Header Text"
              />
            </div>
          </div>
          <div>
            <div>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  name="siteIcon"
                  id="siteIcon"
                  accept="image/*"
                  onChange={handleSiteIconChange}
                  className="h-10 block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400
             file:h-10 "
                  placeholder="Enter Site Icon "
                />
              </div>
              {siteid && <input type="hidden" name="siteId" value={siteid} />}
              {existingiconURL && (
                <input
                  type="hidden"
                  name="existingiconURL"
                  value={existingbgImageURL}
                />
              )}
              {existingbgImageURL && (
                <input
                  type="hidden"
                  name="existingbgImageURL"
                  value={existingbgImageURL}
                />
              )}
            </div>

            <div className="mt-1">
              <Input
                id="siteHeader"
                name="siteHeader"
                type="text"
                value={siteHeaderText!}
                autoComplete="text"
                onChange={(e) => setSiteHeaderText(e.target.value)}
                required
                maxLength={50}
                className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Enter Header Text"
              />
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              {/* Text Color */}
              <div>
                <label
                  htmlFor="textColor"
                  className="block text-sm font-medium mb-2"
                >
                  Text Color
                </label>
                <input
                  type="color"
                  className="p-1 h-10 w-14 block bg-white  cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
                  id="headerTextColor"
                  name="headerTextColor"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  title="Choose your color"
                ></input>
              </div>

              {/* Font Size */}
              <div>
                <label
                  htmlFor="fontSize"
                  className="block text-sm font-medium mb-2"
                >
                  Font Size
                </label>
                <select
                  id="headerFontSize"
                  name="headerFontSize"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg bg-white text-black text-sm dark:bg-neutral-800 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                >
                  {fontSizes.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Background Color */}
            <div>
              <label
                htmlFor="bgColor"
                className="block text-sm font-medium text-gray-700"
              >
                Background Color
              </label>
              <input
                type="color"
                name="headerBkgColor"
                id="headerBkgColor"
                value={bgColor}
                onChange={(e) => {
                  setBgColor(e.target.value);
                  setBgImage(null); // Clear background image
                }}
                className="p-1 h-10 w-14 block bg-white  cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
              />
            </div>
            {/* Background Image */}
            <div>
              <label htmlFor="file-input">Background Image</label>

              <input
                type="file"
                id="headerBkgImage"
                name="headerBkgImage"
                className="h-10 block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400
             file:h-10 "
                accept="image/*"
                onChange={handleBackgroundImageUpload}
              />
              {bgImagePreview && (
                <img
                  src={bgImagePreview}
                  alt="Background Image preview"
                  className="text-slate-900 w-12 h-12 mt-4 object-contain rounded-md border border-gray-300"
                />
              )}
            </div>

            <div className="flex flex-col items-center space-y-4">
              {existingiconURL && (
                <div className="flex flex-col items-center">
                  <img
                    src={existingiconURL}
                    alt="Current Icon"
                    className="w-24 h-24"
                  />
                  <p>{existingiconURL}</p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleSiteIconChange}
              />
              {/*
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Upload New Icon
              </button>
              */}
            </div>
            {/*above this */}
          </div>

          {errors.length > 0 && (
            <div className="text-red-500 text-sm">{errors}</div>
          )}

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Publish
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
