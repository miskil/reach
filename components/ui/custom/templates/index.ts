// templates/index.ts
import TemplateOne from "@/components/ui/custom/templates/TemplateOne";
import TemplateTwo from "@/components/ui/custom/templates/TemplateTwo";
import { Template } from "../types/templates";

const templates: Template[] = [
  {
    id: "template-one",
    name: "Layout1",
    description: "header-slider-cards-footer layout.",
    previewImage: "/images/template-one.png", // Path to a preview image
    component: TemplateOne,
  },
  {
    id: "template-two",
    name: "layout2 ",
    description: "A sidebar-main layout.",
    previewImage: "/images/template-two.png",
    component: TemplateTwo,
  },
];
export default templates;
