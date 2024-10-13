// app/providers.tsx
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  // console.log("Initializing PostHog", process.env.NEXT_PUBLIC_POSTHOG_KEY);
  posthog.init("phc_8VdrFo8D7R0mX6P0OEdjZnv7XnAC2zzMFmBeOZoDjVg", {
    api_host: "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: true, // Disable automatic pageview capture, as we capture manually
  });
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
