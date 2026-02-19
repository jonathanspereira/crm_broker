"use client"

import * as React from "react"
import { BellIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

type LeadNotification = {
  id: string
  name: string
  origem?: string
  createdAt?: string
}

const STORAGE_KEY = "crm_seen_lead_notifications"
const TRACKED_ORIGINS = new Set(["trafego_pago", "trafego_pag", "instagram"])

const normalizeOrigin = (origin?: string) => (origin || "").trim().toLowerCase()

export function LeadNotificationBell() {
  const [newLeads, setNewLeads] = React.useState<LeadNotification[]>([])
  const initializedRef = React.useRef(false)
  const previousLeadIdsRef = React.useRef<Set<string>>(new Set())

  const getSeenIds = React.useCallback(() => {
    if (typeof window === "undefined") return new Set<string>()
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set<string>()

    try {
      const parsed = JSON.parse(raw) as string[]
      return new Set(parsed)
    } catch {
      return new Set<string>()
    }
  }, [])

  const setSeenIds = React.useCallback((ids: Set<string>) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)))
  }, [])

  const fetchNotifications = React.useCallback(async () => {
    try {
      const response = await fetch("/api/leads", { cache: "no-store" })
      if (!response.ok) return

      const leads = (await response.json()) as LeadNotification[]
      const seenIds = getSeenIds()

      const eligible = leads
        .filter((lead) => TRACKED_ORIGINS.has(normalizeOrigin(lead.origem)))
        .filter((lead) => !seenIds.has(lead.id))
        .sort((a, b) => {
          const aDate = new Date(a.createdAt || 0).getTime()
          const bDate = new Date(b.createdAt || 0).getTime()
          return bDate - aDate
        })

      const currentIds = new Set(eligible.map((lead) => lead.id))
      const previousIds = previousLeadIdsRef.current
      const newlyArrived = eligible.filter((lead) => !previousIds.has(lead.id))

      if (initializedRef.current && newlyArrived.length > 0) {
        const label = newlyArrived.length === 1 ? "1 novo lead" : `${newlyArrived.length} novos leads`
        toast.info(`🔔 ${label} (${newlyArrived.map((lead) => normalizeOrigin(lead.origem)).join(", ")})`)
      }

      previousLeadIdsRef.current = currentIds
      initializedRef.current = true

      setNewLeads(eligible)
    } catch {
      // silêncio para não poluir a UI com erro de polling
    }
  }, [getSeenIds])

  React.useEffect(() => {
    fetchNotifications()
    const interval = window.setInterval(fetchNotifications, 15000)
    return () => window.clearInterval(interval)
  }, [fetchNotifications])

  const markAllAsRead = () => {
    const seenIds = getSeenIds()
    newLeads.forEach((lead) => seenIds.add(lead.id))
    setSeenIds(seenIds)
    setNewLeads([])
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-8 w-8" title="Notificações de leads">
            <BellIcon className="size-4" />
            {newLeads.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                {newLeads.length > 9 ? "9+" : newLeads.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Novos leads</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {newLeads.length === 0 ? (
            <DropdownMenuItem disabled>Nenhuma nova notificação</DropdownMenuItem>
          ) : (
            <>
              {newLeads.slice(0, 8).map((lead) => (
                <DropdownMenuItem key={lead.id} className="flex flex-col items-start gap-0.5 py-2">
                  <span className="text-sm font-medium">{lead.name || "Lead sem nome"}</span>
                  <span className="text-xs text-muted-foreground">
                    Origem: {lead.origem || "—"}
                  </span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={markAllAsRead}>Marcar notificações como lidas</DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
