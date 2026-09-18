import type { ReactNode } from "react";

import { SiteChrome } from "@/components/experience/site-chrome";

export function AppShell({ children }: { children: ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
