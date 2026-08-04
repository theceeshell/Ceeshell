import type { SVGProps } from "react";

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.3-.02-2.98-1.82-2.98-1.82 0-2.1 1.42-2.1 2.88V21h-4V9Z" />
    </svg>
  );
}

export function BehanceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14.5 8.4h5v-1.2h-5v1.2ZM7.7 12.1c1.02-.42 1.6-1.24 1.6-2.35 0-2.1-1.6-3-3.72-3H2v13.4h3.9c2.3 0 4.3-1.05 4.3-3.5 0-1.5-.83-2.6-2.5-2.55v-1ZM4.3 8.85h1.8c.9 0 1.7.3 1.7 1.32 0 .93-.63 1.4-1.62 1.4H4.3V8.85Zm2.05 8.3H4.3v-3.1h2.1c1.1 0 1.94.5 1.94 1.55 0 1.15-.9 1.55-1.99 1.55ZM22 15.05c0-2.9-1.6-5.05-4.68-5.05-2.85 0-4.8 2.14-4.8 4.95 0 2.94 1.83 4.9 4.87 4.9 2.1 0 3.83-.9 4.4-2.98h-2.16c-.24.68-1.03 1.08-2.1 1.08-1.5 0-2.34-.88-2.44-2.24H22v-.66Zm-6.87-1.36c.15-1.15.9-1.9 2.16-1.9 1.2 0 1.98.85 2.06 1.9h-4.22Z" />
    </svg>
  );
}
