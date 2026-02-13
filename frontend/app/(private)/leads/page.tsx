"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  PlusIcon,
  EditIcon,
  Trash2Icon,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Lead = {
  id: string
  name: string
  email: string
  phone: string
  status: "novo" | "qualificado" | "negociacao" | "fechado" | "perdido"
  createdAt: string
}

const LEADS_STORAGE_KEY = "crm_leads"

export default function LeadsPage() {
  const [leads, setLeads] = React.useState<Lead[]>([])
  const [showForm, setShowForm] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [formData, setFormData] = React.useState<{
    name: string
    email: string
    phone: string
    status: Lead["status"]
  }>({
    name: "",
    email: "",
    phone: "",
    status: "novo",
  })
  const [showSaveToast, setShowSaveToast] = React.useState(false)

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LEADS_STORAGE_KEY)
      if (stored) {
        setLeads(JSON.parse(stored))
      }
    }
  }, [])

  React.useEffect(() => {
    if (!showSaveToast) return
    const timeout = setTimeout(() => setShowSaveToast(false), 2500)
    return () => clearTimeout(timeout)
  }, [showSaveToast])

  const handleSaveLead = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert("Por favor, preencha todos os campos")
      return
    }

    if (editingId) {
      // Atualizar
      const updated = leads.map(lead =>
        lead.id === editingId
          ? { ...lead, ...formData }
          : lead
      )
      setLeads(updated)
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated))
    } else {
      // Criar novo
      const newLead: Lead = {
        id: String(Date.now()),
        ...formData,
        createdAt: new Date().toISOString(),
      }
      const updated = [newLead, ...leads]
      setLeads(updated)
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated))
    }

    setFormData({ name: "", email: "", phone: "", status: "novo" })
    setEditingId(null)
    setShowForm(false)
    setShowSaveToast(true)
  }

  const handleEditLead = (lead: Lead) => {
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
    })
    setEditingId(lead.id)
    setShowForm(true)
  }

  const handleDeleteLead = (id: string) => {
    const updated = leads.filter(lead => lead.id !== id)
    setLeads(updated)
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated))
  }

  const handleCancel = () => {
    setFormData({ name: "", email: "", phone: "", status: "novo" })
    setEditingId(null)
    setShowForm(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "novo":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "qualificado":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "negociacao":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "fechado":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "perdido":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm)
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seus leads e prospects
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="gap-2"
        >
          <PlusIcon className="size-4" />
          Novo Lead
        </Button>
      </div>

      {/* Diálogo para criar/editar lead */}
      <AlertDialog open={showForm} onOpenChange={setShowForm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {editingId ? "Editar Lead" : "Novo Lead"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {editingId ? "Atualize as informações do lead" : "Preencha os campos abaixo para criar um novo lead"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lead-name">Nome</Label>
              <Input
                id="lead-name"
                placeholder="Nome completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                type="email"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-phone">Telefone</Label>
              <Input
                id="lead-phone"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Lead["status"] })}>
                <SelectTrigger id="lead-status">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="qualificado">Qualificado</SelectItem>
                  <SelectItem value="negociacao">Negociação</SelectItem>
                  <SelectItem value="fechado">Fechado</SelectItem>
                  <SelectItem value="perdido">Perdido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveLead}>
              {editingId ? "Atualizar" : "Salvar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Campo de busca */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9"
          />
        </CardContent>
      </Card>

      {/* Tabela de Leads */}
      <Card>
        <CardContent className="pt-6 p-0">
          {filteredLeads.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              {leads.length === 0 ? "Nenhum lead cadastrado" : "Nenhum lead encontrado para esta busca"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-3 text-left text-sm font-semibold">Nome</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Telefone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-3 text-sm">{lead.name}</td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">{lead.email}</td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">{lead.phone}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditLead(lead)}
                          >
                            <EditIcon className="size-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="h-8 w-8 text-destructive"
                              >
                                <Trash2Icon className="size-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir lead?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir "{lead.name}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteLead(lead.id)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {showSaveToast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-md border bg-background px-4 py-3 text-sm shadow-lg">
          <div className="font-medium text-green-600">
            Lead salvo com sucesso!
          </div>
        </div>
      )}
    </div>
  )
}
