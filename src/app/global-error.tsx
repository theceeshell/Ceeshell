"use client";

import { useEffect } from "react";

/** Last-resort boundary (root layout failed), so it can't rely on global CSS or fonts. */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#F8F7F4",
          color: "#0E3557",
          textAlign: "center",
          padding: 24,
        }}
      >
        <title>Something went wrong — Cee-Shell</title>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 500, margin: "0 0 12px" }}>Something went wrong</h1>
          <p style={{ margin: "0 0 24px", color: "#5b6573" }}>Please try again in a moment.</p>
          <button
            onClick={() => retry()}
            style={{ background: "#0E3557", color: "#fff", border: 0, borderRadius: 999, padding: "12px 28px", fontSize: 14, cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
