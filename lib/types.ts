import React from "react";

export interface Topic {
  id: number;
  name: string | null;
  pageUrl: string | null;
  order: number;
}

export interface Module {
  id: number;
  name: string | null;
  pageUrl: string | null;
  topics: Topic[];
  order: number;
}

export interface Course {
  id: number;
  title: string;
  pageUrl: string | null;
  modules: Module[];
}
export interface Tile {
  id: number;
  image: string;
  text: string;
  type: string;
  moreButtonText?: string;
  moreUrl?: string;
  imageFile?: File;
  Title?: string;
  TileURL?: string;
}
export interface TileWidget {
  Tile: Tile[];
}
export interface Image {
  id: number;
  url: string;
  imageFile?: File;
}
export interface BannerWidget {
  images: Image[];
}
export interface SectionHeader {
  id?: number;
  backgroundColor: string;
  textColor: string;
  headerText: string;
}

export interface CourseProps {
  id?: string;
  siteId: string;
  name: string;
  content_id: string;
  content: string;
  contentStyle: React.CSSProperties;
  bkgImageFile?: File | null;
  width?: string;
  height?: string;

  modules: {
    id?: string;
    name: string;
    content_id: string;
    content: string;
    contentStyle: React.CSSProperties;
    bkgImageFile?: File | null;
    width?: string;
    height?: string;

    topics: {
      id?: string;
      name: string;
      content_id: string;
      content: string;
      contentStyle: React.CSSProperties;
      bkgImageFile?: File | null;
      width?: string;
      height?: string;
    }[];
  }[];
}

export interface TextContent {
  id: string;
  textHtml: string;
  contentStyle: React.CSSProperties;
  bkgImageFile?: File | null;
  width?: string;
  height?: string;
}
