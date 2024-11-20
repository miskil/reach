'use client';

import Link from 'next/link';

import { useState, useActionState, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MousePointerClick, Loader2 } from 'lucide-react';
import { verifyAvailability, upsertSiteData } from '@/lib/actions'
import { ActionState } from '@/lib/auth/middleware';

interface VerifyAvailabilityResponse {
  success?: string;
  error?: string;
}


// Define the shape of the response from verifyAvailability
interface actionResponse {
  success?: string;
  error?: string;
}
type SiteDataInput = {
  siteId: string;
  siteicon?: File;  // Mark as optional
  siteHeader: string;
};

export default function ManageSite() {
 const [siteId, setSiteId] = useState('')

  const [siteHeader, setSiteHeader] = useState('')
  const [message, setMessage] = useState('') 

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');

   const [siteicon, setIcon] = useState<File | null>(null);
  
    const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

const handleSubmit = async (event: FormEvent) => {
  event.preventDefault();

  try {
    const siteData: SiteDataInput = { siteId, siteHeader };
    if (siteicon) {
      siteData.siteicon = siteicon;  // Only include if defined
    }
    
    await upsertSiteData(siteData);
    setMessage('Data saved successfully!');
  } catch (error) {
    console.error(error);
    setMessage('Failed to save data.');
  }
};
  // Handle the verification process
  const handleVerifyAvailability = async (): Promise<void> => {
    setLoading(true);
    setMessage(''); // Clear previous messages
    
    try {
      // Call verifyAvailability with both the tenant and the empty FormData
      const result: actionResponse = await verifyAvailability(siteId);

      // Update the message based on the response
      if (result.success) {
        setMessage(result.success);
      } else if (result.error) {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-1">
        <div className="border-b border-gray-900/10 pb-5">
          <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <Label htmlFor="siteurl" className="block text-base ffont-semibold leading-7 text-gray-900">
                Choose Your Site URL
              </Label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    reachpoint.site/
                  </span>
                  <Input
                    type="text"
                    name="siteurl"
                    id="siteurl"
                    value={siteId}
                    onChange={(e) => setSiteId(e.target.value)}
                    autoComplete="siteurl"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="mf"
                    required
                  />
                </div>
                <Button
                  type="button"
                  className="rounded-md bg-red-700 px-2.5 py-1.5 my-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-900"
                  onClick={handleVerifyAvailability}
                  disabled={loading}
                >
                  {loading ? 'Checking...' : 'Verify Availability'}
                </Button>
              </div>
              
              {/* Display message here */}
              <p>{message}</p>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-900/10 pb-5">
          <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <Label htmlFor="siteheader" className="block text-base ffont-semibold leading-7 text-gray-900">
                Set Header
              </Label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  
                  <Input
                    type="text"
                    name="siteheader"
                    id="siteheader"
                     value={siteHeader}
                    onChange={(e) => setSiteHeader(e.target.value)}
                    autoComplete="siteheader"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
       
              </div>
              

              {/* Display message here */}
           



            
            </div>
          </div>
        </div>
           <div className="border-b border-gray-900/10 pb-5">
          <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <Label htmlFor="siteheader" className="block text-base ffont-semibold leading-7 text-gray-900">
                Set Site Icon
              </Label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <      
                  input
                  type="file"
                  id="icon"
                  accept="image/*"
                  onChange={(e) => setIcon(e.target.files ? e.target.files[0] : null)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
              </div>

            
              {/* Display message here */}
           



            
            </div>
          </div>
        </div>
      </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
    </form>
  );
}
