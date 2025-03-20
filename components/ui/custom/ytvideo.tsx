"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

type YTVideoProps = {
  siteid: string;
  width?: string;
};

export default function YTVideo({ siteid, width }: YTVideoProps) {
  const { user, adminMode, setAdminMode } = useUser();
  const [preview, setPreview] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);

  const router = useRouter();

  const handleAdminClick = () => {
    setAdminMode(!adminMode);
    router.refresh();
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(e.target.value);
  };

  const handlePreview = () => {
    const id = extractVideoId(youtubeUrl);
    if (id) {
      setVideoId(id);
      setPreview(true);
    } else {
      alert("Invalid YouTube URL");
    }
  };

  const extractVideoId = (url: string): string | null => {
    const match =
      url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*v=([^&]+)/) ||
      url.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/);
    return match ? match[1] : null;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      const iframe = videoRef.current.contentWindow;
      if (iframe) {
        iframe.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          "*"
        );
      }
    }
  };

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div>
            {adminMode ? (
              <>
                {!preview ? (
                  <div>
                    <input
                      type="text"
                      value={youtubeUrl}
                      onChange={handleUrlChange}
                      placeholder="Enter YouTube URL"
                      className="p-2 border border-gray-300 rounded"
                    />
                    <button
                      onClick={handlePreview}
                      className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                    >
                      Preview
                    </button>
                  </div>
                ) : (
                  <div>
                    <iframe
                      ref={videoRef}
                      width="560"
                      height="315"
                      src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <button
                      onClick={() => setPreview(false)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded mt-2"
                    >
                      Modify
                    </button>
                  </div>
                )}
              </>
            ) : (
              videoId && (
                <div>
                  <iframe
                    ref={videoRef}
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <button
                    onClick={handlePlayPause}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                  >
                    Play/Pause
                  </button>
                </div>
              )
            )}
          </div>
        </div>
        <div>
          {user && (
            <button
              onClick={handleAdminClick}
              className={`px-4 py-2 rounded ${
                adminMode ? "bg-red-500 text-white" : "bg-blue-500 text-white"
              }`}
            >
              {adminMode ? "Exit Admin Mode" : "Enter Admin Mode"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
