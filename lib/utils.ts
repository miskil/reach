import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function subdomainURL(siteId: string, relURL: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const [httpvar, hostroot] = baseUrl.split("//");
  const redirectUrl = `${httpvar}//${siteId}.${hostroot}/${relURL}`;

  return redirectUrl;
}

export function getBaseDomain() {
  const baseDomain = `.${process.env.NEXT_PUBLIC_BASE_URL?.replace(
    /https?:\/\//,
    ""
  ).replace(/:3000/, "")}`;

  console.log("baseDomain", baseDomain);
  return baseDomain;
}
