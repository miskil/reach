'use client';

import Link from 'next/link';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useSearchParams, usePathname} from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MousePointerClick, Loader2 } from 'lucide-react';
import { upsertSiteData , SiteDataInput} from '@/lib/actions'
import { ActionState } from '@/lib/auth/middleware';
import { SiteHeader  as SiteHeaderType} from '@/lib/db/schema';
import { signOut, isSiteRegistered, getSiteHeaderElements } from '@/lib/actions';





type SiteHeaderProps = {
  siteid: string;
  headerdata: SiteHeaderType;
};
 

interface SiteData {
  headerText: string;
  icon: File | null;
}
export default function SetSiteHeaderForm({ siteid, headerdata }: SiteHeaderProps){

  const [siteicon, setSiteicon] = useState<File | null>(null);
  const [message, setMessage] = useState('')
  const [siteHeader, setSiteHeaderData] = useState<SiteHeaderType | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
 
 
  const [loading, setLoading] = useState(false);
  const [iconPreview, setIconPreview] = useState(headerdata!.siteiconURL);
  const [error, setError] = useState<string | null>(null);
  const [existingData, setExistingData] = useState<SiteHeaderType | null>(null); // For existing record data
  
  
  const [siteData, setSiteData] = useState({
    headerText: headerdata?.siteHeader!,
    siteIcon: null as File | null,
  });
 
  
 
    

const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSiteData((prev) => ({ ...prev, [name]: value }));
  };
    // Handle icon file upload
  const handleIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSiteData((prev) => ({ ...prev, siteIcon: file }));
      setIconPreview(URL.createObjectURL(file)); // Show thumbnail preview
    }
  };

  // Submit form data
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!siteData.headerText ) {
      setError("Header Text  is required.");
      setLoading(false);
      return;
    }

    try {
      
      const formData = new FormData();     
      formData.append('siteId', siteId!);
      formData.append('siteHeader', siteData.headerText);
      if (siteData.siteIcon) formData.append('siteicon', siteData.siteIcon);

      

      await upsertSiteData(formData); // Save data through API

      setSuccess("Site updated successfully!");
    } catch (err) {
      setError("Failed to update the site.");
    } finally {
      setLoading(false);
      setMessage ("Saved...Refresh to check")
    }
  };


  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-bold mb-4">Update Header</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="header">
            Header Text
          </label>
          <input
            type="text"
            id="header"
            name="headerText" 
            value={siteData?.headerText!}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="icon">
            Site Icon
          </label>
          <input
            type="file"
            name="siteIcon"
            id="icon"
            accept="image/*"
            onChange={handleIconChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
            {iconPreview && (
            <img
              src={iconPreview}
              alt="Icon preview"
              className="w-12 h-12 mt-4 object-contain rounded-md border border-gray-300"
            />
          )}
        </div>

        <button
         
         type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 text-white font-semibold rounded-md ${
            loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          {loading ? 'Saving...' : 'Save'}
        
        
          
        </button>

        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </form>
      
    </div>
  );
};




