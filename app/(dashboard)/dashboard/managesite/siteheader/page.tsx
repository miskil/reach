'use client';

import Link from 'next/link';

import { useState, FormEvent} from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MousePointerClick, Loader2 } from 'lucide-react';
import { upsertSiteData , SiteDataInput} from '@/lib/actions'
import { ActionState } from '@/lib/auth/middleware';




interface HeaderProps {
  headerText: string;
  iconUrl: string;
}

const UpdateHeaderPage: React.FC<HeaderProps> = () => {
  const [siteId, setSiteId] = useState('')
  const [siteicon, setSiteicon] = useState<File | null>(null);
  const [siteHeader, setSiteHeader] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

      // Create an instance of FormData
 
  const formData= new FormData;
  formData.append('siteId', siteId);
  formData.append('header', siteHeader);
  if (siteicon) formData.append('icon', siteicon);

    await upsertSiteData(formData);
   
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
            value={siteHeader}
            onChange={(e) => setSiteHeader(e.target.value)}
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
            id="icon"
            accept="image/*"
            onChange={(e) => setSiteicon(e.target.files ? e.target.files[0] : null)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update Header
        </button>

        {message && <p className="mt-4 text-center text-sm">{status}</p>}
      </form>
      
    </div>
  );
};



export default UpdateHeaderPage;
