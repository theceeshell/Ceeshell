"use client";

import * as React from "react";
import { resolveSiteTexts, type SiteTexts } from "@/lib/cms/site-texts";

/**
 * Hands the editable texts that client components can't fetch themselves
 * (the error page, screen reader labels) down from the server layout.
 * Outside the provider the hooks fall back to the default wording.
 */
export type ClientSiteTexts = Pick<SiteTexts, "errorPage" | "accessibility">;

const defaults = resolveSiteTexts(undefined);
const fallback: ClientSiteTexts = { errorPage: defaults.errorPage, accessibility: defaults.accessibility };

const SiteTextsContext = React.createContext<ClientSiteTexts>(fallback);

export function SiteTextsProvider({ value, children }: { value: ClientSiteTexts; children: React.ReactNode }) {
  return <SiteTextsContext.Provider value={value}>{children}</SiteTextsContext.Provider>;
}

export function useErrorTexts() {
  return React.useContext(SiteTextsContext).errorPage;
}

export function useA11yTexts() {
  return React.useContext(SiteTextsContext).accessibility;
}
