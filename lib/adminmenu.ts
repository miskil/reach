export type Item = {
  name: string;
  slug: string;
  description?: string;
  image?: string;
};
import layout1 from "../image/layout1.jpg";
import layout2 from "../image/layout2.jpg";
import blog from "../image/blog.jpg";

export const adminmenu: { name: string; items: Item[] }[] = [
  {
    name: "Manage Site",
    items: [
      {
        name: "Header",
        slug: "admin/setsiteheader",
        description: "Set Header",
        image: "",
      },

      {
        name: "Menu",
        slug: "menu",
        description: "Manage Menu",
        image: "",
      },
      {
        name: "Manage Pages",
        slug: "admin/managepage",
        description: "Manage Pages",
        image: "",
      },
    ],
  },
];
