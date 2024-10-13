// app/providers.tsx
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useUserId } from "@/hooks/useUserId";
import React from "react";

if (typeof window !== "undefined") {
  posthog.init("phc_8VdrFo8D7R0mX6P0OEdjZnv7XnAC2zzMFmBeOZoDjVg", {
    api_host: "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: true,
  });
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  const userId = useUserId();

  // Use useEffect to identify the user after the component mounts
  React.useEffect(() => {
    if (userId) {
      posthog.identify(userId);
    }
  }, [userId]);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
