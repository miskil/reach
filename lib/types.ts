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
  more: string;
  imageFile?: File;
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
