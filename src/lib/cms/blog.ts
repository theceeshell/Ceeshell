/**
 * A post is on the website once it's "published" AND its publish date has
 * arrived, so posts can be scheduled. Pages are cached, so scheduled posts go
 * live within a day; the daily cron refreshes the site when one becomes due.
 */
export function livePostFilter() {
  return { status: "published", publishDate: { lte: new Date() } } as const;
}
