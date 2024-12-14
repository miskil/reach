export default interface TileProps {
  image: string;
  text: string;
  moreLink: string;
  ref: React.RefObject<any>;
}

export default interface FormPageProps {
  siteId: string;
  bannerImages: string[];
  tiles: TileProps[];
  display: boolean;
}
export default interface CreatePageProps {
  siteId: string;
}
