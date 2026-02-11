"use client"

import * as React from "react"
import Link from "next/link"
import {
  BarChart3Icon,
  HomeIcon,
  LifeBuoyIcon,
  LogOutIcon,
  SettingsIcon,
  UsersIcon,
  FileTextIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navigation = [
  { label: "Início", href: "/", icon: HomeIcon },
  { label: "Clientes", href: "/clientes", icon: UsersIcon },
  { label: "Propostas", href: "/propostas", icon: FileTextIcon },
  { label: "Relatórios", href: "/relatorios", icon: BarChart3Icon },
]

const secondaryNavigation = [
  { label: "Suporte", href: "/suporte", icon: LifeBuoyIcon },
  { label: "Configurações", href: "/configuracoes", icon: SettingsIcon },
]

type SidebarLayoutProps = {
  children: React.ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className="flex min-h-svh bg-background">
      <aside
        className={cn(
          "relative flex h-svh flex-col border-r bg-sidebar text-sidebar-foreground transition-[width] duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 border-b px-3 py-4",
            collapsed && "justify-center"
          )}
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            CB
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">CRM Broker</span>
              <span className="text-xs text-muted-foreground">Painel</span>
            </div>
          )}
          <div className={cn("ml-auto", collapsed && "ml-0")}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              aria-expanded={!collapsed}
              onClick={() => setCollapsed((value) => !value)}
            >
              {collapsed ? (
                <PanelLeftOpenIcon className="size-4" />
              ) : (
                <PanelLeftCloseIcon className="size-4" />
              )}
              <span className="sr-only">
                {collapsed ? "Expandir" : "Recolher"} sidebar
              </span>
            </Button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => (
            <SidebarLink
              key={item.href}
              collapsed={collapsed}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </nav>

        <div className="space-y-1 border-t px-2 py-4">
          {secondaryNavigation.map((item) => (
            <SidebarLink
              key={item.href}
              collapsed={collapsed}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}
          <SidebarLink
            collapsed={collapsed}
            href="/sair"
            icon={LogOutIcon}
            label="Sair"
          />
        </div>

      </aside>

      <main className="min-w-0 flex-1 p-6">{children}</main>
    </div>
  )
}

type SidebarLinkProps = {
  collapsed: boolean
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

function SidebarLink({ collapsed, href, label, icon: Icon }: SidebarLinkProps) {
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            title={label}
            className={cn(
              "flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="size-4" />
            <span className="sr-only">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className="size-4" />
      <span className="truncate">{label}</span>
    </Link>
  )
}
