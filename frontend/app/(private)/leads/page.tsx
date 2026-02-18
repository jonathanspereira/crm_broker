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
  ChevronDownIcon,
  ChevronUpIcon,
  MessageCircleIcon,
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
import { Badge } from "@/components/ui/badge"

type Lead = {
  id: string
  origem?: string
  name: string
  email: string
  phone: string
  status: "novo" | "qualificado" | "negociacao" | "fechado" | "perdido"
  createdAt: string
  tipoContrato?: string
  restricao?: boolean
  fgts?: string
}

export default function LeadsPage() {
  const [leads, setLeads] = React.useState<Lead[]>([])
  const [showForm, setShowForm] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterOrigem, setFilterOrigem] = React.useState<string>("all")
  const [indicatorMonth, setIndicatorMonth] = React.useState<string>("all")
  const [showIndicators, setShowIndicators] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState<{
    origem: string
    name: string
    email: string
    phone: string
    tipoContrato: string
    restricao: string
    fgts: string
  }>({
    origem: "",
    name: "",
    email: "",
    phone: "",
    tipoContrato: "",
    restricao: "nao",
    fgts: "",
  })
  const [showSaveToast, setShowSaveToast] = React.useState(false)

  // Carregar leads da API
  const fetchLeads = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/leads")
      if (!response.ok) throw new Error("Erro ao carregar leads")
      const data = await response.json()
      setLeads(data)
    } catch (error) {
      console.error("Erro ao carregar leads:", error)
      alert("Erro ao carregar leads. Verifique a conexão com o banco de dados.")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchLeads()
  }, [])

  React.useEffect(() => {
    if (!showSaveToast) return
    const timeout = setTimeout(() => setShowSaveToast(false), 2500)
    return () => clearTimeout(timeout)
  }, [showSaveToast])

  const handleSaveLead = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert("Por favor, preencha todos os campos")
      return
    }

    try {
      setLoading(true)

      if (editingId) {
        // Atualizar lead existente
        const response = await fetch("/api/leads", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            ...formData,
          }),
        })

        if (!response.ok) throw new Error("Erro ao atualizar lead")
      } else {
        // Criar novo lead
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            status: "novo",
          }),
        })

        if (!response.ok) throw new Error("Erro ao criar lead")
      }

      // Recarregar lista de leads
      await fetchLeads()

      setFormData({
        origem: "",
        name: "",
        email: "",
        phone: "",
        tipoContrato: "",
        restricao: "nao",
        fgts: "",
      })
      setEditingId(null)
      setShowForm(false)
      setShowSaveToast(true)
    } catch (error) {
      console.error("Erro ao salvar lead:", error)
      alert("Erro ao salvar lead. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleEditLead = (lead: Lead) => {
    setFormData({
      origem: lead.origem || "",
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      tipoContrato: lead.tipoContrato || "",
      restricao: lead.restricao ? "sim" : "nao",
      fgts: lead.fgts || "",
    })
    setEditingId(lead.id)
    setShowForm(true)
  }

  const handleDeleteLead = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/leads?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao excluir lead")

      // Recarregar lista de leads
      await fetchLeads()
    } catch (error) {
      console.error("Erro ao excluir lead:", error)
      alert("Erro ao excluir lead. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({ origem: "", name: "", email: "", phone: "", tipoContrato: "", restricao: "nao", fgts: "" })
    setEditingId(null)
    setShowForm(false)
  }

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "")
    const whatsappUrl = `https://wa.me/55${cleanPhone}`
    window.open(whatsappUrl, "_blank")
  }

  const origens = Array.from(
    new Set(
      leads
        .map((lead) => (lead.origem || "").trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b, "pt-BR"))

  const getMonthKey = (dateValue: string) => {
    const parsed = new Date(dateValue)
    if (Number.isNaN(parsed.getTime())) return null
    const month = String(parsed.getMonth() + 1).padStart(2, "0")
    return `${parsed.getFullYear()}-${month}`
  }

  const monthOptions = React.useMemo(() => {
    const monthSet = new Set<string>()
    leads.forEach((lead) => {
      if (!lead.createdAt) return
      const monthKey = getMonthKey(lead.createdAt)
      if (monthKey) monthSet.add(monthKey)
    })

    return Array.from(monthSet).sort((a, b) => b.localeCompare(a))
  }, [leads])

  const leadsForIndicators = React.useMemo(() => {
    if (indicatorMonth === "all") return leads
    return leads.filter((lead) => {
      if (!lead.createdAt) return false
      return getMonthKey(lead.createdAt) === indicatorMonth
    })
  }, [indicatorMonth, leads])

  const indicatorStats = React.useMemo(() => {
    const total = leadsForIndicators.length
    const statusCount = leadsForIndicators.reduce(
      (acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1
        return acc
      },
      {
        novo: 0,
        qualificado: 0,
        negociacao: 0,
        fechado: 0,
        perdido: 0,
      } as Record<Lead["status"], number>
    )

    const origemCount = leadsForIndicators.reduce((acc, lead) => {
      const origem = (lead.origem || "Sem origem").trim() || "Sem origem"
      acc[origem] = (acc[origem] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const origemEntries = Object.entries(origemCount).sort((a, b) => b[1] - a[1])
    const topOrigem = origemEntries[0]?.[0] || "—"

    return {
      total,
      statusCount,
      origemEntries,
      topOrigem,
    }
  }, [leadsForIndicators])

  const filteredLeads = leads.filter((lead) => {
    const origem = (lead.origem || "").trim()
    const term = searchTerm.toLowerCase()
    const matchSearch =
      origem.toLowerCase().includes(term) ||
      lead.name.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      lead.phone.includes(searchTerm)
    const matchOrigem = filterOrigem === "all" || origem === filterOrigem
    return matchSearch && matchOrigem
  })

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
          disabled={loading}
        >
          <PlusIcon className="size-4" />
          Novo Lead
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => setShowIndicators(!showIndicators)}
            className="flex items-center gap-2 text-left focus:outline-none group"
          >
            <div className="flex-1">
              <CardTitle className="group-hover:text-primary transition-colors">Indicadores</CardTitle>
              <CardDescription>
                Filtro por mes impacta somente indicadores e graficos.
              </CardDescription>
            </div>
            {showIndicators ? (
              <ChevronUpIcon className="size-5 text-muted-foreground" />
            ) : (
              <ChevronDownIcon className="size-5 text-muted-foreground" />
            )}
          </button>
          {showIndicators && (
            <div className="w-full sm:w-64">
              <Select value={indicatorMonth} onValueChange={setIndicatorMonth}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Filtrar mes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os meses</SelectItem>
                  {monthOptions.map((monthKey) => {
                    const [year, month] = monthKey.split("-")
                    const label = new Date(Number(year), Number(month) - 1, 1)
                      .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
                    return (
                      <SelectItem key={monthKey} value={monthKey}>
                        {label.charAt(0).toUpperCase() + label.slice(1)}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardHeader>
        {showIndicators && (
          <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">Total de leads</p>
                <p className="text-2xl font-semibold">{indicatorStats.total}</p>
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">Novos</p>
                <p className="text-2xl font-semibold">{indicatorStats.statusCount.novo}</p>
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">Qualificados</p>
                <p className="text-2xl font-semibold">{indicatorStats.statusCount.qualificado}</p>
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">Origem principal</p>
                <p className="text-base font-semibold">{indicatorStats.topOrigem}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Leads por origem</CardTitle>
                <CardDescription>Top 5 origens no periodo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {indicatorStats.origemEntries.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sem dados para o periodo.</p>
                ) : (
                  indicatorStats.origemEntries.slice(0, 5).map(([origem, total]) => {
                    const percent = indicatorStats.total
                      ? Math.round((total / indicatorStats.total) * 100)
                      : 0
                    return (
                      <div key={origem} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{origem}</span>
                          <span className="text-muted-foreground">{total}</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Leads por status</CardTitle>
                <CardDescription>Distribuicao no periodo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(
                  [
                    { label: "Novo", value: indicatorStats.statusCount.novo },
                    { label: "Qualificado", value: indicatorStats.statusCount.qualificado },
                    { label: "Negociacao", value: indicatorStats.statusCount.negociacao },
                    { label: "Fechado", value: indicatorStats.statusCount.fechado },
                    { label: "Perdido", value: indicatorStats.statusCount.perdido },
                  ]
                ).map((item) => {
                  const percent = indicatorStats.total
                    ? Math.round((item.value / indicatorStats.total) * 100)
                    : 0
                  return (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="text-muted-foreground">{item.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-foreground/80"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
          </CardContent>
        )}
      </Card>

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
              <Label htmlFor="lead-origem">Origem</Label>
              <Input
                id="lead-origem"
                placeholder="Ex: WhatsApp, Instagram, Indicação"
                value={formData.origem}
                onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
              />
            </div>
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
                placeholder="(XX) XXXXX-XXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-tipo-contrato">Tipo de Contrato</Label>
              <Select
                value={formData.tipoContrato}
                onValueChange={(value) => setFormData({ ...formData, tipoContrato: value })}
              >
                <SelectTrigger id="lead-tipo-contrato">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLT">CLT</SelectItem>
                  <SelectItem value="PJ">PJ</SelectItem>
                  <SelectItem value="Autonomo">Autônomo</SelectItem>
                  <SelectItem value="Aposentado">Aposentado</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-restricao">Restrição</Label>
              <Select
                value={formData.restricao}
                onValueChange={(value) => setFormData({ ...formData, restricao: value })}
              >
                <SelectTrigger id="lead-restricao">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nao">Sem restrição</SelectItem>
                  <SelectItem value="sim">Com restrição</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-fgts">FGTS (Saldo disponível)</Label>
              <Input
                id="lead-fgts"
                placeholder="Ex: 5000"
                value={formData.fgts}
                onChange={(e) => setFormData({ ...formData, fgts: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                O status inicial é definido automaticamente como "Novo".
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel} disabled={loading}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveLead} disabled={loading}>
              {loading ? "Salvando..." : editingId ? "Atualizar" : "Salvar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Campo de busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              placeholder="Buscar por origem, nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9"
            />
            <Select value={filterOrigem} onValueChange={setFilterOrigem}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Filtrar por origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as origens</SelectItem>
                {origens.map((origem) => (
                  <SelectItem key={origem} value={origem}>
                    {origem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Leads */}
      <Card>
        <CardContent className="pt-6 p-0">
          {loading ? (
            <div className="p-6 text-center text-muted-foreground">
              Carregando...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              {leads.length === 0 ? "Nenhum lead cadastrado" : "Nenhum lead encontrado para esta busca"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-3 text-left text-sm font-semibold">Origem</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Nome</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Telefone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Detalhes</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-3 text-sm text-muted-foreground">{lead.origem || "—"}</td>
                      <td className="px-6 py-3 text-sm">{lead.name}</td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">{lead.email}</td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">{lead.phone}</td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {lead.tipoContrato && (
                            <Badge variant="secondary">{lead.tipoContrato}</Badge>
                          )}
                          {lead.restricao !== undefined && (
                            <Badge variant={lead.restricao ? "destructive" : "outline"}>
                              {lead.restricao ? "Com restrição" : "Sem restrição"}
                            </Badge>
                          )}
                          {lead.fgts && (
                            <Badge variant="default">FGTS: R$ {lead.fgts}</Badge>
                          )}
                          {!lead.tipoContrato && lead.restricao === undefined && !lead.fgts && (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-green-600 hover:text-green-700"
                            onClick={() => openWhatsApp(lead.phone)}
                            title="Abrir conversa no WhatsApp"
                          >
                            <MessageCircleIcon className="size-3.5" />
                          </Button>
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
