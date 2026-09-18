"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Check, X } from "lucide-react";
import {
  COMPARE_CHANGE_EVENT,
  getCompareSnapshot,
  getCompareServerSnapshot,
} from "@/lib/compare/compare-store";
import {
  TRACKER_CHANGE_EVENT,
  getChoicesSnapshot,
  getChoicesServerSnapshot,
} from "@/lib/tracker/tracker-store";

const subscribeCompare = (fn: () => void) => {
  window.addEventListener(COMPARE_CHANGE_EVENT, fn);
  return () => window.removeEventListener(COMPARE_CHANGE_EVENT, fn);
};
const subscribeChoices = (fn: () => void) => {
  window.addEventListener(TRACKER_CHANGE_EVENT, fn);
  return () => window.removeEventListener(TRACKER_CHANGE_EVENT, fn);
};
export const useCompare = () =>
  useSyncExternalStore(
    subscribeCompare,
    getCompareSnapshot,
    getCompareServerSnapshot,
  );
export const useChoices = () =>
  useSyncExternalStore(
    subscribeChoices,
    getChoicesSnapshot,
    getChoicesServerSnapshot,
  );
export function notify(message: string) {
  window.dispatchEvent(new CustomEvent("susco-notice", { detail: message }));
}
export function persist(action: () => void) {
  try {
    action();
  } catch {
    notify(
      "Your browser could not save this change. Please allow local storage and try again.",
    );
  }
}

export function Notices() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handler = (event: Event) => {
      clearTimeout(timer);
      setMessage((event as CustomEvent<string>).detail);
      timer = setTimeout(() => setMessage(""), 4200);
    };
    window.addEventListener("susco-notice", handler);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("susco-notice", handler);
    };
  }, []);
  return (
    <div
      className={`notice ${message ? "visible" : ""}`}
      role="status"
      aria-live="polite"
    >
      {message && (
        <>
          <Check size={18} />
          <span>{message}</span>
          <button
            aria-label="Dismiss notification"
            onClick={() => setMessage("")}
          >
            <X size={16} />
          </button>
        </>
      )}
    </div>
  );
}
