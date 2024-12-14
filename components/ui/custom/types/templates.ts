export type Template = {
  id: string;
  name: string;
  description: string;
  previewImage: string; // URL of a preview image
  component: React.FC;
};
