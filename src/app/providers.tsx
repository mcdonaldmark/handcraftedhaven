"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "./components/toast/ToastContext";
import { useEffect } from "react";


export default function Providers({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    const sessionId = localStorage.getItem("session_id") || crypto.randomUUID();
    localStorage.setItem("session_id", sessionId);
  }, [])

  return <SessionProvider>
    <ToastProvider>
      {children}
    </ToastProvider>
  </SessionProvider>;
}
