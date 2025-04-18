import { Metadata } from "next";
import BlogEditor from "@/components/ui/custom/BlogEditor";

import { getCurrentBlog } from "@/lib/actions";

interface Props {
  params: Promise<{
    site: string;
    name: string;
  }>;
}
export default async function CurrentBlog(props: Props) {
  const params = await props.params;
  let name = params.name;
  const siteId = params.site;
  name = decodeURIComponent(name); // Replace %20 with space

  const currentPage = await getCurrentBlog(siteId!, name);
  return (
    <div>
      <BlogEditor blog={currentPage!} siteId={siteId!} />
    </div>
  );
}
