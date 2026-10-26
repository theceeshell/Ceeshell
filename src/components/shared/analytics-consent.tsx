"use client";

import * as React from "react";
import Link from "next/link";
import Script from "next/script";
import type { SiteTexts } from "@/lib/cms/site-texts";

type Consent = "granted" | "denied" | null;

const STORAGE_KEY = "cs-analytics-consent";
const CHANGE_EVENT = "cs:analytics-consent";

/* Consent lives in localStorage; useSyncExternalStore keeps every reader in sync
   (banner, footer link) and renders nothing on the server, so no hydration mismatch. */
function readConsent(): Consent {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function writeConsent(value: Consent) {
  try {
    if (value) window.localStorage.setItem(STORAGE_KEY, value);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked (private mode): the choice lasts for this page view only.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function useConsent() {
  return React.useSyncExternalStore(subscribe, readConsent, () => "server" as const);
}

/** Loads Google Analytics only after the visitor accepts; asks once with a small banner. */
export function AnalyticsConsent({
  gaId,
  texts,
  privacyHref,
}: {
  gaId: string;
  texts: SiteTexts["cookies"];
  privacyHref: string;
}) {
  const consent = useConsent();

  if (consent === "granted") {
    return (
      <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { anonymize_ip: true });`}
        </Script>
      </>
    );
  }

  if (consent !== null) return null; // declined, or still on the server

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={texts.policyLink}
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-border bg-white p-5 shadow-lift sm:inset-x-6 sm:bottom-6"
    >
      <p className="text-sm leading-relaxed text-text">
        {texts.message}{" "}
        <Link href={privacyHref} className="font-medium text-primary underline underline-offset-4">
          {texts.policyLink}
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => writeConsent("denied")}
          className="rounded-full border border-primary/30 px-5 py-2.5 text-xs font-semibold text-primary transition-colors hover:border-primary"
        >
          {texts.decline}
        </button>
        <button
          type="button"
          onClick={() => writeConsent("granted")}
          className="rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          {texts.accept}
        </button>
      </div>
    </div>
  );
}

/** Footer link that clears the stored choice so the banner asks again. */
export function CookieSettingsLink({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => writeConsent(null)} className={className}>
      {label}
    </button>
  );
}
