export type Item = {
  name: string;
  slug: string;
  description?: string;
};

export const adminmenu: { name: string; items: Item[] }[] = [
  {
    name: "Manage Site",
    items: [
      {
        name: "Header",
        slug: "admin/setsiteheader",
        description: "Set Header",
      },

      {
        name: "Menu",
        slug: "menu",
        description: "Manage Menu",
      },
    ],
  },
  {
    name: "Manage Content",
    items: [
      {
        name: "Banner",
        slug: "dashboard/managesite/siteurl",
        description: "Manage Banner",
      },
      {
        name: "Tiles",
        slug: "dashboard/managesite/siteurl",
        description: "Manage Tiles",
      },
      {
        name: "Blogs",
        slug: "dashboard/managesite/siteurl",
        description: "Manage Blogs",
      },
      {
        name: "Payment",
        slug: "dashboard/managesite/siteurl",
        description: "Manage Payment Form",
      },
    ],
  },
];
