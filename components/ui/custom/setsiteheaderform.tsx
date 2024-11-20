'use client';

import Link from 'next/link';

import Form  from 'next/form';
import { upsertSiteData , SiteDataInput} from '@/lib/actions'

import { useState} from 'react';
import { useSearchParams, usePathname} from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ActionState } from '@/lib/auth/middleware';
import { SiteHeader  as SiteHeaderType} from '@/lib/db/schema';
import {  getSiteHeaderElements } from '@/lib/actions';





type SiteHeaderProps = {
  siteid: string;
  headerdata: SiteHeaderType;
};
 

interface SiteData {
  headerText: string;
  icon: File | null;
}
export default function SetSiteHeaderForm({ siteid, headerdata }: SiteHeaderProps){

  const [siteHeader, setSiteHeaderData] = useState(headerdata || null);
  const [siteHeaderText, setSiteHeaderText] = useState(headerdata?.siteHeader || '')
 
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState('')
 
  const [iconPreview, setIconPreview] = useState(headerdata?.siteiconURL || '');
  const [siteicon, setSiteicon] = useState<File | null>(null);
  
 
   
  const handleSiteIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const errors: string[] = [];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        errors.push('Thumbnail must be an image file.');
      }

      // Validate file size (2MB max)
      const maxFileSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxFileSize) {
        errors.push('Thumbnail size must be less than 2MB.');
      }

      setErrors(errors);

      if (errors.length === 0) {
        setSiteicon(file);
        setIconPreview(URL.createObjectURL(file));
      }
    }
  };
 
 
 
    

  return (
    <div className="min-h-[100dvh] flex flex-col   px-4 sm:px-6 lg:px-8 bg-gray-50">
      

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Form className="space-y-6" action={upsertSiteData}>
          
          {siteid && <input type="hidden" name="siteId" value={siteid} />}


          <div>
            <Label
              htmlFor="siteHeader"
              className="block text-sm font-medium text-gray-700"
            >
              Header Text
            </Label>
            <div className="mt-1">
              <Input
                id="siteHeader"
                name="siteHeader"
                type="text"
                value={siteHeaderText!}
                autoComplete="text"
                onChange={(e) => setSiteHeaderText(e.target.value)}
                required
                maxLength={50}
                className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Enter Header Text"
              />
            </div>
          <div >
            <Label
              htmlFor="siteIcon"
              className="block text-sm font-medium text-gray-700"
            >
              Site Icon
            </Label>
            <div className="mb-4">
              
            <Input
              type="file"
              name="siteIcon"
              id="siteIcon"
              accept="image/*"

               
              onChange={handleSiteIconChange}
              className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
              placeholder="Enter Site Icon "            />
            {iconPreview && (
            <img
              src={iconPreview}
              alt="Icon preview"
              className="w-12 h-12 mt-4 object-contain rounded-md border border-gray-300"
            />
          )}
        </div>
        </div>
          </div>

          

          {errors.length>0 && (
            <div className="text-red-500 text-sm">{errors}</div>
          )}

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              
            >
              
              "Save"
             
            </Button>
          </div>
        </Form>

        
      </div>
    </div>
  );
}





