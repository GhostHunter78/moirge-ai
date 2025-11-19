"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (window.location.hash.includes("access_token")) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div>
      <h1>Moirge AI</h1>
    </div>
  );
}
