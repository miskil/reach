'use client';

import Link from 'next/link';

import { useState, useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MousePointerClick, Loader2 } from 'lucide-react';
import { verifyAvailability, createTenant } from '@/lib/actions'
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


export default function ManageContent() {
  const [siteUrl, setSiteUrl] = useState<string>('');  // State for the site URL
  const [message, setMessage] = useState<string>('');  // State for success/error messages
  const [loading, setLoading] = useState<boolean>(false);  // Loading state for async actions

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');

  // Handle the verification process
  const handleVerifyAvailability = async (): Promise<void> => {
    setLoading(true);
    setMessage(''); // Clear previous messages
    
    try {
      // Call verifyAvailability with both the tenant and the empty FormData
      const result: actionResponse = await verifyAvailability(siteUrl);

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
  const handleSaveSiteURL = async (): Promise<void> => {
    setLoading(true);
    setMessage(''); // Clear previous messages
   
    try {
      // Call verifyAvailability with both the tenant and the empty FormData
      const result: actionResponse = await createTenant(siteUrl );

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
    <form>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <Label htmlFor="siteurl" className="block text-base ffont-semibold leading-7 text-gray-900">
                Set Your Site Icon
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
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    autoComplete="siteurl"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="mf"
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
              {message && (
                <div className={`mt-2 text-sm ${message.includes('available') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}

                  <Button
                  type="button"
                  className="rounded-md bg-red-700 px-2.5 py-1.5 my-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-900"
                  onClick={handleSaveSiteURL}
                  disabled={loading}
                >
                 {loading ? 'Saving...' : 'Save'}
                </Button>
                </div>



              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

    {/** 
            <div className="col-span-full">
            <Label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">About</Label>
            <div className="mt-2">
                <textarea id="about" name="about" rows="3" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
            </div>

            <div className="col-span-full">
            <Label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">Photo</Label>
            <div className="mt-2 flex items-center gap-x-3">
                <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
                </svg>
                <Button type="button" className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Change</button>
            </div>
            </div>

            <div className="col-span-full">
            <Label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">Cover photo</Label >
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                    <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" />
                </svg>
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <Label htmlFor ="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                    <span>Upload a file</span>
                    <Input id="file-upload" name="file-upload" type="file" className="sr-only"/>
                    </Label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
            </div>
        </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">Personal InhtmlFor
    mation</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
            <Label
    htmlFor
    ="first-name" className="block text-sm font-medium leading-6 text-gray-900">First name</Label>
            <div className="mt-2">
                <Input
    type="text" name="first-name" id="first-name" autoComplete="given-name" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
            </div>

            <div className="sm:col-span-3">
            <Label
    htmlFor
    ="last-name" className="block text-sm font-medium leading-6 text-gray-900">Last name</Label>
            <div className="mt-2">
                <Input
    type="text" name="last-name" id="last-name" autoComplete="family-name" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
            </div>

            <div className="sm:col-span-4">
            <Label
    htmlFor
    ="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</Label>
            <div className="mt-2">
                <Input
    id="email" name="email" type="email" autoComplete="email" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
            </div>

            <div className="sm:col-span-3">
            <Label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">Country</Label>
            <div className="mt-2">
                <select id="country" name="country" autoComplete="country-name" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                <option>United States</option>
                <option>Canada</option>
                <option>Mexico</option>
                </select>
            </div>
            </div>

            <div className="col-span-full">
            <Label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">Street address</Label>
            <div className="mt-2">
                <Input type="text" name="street-address" id="street-address" autoComplete="street-address" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
            <Label htmlFor ="city" className="block text-sm font-medium leading-6 text-gray-900">City</Label>
            <div className="mt-2">
                <Input
    type="text" name="city" id="city" autoComplete="address-level2" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
            </div>

            <div className="sm:col-span-2">
            <Label
    htmlFor
    ="region" className="block text-sm font-medium leading-6 text-gray-900">State / Province</Label
    >
            <div className="mt-2">
                <Input
    type="text" name="region" id="region" autoComplete="address-level1" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
            </div>

            <div className="sm:col-span-2">
            <Label
    htmlFor
    ="postal-code" className="block text-sm font-medium leading-6 text-gray-900">ZIP / Postal code</Label
    >
            <div className="mt-2">
                <Input
    type="text" name="postal-code" id="postal-code" autoComplete="postal-code" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
            </div>
        </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">We'll always let you know about important changes, but you pick what else you want to hear about.</p>

        <div className="mt-10 space-y-10">
            <fieldset>
            <legend className="text-sm font-semibold leading-6 text-gray-900">By Email</legend>
            <div className="mt-6 space-y-6">
                <div className="relative flex gap-x-3">
                <div className="flex h-6 items-center">
                    <Input id="comments" name="comments" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                </div>
                <div className="text-sm leading-6">
                    <Label htmlFor="comments" className="font-medium text-gray-900">Comments</Label>
                    <p className="text-gray-500">Get notified when someones posts a comment on a posting.</p>
                </div>
                </div>
                <div className="relative flex gap-x-3">
                <div className="flex h-6 items-center">
                    <Input id="candidates" name="candidates" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                </div>
                <div className="text-sm leading-6">
                    <Label htmlFor="candidates" className="font-medium text-gray-900">Candidates</Label>
                    <p className="text-gray-500">Get notified when a candidate applies for a job.</p>
                </div>
                </div>
                <div className="relative flex gap-x-3">
                <div className="flex h-6 items-center">
                    <Input
    id="offers" name="offers" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                </div>
                <div className="text-sm leading-6">
                    <Label
    htmlFor
    ="offers" className="font-medium text-gray-900">Offers</Label>
                    <p className="text-gray-500">Get notified when a candidate accepts or rejects an offer.</p>
                </div>
                </div>
            </div>
            </fieldset>
            <fieldset>
            <legend className="text-sm font-semibold leading-6 text-gray-900">Push Notifications</legend>
            <p className="mt-1 text-sm leading-6 text-gray-600">These are delivered via SMS to your mobile phone.</p>
            <div className="mt-6 space-y-6">
                <div className="flex items-center gap-x-3">
                <Input
    id="push-everything" name="push-notifications" type="radio" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                <Label
    htmlFor
    ="push-everything" className="block text-sm font-medium leading-6 text-gray-900">Everything</Label>
                </div>
                <div className="flex items-center gap-x-3">
                <Input
    id="push-email" name="push-notifications" type="radio" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                <Label
    htmlFor
    ="push-email" className="block text-sm font-medium leading-6 text-gray-900">Same as email</Label>
                </div>
                <div className="flex items-center gap-x-3">
                <Input
    id="push-nothing" name="push-notifications" type="radio" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                <Label

    htmlFor="push-nothing" className="block text-sm font-medium leading-6 text-gray-900">No push notifications</Label>
                </div>
            </div>
            </fieldset>
        </div>
        </div>
    </div>

    <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
        <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
    </div>
    */}

    
    

    

