import { Metadata } from "next";
import { headers } from "next/headers";
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
  const siteId = params.site;
  let name = params.name;
  name = decodeURIComponent(name); // Replace %20 with space

  const currentBlog = await getCurrentBlog(siteId!, name);
  return (
    <div>
      <BlogEditor blog={currentBlog!} siteId={siteId!} />
    </div>
  );
}
