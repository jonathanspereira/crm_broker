"use client"

import * as React from "react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon } from "lucide-react"

export function TeamSwitcher({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { state } = useSidebar()
  const isExpanded = state === "expanded"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="rounded-lg">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <GalleryVerticalEndIcon />
          </div>
          {isExpanded && (
            <span className="text-sm font-medium">{user.name}</span>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
