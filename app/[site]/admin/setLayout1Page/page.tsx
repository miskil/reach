// app/templates/page.tsx

import React, { useState } from "react";
import templates from "../../../../components/ui/custom/templates/index";
import Layout1Template from "../../../../components/ui/custom/templates/Layout1Template";
import { headers } from "next/headers";
import  {getSitePages} from "../../../../lib/actions"
import {Crea}


const ManagePage: React.FC = async () => {

  // Get Site Id
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");

  // Get Pages for Site
  const pages = getSitePages( siteId!)

  return (
    <div>
      {pages && pages.length > 0 ? (
        <PageList siteId={siteId} pages={pages} />
      ) : (
        <CreatePage siteId={siteId} />
      )}
    </div>
  );
};

export default ManagePage;
