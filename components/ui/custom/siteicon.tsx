
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getSiteIconURL } from  '@/lib/actions';// Adjust the path as necessary

interface SiteProps {
  SiteId: string;
}

export const SiteIcon:React.FC<SiteProps> = ({SiteId}) => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIconUrl() {
      try {
        const url = await getSiteIconURL(SiteId);
        setIconUrl(url);
      } catch (error) {
        console.error('Error fetching icon URL:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchIconUrl();
  }, []);

  if (loading) {
    return <p className="text-center">Loading icon...</p>;
  }

  if (!iconUrl) {
    return <p className="text-center">Icon not available.</p>;
  }

  return (
    <div className="flex justify-center items-center mt-4">
      <Image
        src={iconUrl}
        alt="Site Icon"
        width={50} // Adjust width as needed
        height={50} // Adjust height as needed
        className="rounded-md"
      />
    </div>
  );
};

