"use client";

import Link from "next/link";

import Form from "next/form";
import { upsertSiteData, SiteDataInput } from "@/lib/actions";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Trash2, ImageUp, CirclePlus } from "lucide-react";

import { ActionState } from "@/lib/auth/middleware";
import { SiteHeader as SiteHeaderType } from "@/lib/db/schema";
import { getSiteHeaderElements, deleteImage } from "@/lib/actions";

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

  const [textColor, setTextColor] = useState(headerdata?.headerTextColor);
  const [fontSize, setFontSize] = useState(headerdata?.headerFontSize);
  const [bgColor, setBgColor] = useState(headerdata?.headerBkgColor);
  const [bgImage, setBgImage] = useState<File | null>(null);
  const [bgImagePreview, setBgImagePreview] = useState(
    headerdata?.headerBkgImageURL || ""
  );

  const siteIconInputRef = useRef<HTMLInputElement>(null);
  const bkgImageInputRef = useRef<HTMLInputElement>(null);
  const fontPickerRef = useRef<HTMLSelectElement>(null);
  const colorPickerRef = useRef<HTMLInputElement>(null);
  const bgColorPickerRef = useRef<HTMLInputElement>(null);
  const bgImagePickerRef = useRef<HTMLInputElement>(null);
  const previewHeaderTextRef = useRef<HTMLParagraphElement>(null);

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

  useEffect(() => {
    const fontPicker = fontPickerRef.current;
    const colorPicker = colorPickerRef.current;
    const bgColorPicker = bgColorPickerRef.current;
    const bgImagePicker = bgImagePickerRef.current;
    const previewHeaderText = previewHeaderTextRef.current;

    if (bgImagePicker && previewHeaderText) {
      const imagePreview = `url(${bgImagePreview})`;
      previewHeaderText.style.backgroundImage = imagePreview;
      previewHeaderText.style.backgroundSize = "cover";

      bgImagePicker.addEventListener("input", () => {
        previewHeaderText.style.backgroundImage = imagePreview;
        previewHeaderText.style.backgroundSize = "cover";
      });
    } else {
      console.error("Element(s) not found. Please check the IDs.");
    }

    if (bgColorPicker && previewHeaderText) {
      previewHeaderText.style.backgroundColor = bgColorPicker.value;

      bgColorPicker.addEventListener("input", () => {
        previewHeaderText.style.backgroundColor = bgColorPicker.value;
      });
    } else {
      console.error("Element(s) not found. Please check the IDs.");
    }

    if (fontPicker && previewHeaderText) {
      previewHeaderText.style.fontSize = fontPicker.value;

      fontPicker.addEventListener("select", () => {
        previewHeaderText.style.fontSize = fontPicker.value;
      });
    } else {
      console.error("Element(s) not found. Please check the IDs.");
    }

    if (colorPicker && previewHeaderText) {
      previewHeaderText.style.color = colorPicker.value;

      colorPicker.addEventListener("input", () => {
        previewHeaderText.style.color = colorPicker.value;
      });
    } else {
      console.error("Element(s) not found. Please check the IDs.");
    }
  }, [bgImagePreview, bgColor, fontSize, textColor]);

  const handleSiteIconButtonClick = () => {
    siteIconInputRef.current?.click();
  };
  const handleBkgImageButtonClick = () => {
    bkgImageInputRef.current?.click();
  };

  const handleSiteIconDeleteClick = () => {
    setIconPreview("");
    setSiteicon(null);
    deleteImage(siteid, existingiconURL);
    setexitingIconURL("");
    // delete the existing icon
  };

  const handleBkgImageDeleteClick = () => {
    setBgImagePreview("");
    setBgImage(null);
    setExistingbgImageURL("");
    // delete the existing background image
  };
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
    <div className="min-h-[100dvh] flex flex-col px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Form className="" action={upsertSiteData}>
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-2">
              <p className="text-lg font-semibold">Col1</p>
              {iconPreview && (
                <img
                  src={iconPreview}
                  alt="Icon preview"
                  className="h-10 w-12 object-contain"
                />
              )}

              <div className="grid grid-cols-2 ">
                <div className="mt-4 col-span-2 items-center ">
                  <Label htmlFor="siteIcon">Site Icon</Label>
                </div>
                <div>
                  <button onClick={handleSiteIconButtonClick}>
                    <ImageUp />
                  </button>
                </div>
                <div>
                  <button onClick={handleSiteIconDeleteClick}>
                    <Trash2 />
                  </button>
                </div>
              </div>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-semibold">Col2</p>
              <div>
                <p
                  id="headrerTextPreview"
                  ref={previewHeaderTextRef}
                  className="h-10 w-80"
                >
                  {siteHeaderText!}
                </p>
                <div className="mt-4">
                  <Label htmlFor="siteHeader">Header Text</Label>
                </div>
                <Input
                  id="siteHeader"
                  name="siteHeader"
                  type="text"
                  value={siteHeaderText!}
                  autoComplete="text"
                  onChange={(e) => setSiteHeaderText(e.target.value)}
                  required
                  maxLength={50}
                  className="appearance-none rounded-full block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Enter Header Text"
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-1">
                <div>
                  <label
                    htmlFor="textColor"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Text Color
                  </label>
                  <input
                    type="color"
                    className="p-1 h-10 w-14 block bg-white cursor-pointer rounded-lg"
                    id="headerTextColor"
                    name="headerTextColor"
                    onChange={(e) => setTextColor(e.target.value)}
                    title="Choose your color"
                    ref={colorPickerRef}
                  />
                  <label
                    htmlFor="bgColor"
                    className="block mt-2 text-sm font-medium text-gray-700"
                  >
                    Background Color
                  </label>
                  <input
                    type="color"
                    name="headerBkgColor"
                    id="headerBkgColor"
                    value={bgColor!}
                    onChange={(e) => {
                      setBgColor(e.target.value);
                      setBgImage(null);
                    }}
                    className="p-1  h-10 w-14 block bg-white cursor-pointer rounded-lg"
                    ref={bgColorPickerRef}
                  />
                </div>

                <div>
                  <label
                    htmlFor="fontSize"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Font Size
                  </label>
                  <select
                    id="headerFontSize"
                    name="headerFontSize"
                    value={fontSize!}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="block mt-2 h-6 w-30 border border-gray-300 rounded-lg bg-white text-black text-sm focus:ring-blue-500 focus:border-blue-500"
                    ref={fontPickerRef}
                  >
                    {fontSizes.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor="file-input"
                    className=" mt-4 block text-sm font-medium text-gray-700"
                  >
                    Background Image
                  </label>
                  <div className="grid grid-cols-2 ">
                    <div>
                      <button onClick={handleBkgImageButtonClick}>
                        <ImageUp />
                      </button>
                    </div>
                    <div>
                      <button onClick={handleBkgImageDeleteClick}>
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col"></div>

              <div className="mt-4"></div>
            </div>
          </div>
          <div className="mt-8 flex items-center space-x-4">
            <input
              type="file"
              name="siteIcon"
              id="siteIcon"
              accept="image/*"
              ref={siteIconInputRef}
              style={{ display: "none" }}
              onChange={handleSiteIconChange}
            />
            <input
              type="file"
              id="headerBkgImage"
              name="headerBkgImage"
              className="h-10 block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              ref={bkgImageInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleBackgroundImageUpload}
            />
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
          {errors.length > 0 && (
            <div className="text-red-500 text-sm">{errors}</div>
          )}
          <div className="mt-4">
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
