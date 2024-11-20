import { headers } from "next/headers";
import SetSiteHeaderForm from '@/components/ui/custom/setsiteheaderform';
import SiteHeader from '../../../../components/ui/custom/siteheader'
export default async function SetSiteHeaderPage() {
   const headersList = await headers()
  const siteId = headersList.get('x-siteid');
 
  return (
       
      <SiteHeader siteid={siteId!} HeaderUI = {SetSiteHeaderForm}/>
      
   
  );
}