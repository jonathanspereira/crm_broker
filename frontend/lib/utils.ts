import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function normalizeCurrencyValue(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === "") return 0
  if (typeof value === "number") return value
  const digits = value.replace(/\D/g, "")
  if (!digits) return 0
  return Number(digits) / 100
}

export function formatCurrencyValue(value: string | number | null | undefined): string {
  const normalized = normalizeCurrencyValue(value)
  if (!normalized) return ""
  return currencyFormatter.format(normalized)
}

export function formatCurrencyInput(value: string): string {
  if (!value) return ""
  const digits = value.replace(/\D/g, "")
  if (!digits) return ""
  return currencyFormatter.format(Number(digits) / 100)
}
