import type { Metadata } from "next"

import { AppSidebar } from "@/components/app-sidebar"
import { LeadNotificationBell } from "@/components/lead-notification-bell"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: "CRM Broker",
  description: "Área privada do CRM Broker",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-10 shrink-0 items-center justify-between gap-2 border-b px-3">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
            <span className="text-xs font-medium text-muted-foreground">
              CRM Broker
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <LeadNotificationBell />
            <ThemeToggle />
          </div>
        </header>
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
