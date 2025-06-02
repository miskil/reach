"use client";

import Link from "next/link";

import { useState, useActionState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MousePointerClick, Loader2 } from "lucide-react";
import { verifyAvailability, createTenant } from "@/lib/actions";
import { ActionState } from "@/lib/auth/middleware";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
//import { getUser } from '@/lib/db/queries';
import { subdomainURL } from "@/lib/utils";

interface VerifyAvailabilityResponse {
  success?: string;
  error?: string;
}

// Define the shape of the response from verifyAvailability
interface actionResponse {
  success?: string;
  error?: string;
}

export default function RegisterSite() {
  const router = useRouter(); // Initialize the router

  const [siteId, setSiteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isUrlAvailable, setIsUrlAvailable] = useState(false); // Track availability status
  const [SubmitMessage, setSubmitMessage] = useState("");

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const priceId = searchParams.get("priceId");
  const inviteId = searchParams.get("inviteId");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setSubmitMessage(""); // Clear previous messages
    setStatus("");

    try {
      await createTenant(siteId);
      setSubmitMessage("Site Registered successfully!");
      setStatus("success");
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
      const [httpvar, hostroot] = baseUrl.split("//");
      const redirectUrl = subdomainURL(siteId, "admin/managepage/PageCreate");

      setTimeout(() => {
        router.push(redirectUrl); // Redirect to the target page
      }, 1000);
    } catch (error) {
      console.error(error);
      setSubmitMessage("Failed to Register Site.");
      setStatus("error");
    }
  };
  // Handle the verification process
  const handleVerifyAvailability = async (): Promise<void> => {
    setLoading(true);
    setMessage(""); // Clear previous messages
    setSubmitMessage(""); // Clear previous messages
    setStatus("");
    setIsUrlAvailable(false);
    if (!siteId) {
      setMessage("Please enter your subdomain.");
      setLoading(false);
      return;
    }
    try {
      // Call verifyAvailability with both the tenant and the empty FormData
      const result: actionResponse = await verifyAvailability(siteId);

      // Update the message based on the response
      if (result.success) {
        setMessage(result.success);
        setStatus("success");
        setIsUrlAvailable(true);
      } else if (result.error) {
        setMessage(result.error);
        setStatus("error");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <MousePointerClick className="h-12 w-12 text-orange-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register Your Site
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto flex flex-col justify-center items-center sm:w-full sm:max-w-md">
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="space-y-1 w-full">
            <div className="sm:col-span-4 w-full">
              <Label
                htmlFor="siteurl"
                className="block text-base font-semibold leading-7 text-gray-900 text-center"
              >
                Choose Your Site URL
              </Label>
              <div className="mt-2 w-full">
                <div className="flex rounded-md shadow-sm  w-full max-w-[200px] mx-auto">
                  <Input
                    type="text"
                    name="siteurl"
                    id="siteurl"
                    value={siteId}
                    onChange={(e) => setSiteId(e.target.value)}
                    autoComplete="siteurl"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                    required
                  />
                  <span className="inline-flex items-center justify-start pl-0 pr-3 text-gray-500 sm:text-sm">
                    .reach.org
                  </span>
                </div>
                <Button
                  type="button"
                  className="rounded-md bg-red-700 px-2.5 py-1.5 my-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-900"
                  onClick={handleVerifyAvailability}
                  disabled={loading}
                >
                  {loading ? "Checking..." : "Verify Availability"}
                </Button>
              </div>
              {/* Display message here */}
              {message && (
                <div
                  className={`mt-4 p-3 rounded-lg text-center ${
                    status === "success" ? " text-green-700" : " text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Center the Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full rounded-md bg-red-700 text-white px-2.5 py-1.5 my-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-900 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
              disabled={!siteId.trim() || !isUrlAvailable}
            >
              Proceed to your website
            </button>
          </div>

          {/* Display message here */}
          {/* Display message here */}
          {SubmitMessage && (
            <div
              className={`mt-4 p-3 rounded-lg text-center ${
                status === "success" ? " text-green-700" : "text-red-700"
              }`}
            >
              {SubmitMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
