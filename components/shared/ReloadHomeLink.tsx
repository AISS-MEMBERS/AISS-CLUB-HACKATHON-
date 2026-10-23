"use client";

import type { ReactNode } from "react";

export default function ReloadHomeLink({ children }: { children: ReactNode }) {
  return (
    <a
      href="#home"
      aria-label="AISS Club home"
      className="inline-flex shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E2A5A]"
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        window.history.scrollRestoration = "manual";
        window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
        window.location.reload();
      }}
    >
      {children}
    </a>
  );
}
