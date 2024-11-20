
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getSiteIconURL } from  '@/lib/actions';// Adjust the path as necessary

interface IconDisplayProps {
  progressId: number;
}

export const SiteHeaderText = () => {
  const [SiteHeaderText, setSiteHeaderText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSiteHeaderText() {
      try {
        const header = await getSiteIconURL();
        setSiteHeaderText(header);
      } catch (error) {
        console.error('Error fetching header text :', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSiteHeaderText();
  }, []);

  if (loading) {
    return <p className="text-center">Loading headerText...</p>;
  }

  if (!SiteHeaderText) {
    return <p className="text-center">Header Text not available.</p>;
  }

  return (
    <div className="flex justify-center items-center mt-4">
      <p>{SiteHeaderText}</p>
     
    </div>
  );
};