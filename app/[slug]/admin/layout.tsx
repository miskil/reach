// app/[slug]/admin/layout.tsx


import  GlobalNav  from "@/components/ui/global-nav"
 import {getUserSiteId} from '@/lib/actions'
interface LayoutProps {

  children: React.ReactNode;
}


 


export default async function AdminLayout({  children }: LayoutProps) {
  
 const slug =   await getUserSiteId()||"";
  return(

    <div className="[color-scheme:dark]">
  <div className="flex flex-col lg:flex-row overflow-y-scroll bg-gray-1100 bg-[url('/grid.svg')] pb-36">
    {/* Sidebar (GlobalNav) */}
    <div className="lg:w-72 lg:flex-shrink-0">
      <GlobalNav siteId={slug} />
    </div>

    {/* Main Content */}
    <div className="flex-1 flex flex-col justify-start">
      <div className="max-w-4xl space-y-8 px-4  lg:px-8 lg:py-8">
        <div className="rounded-lg bg-vc-border-gradient p-px">
          <div className="rounded-lg p-3.5 lg:p-6">{children}</div>
        </div>
      </div>
    </div>
  </div>
</div>

    )
    {/* 
    <div className="[color-scheme:dark]">
      <div className="overflow-y-scroll bg-gray-1100 bg-[url('/grid.svg')] pb-36">
        <GlobalNav siteId= {slug}/>

        <div className="lg:pl-72">
          <div className="mx-auto max-w-4xl space-y-8 px-2 pt-20 lg:px-8 lg:py-8">
            <div className="rounded-lg bg-vc-border-gradient p-px">
              <div className="rounded-lg  p-3.5 lg:p-6">{children}</div>
            </div>
            
          </div>
        </div>

          
      </div>
    </div>
    */}

    
  
}