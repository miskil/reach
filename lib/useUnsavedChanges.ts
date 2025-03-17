"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useUnsavedChanges(isDirty: boolean) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = ""; // Standard message for unsaved changes
      }
    };

    const handleRouteChange = (nextPath: string) => {
      if (isDirty && nextPath !== pathname) {
        const confirmLeave = window.confirm(
          "You have unsaved changes. Do you really want to leave?"
        );
        if (!confirmLeave) {
          throw "Navigation aborted"; // Prevents route change
        }
      }
    };

    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = async (url, options) => {
      handleRouteChange(url);
      return originalPush(url, options);
    };

    router.replace = async (url, options) => {
      handleRouteChange(url);
      return originalReplace(url, options);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [isDirty, pathname, router]);
}
