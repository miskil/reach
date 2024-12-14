// app/[slug]/dashboard/page.tsx
'use client';

import { useState, useTransition } from 'react';

import { updateSiteParameters } from '@/lib/actions'


export default function DashboardPage({ params }: { params: { slug: string } }) {
  const [headerText, setHeaderText] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSave = async () => {
    startTransition(async () => {
      //await updateSiteParameters(params.slug, { headerText, iconUrl });
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <input
        type="text"
        value={headerText}
        onChange={(e) => setHeaderText(e.target.value)}
        placeholder="Enter header text"
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        value={iconUrl}
        onChange={(e) => setIconUrl(e.target.value)}
        placeholder="Enter icon URL"
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleSave}
        disabled={isPending}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
