/**
 * Dates rendered on both server and client must format identically, or React
 * reports a hydration mismatch. So never use the visitor's locale/time zone:
 * always en-US in the studio's time zone.
 */
const TIME_ZONE = "Asia/Karachi";

const formats = {
  short: new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: TIME_ZONE }),
  long: new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: TIME_ZONE }),
};

export function formatDate(value: Date | string, style: keyof typeof formats = "short") {
  return formats[style].format(new Date(value));
}
