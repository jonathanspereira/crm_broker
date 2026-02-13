"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  CalculatorIcon,
  ClockIcon,
  FileTextIcon,
  HomeIcon,
  PlusIcon,
  Trash2Icon,
  UserIcon,
  UsersIcon,
  XIcon,
} from "lucide-react"

type Simulation = {
  id: string
  principal: string
  leadId?: string
  proponentes: string
  empreendimento: string
  pavimento: string
  valor: string
  financiamentoValue: string
  fgtsValue: string
  subsidioFederalValue: string
  subsidioEstadualValue: string
  descontoValue: string
  atoValue: string
  atoInstallments: string
  residualValue: string
  residualInstallments: string
  entradaValue: string
  entradaInstallments: string
  entradaTaxaJuros: string
  intercaladaValue: string
  intercaladaInstallments: string
  financiamentoInstallments: string
  financiamentoParcelaValue?: string
}

type Imovel = {
  id: string
  nome: string
  pavimentos: Array<{ id: string; nome: string; valor: string }>
}

type Lead = {
  id: string
  name: string
  email: string
  phone: string
  status: "novo" | "qualificado" | "negociacao" | "fechado" | "perdido"
  createdAt: string
}

const IMOVEIS_STORAGE_KEY = "crm_imoveis"
const SIMULACOES_STORAGE_KEY = "crm_simulacoes"
const LEADS_STORAGE_KEY = "crm_leads"

const getImoveisFromStorage = (): Imovel[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(IMOVEIS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

const getSimulacoesFromStorage = (): Simulation[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(SIMULACOES_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

const getLeadsFromStorage = (): Lead[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(LEADS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

const buildEmpreendimentosCombinadosList = (imoveis: Imovel[]) => {
  return imoveis.flatMap((emp) =>
    emp.pavimentos.map((pav) => ({
      value: `${emp.nome}|${pav.nome}`,
      label: `${emp.nome} - ${pav.nome}`,
      empreendimento: emp.nome,
      pavimento: pav.nome,
      valor: pav.valor,
    }))
  )
}
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function SimuladorPage() {
  const [history, setHistory] = React.useState<Simulation[]>([])
  const [leads, setLeads] = React.useState<Lead[]>([])
  const [selectedLeadId, setSelectedLeadId] = React.useState("")
  const [searchLeadTerm, setSearchLeadTerm] = React.useState("")
  const [showLeadDropdown, setShowLeadDropdown] = React.useState(false)
  const leadSearchRef = React.useRef<HTMLDivElement>(null)
  const [showNewLeadDialog, setShowNewLeadDialog] = React.useState(false)
  const [newLeadName, setNewLeadName] = React.useState("")
  const [newLeadEmail, setNewLeadEmail] = React.useState("")
  const [newLeadPhone, setNewLeadPhone] = React.useState("")
  const [empreendimentosCombinadosList, setEmpreendimentosCombinadosList] = React.useState<
    Array<{
      value: string
      label: string
      empreendimento: string
      pavimento: string
      valor: string
    }>
  >([])
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [clientName, setClientName] = React.useState("")
  const [hasMultipleProponents, setHasMultipleProponents] =
    React.useState(false)
  const [proponentsList, setProponentsList] = React.useState<string[]>([""])
  const [empreendimento, setEmpreendimento] = React.useState("")
  const [pavimento, setPavimento] = React.useState("")
  const [valor, setValor] = React.useState("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [deleteTarget, setDeleteTarget] = React.useState<Simulation | null>(
    null
  )
  
  // Parcelamento fields
  const [financiamentoValue, setFinanciamentoValue] = React.useState("")
  const [fgtsValue, setFgtsValue] = React.useState("")
  const [subsidioFederalValue, setSubsidioFederalValue] = React.useState("")
  const [subsidioEstadualValue, setSubsidioEstadualValue] = React.useState("")
  const [descontoValue, setDescontoValue] = React.useState("")
  const [atoValue, setAtoValue] = React.useState("")
  const [atoInstallments, setAtoInstallments] = React.useState("1")
  const [residualValue, setResidualValue] = React.useState("")
  const [residualInstallments, setResidualInstallments] = React.useState("1")
  const [entradaValue, setEntradaValue] = React.useState("")
  const [entradaInstallments, setEntradaInstallments] = React.useState("12")
  const [entradaTaxaJuros, setEntradaTaxaJuros] = React.useState("")
  const [intercaladaValue, setIntercaladaValue] = React.useState("")
  const [intercaladaInstallments, setIntercaladaInstallments] = React.useState("1")
  const [showSaveToast, setShowSaveToast] = React.useState(false)
  const [financiamentoInstallments, setFinanciamentoInstallments] = React.useState("360")
  const [editingFinanciamento, setEditingFinanciamento] = React.useState(false)
  const [financiamentoParcelaValue, setFinanciamentoParcelaValue] = React.useState("")
  
  React.useEffect(() => {
    // Carregar simulações e empreendimentos do storage
    const imoveis = getImoveisFromStorage()
    const combinedList = buildEmpreendimentosCombinadosList(imoveis)
    setEmpreendimentosCombinadosList(combinedList)
    setHistory(getSimulacoesFromStorage())
    setLeads(getLeadsFromStorage())
    
    // Listener para atualizar empreendimentos quando o inventário mudar
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === IMOVEIS_STORAGE_KEY) {
        const updatedImoveis = getImoveisFromStorage()
        const updatedList = buildEmpreendimentosCombinadosList(updatedImoveis)
        setEmpreendimentosCombinadosList(updatedList)
      }
      if (e.key === SIMULACOES_STORAGE_KEY) {
        setHistory(getSimulacoesFromStorage())
      }
      if (e.key === LEADS_STORAGE_KEY) {
        setLeads(getLeadsFromStorage())
      }
    }
    
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  React.useEffect(() => {
    if (!showSaveToast) return
    const timeoutId = window.setTimeout(() => {
      setShowSaveToast(false)
    }, 2500)
    return () => window.clearTimeout(timeoutId)
  }, [showSaveToast])
  
  // Helper function to parse currency and calculate installment
  const calculateInstallment = (value: string, installments: string, taxaJuros?: string) => {
    const numValue = parseFloat(value.replace(/[^0-9,]/g, "").replace(",", "."))
    const numInstallments = parseInt(installments)
    if (isNaN(numValue) || isNaN(numInstallments) || numInstallments === 0) return ""
    if (numInstallments === 1) return ""
    
    let finalValue = numValue
    if (taxaJuros) {
      const taxa = parseFloat(taxaJuros.replace(",", "."))
      if (!isNaN(taxa) && taxa > 0) {
        finalValue = numValue * (1 + taxa / 100)
      }
    }
    
    const installmentValue = finalValue / numInstallments
    return `${numInstallments}x R$ ${installmentValue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  
  // Helper function to calculate total from per-installment value (for Intercalada)
  const calculateIntercaladaTotal = (valuePerInstallment: string, installments: string) => {
    const numValue = parseFloat(valuePerInstallment.replace(/[^0-9,]/g, "").replace(",", "."))
    const numInstallments = parseInt(installments)
    if (isNaN(numValue) || isNaN(numInstallments) || numInstallments === 0) return ""
    if (numInstallments === 1) return ""
    const totalValue = numValue * numInstallments
    return `Total: R$ ${totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${numInstallments}x)`
  }
  
  // Helper to parse currency string to number
  const parseCurrency = (value: string): number => {
    const parsed = parseFloat(value.replace(/[^0-9,]/g, "").replace(",", "."))
    return isNaN(parsed) ? 0 : parsed
  }
  
  // Helper to format number to currency
  const formatCurrency = (value: number): string => {
    return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  
  const selectedSimulation = history.find((item) => item.id === selectedId)

  React.useEffect(() => {
    if (!selectedSimulation) return
    setFinanciamentoValue(selectedSimulation.financiamentoValue ?? "")
    setFgtsValue(selectedSimulation.fgtsValue ?? "")
    setSubsidioFederalValue(selectedSimulation.subsidioFederalValue ?? "")
    setSubsidioEstadualValue(selectedSimulation.subsidioEstadualValue ?? "")
    setDescontoValue(selectedSimulation.descontoValue ?? "")
    setAtoValue(selectedSimulation.atoValue ?? "")
    setAtoInstallments(selectedSimulation.atoInstallments ?? "1")
    setResidualValue(selectedSimulation.residualValue ?? "")
    setResidualInstallments(selectedSimulation.residualInstallments ?? "1")
    setEntradaValue(selectedSimulation.entradaValue ?? "")
    setEntradaInstallments(selectedSimulation.entradaInstallments ?? "12")
    setEntradaTaxaJuros(selectedSimulation.entradaTaxaJuros ?? "")
    setIntercaladaValue(selectedSimulation.intercaladaValue ?? "")
    setIntercaladaInstallments(selectedSimulation.intercaladaInstallments ?? "1")
    setFinanciamentoInstallments(selectedSimulation.financiamentoInstallments ?? "360")
    setFinanciamentoParcelaValue(selectedSimulation.financiamentoParcelaValue ?? "")
  }, [selectedSimulation])
  
  // Calculate summary values
  const valorImovel = selectedSimulation ? parseCurrency(selectedSimulation.valor) : 0
  const financiamento = parseCurrency(financiamentoValue)
  const fgts = parseCurrency(fgtsValue)
  const subsidioFederal = parseCurrency(subsidioFederalValue)
  const subsidioEstadual = parseCurrency(subsidioEstadualValue)
  const desconto = parseCurrency(descontoValue)
  const ato = parseCurrency(atoValue)
  const residual = parseCurrency(residualValue)
  const entrada = parseCurrency(entradaValue)
  const entradaTaxaPercentual = parseFloat(entradaTaxaJuros.replace(",", "."))
  const entradaComJuros = isNaN(entradaTaxaPercentual) || entradaTaxaPercentual === 0 ? entrada : entrada * (1 + entradaTaxaPercentual / 100)
  const intercalada = parseCurrency(intercaladaValue) * parseInt(intercaladaInstallments || "1")
  
  const totalSubsidios = subsidioFederal + subsidioEstadual
  const totalRecursosProprios = ato + residual + entrada + intercalada
  const valorComDesconto = valorImovel - desconto
  const saldo = financiamento + fgts + totalSubsidios + desconto + totalRecursosProprios - valorImovel
  const filteredHistory = history.filter((item) =>
    item.principal.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchLeadTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchLeadTerm.toLowerCase())
  )

  const selectedLead = leads.find(l => l.id === selectedLeadId)

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedId(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (leadSearchRef.current && !leadSearchRef.current.contains(event.target as Node)) {
        setShowLeadDropdown(false)
      }
    }

    if (showLeadDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showLeadDropdown])

  const [openNewSimulation, setOpenNewSimulation] = React.useState(false)
  const [openSaveConfirmation, setOpenSaveConfirmation] = React.useState(false)

  const handleCreateSimulation = () => {
    if (!selectedLeadId) {
      alert("Por favor, selecione um lead")
      return
    }
    if (!empreendimento.trim() || !pavimento.trim()) {
      alert("Por favor, selecione um empreendimento e pavimento")
      return
    }
    const newSimulation: Simulation = {
      id: String(Date.now()),
      principal: selectedLead?.name || "Sem nome",
      leadId: selectedLeadId,
      proponentes: hasMultipleProponents
        ? proponentsList.map((item) => item.trim()).filter(Boolean).join(", ")
        : "",
      empreendimento: empreendimento.trim(),
      pavimento: pavimento.trim(),
      valor: valor.trim(),
      financiamentoValue,
      fgtsValue,
      subsidioFederalValue,
      subsidioEstadualValue,
      descontoValue,
      atoValue,
      atoInstallments,
      residualValue,
      residualInstallments,
      entradaValue,
      entradaInstallments,
      entradaTaxaJuros,
      intercaladaValue,
      intercaladaInstallments,
      financiamentoInstallments,
      financiamentoParcelaValue,
    }
    const updatedHistory = [newSimulation, ...history]
    setHistory(updatedHistory)
    localStorage.setItem(SIMULACOES_STORAGE_KEY, JSON.stringify(updatedHistory))
    setSelectedId(newSimulation.id)
    setSelectedLeadId("")
    setSearchLeadTerm("")
    setHasMultipleProponents(false)
    setProponentsList([""])
    setEmpreendimento("")
    setPavimento("")
    setValor("")
    setOpenNewSimulation(false)
  }

  const handleSaveSimulation = () => {
    if (!selectedSimulation) return
    const updatedHistory = history.map((item) =>
      item.id === selectedSimulation.id
        ? {
            ...item,
            principal: selectedSimulation.principal,
            leadId: selectedSimulation.leadId,
            proponentes: selectedSimulation.proponentes,
            empreendimento: selectedSimulation.empreendimento,
            pavimento: selectedSimulation.pavimento,
            valor: selectedSimulation.valor,
            financiamentoValue,
            fgtsValue,
            subsidioFederalValue,
            subsidioEstadualValue,
            descontoValue,
            atoValue,
            atoInstallments,
            residualValue,
            residualInstallments,
            entradaValue,
            entradaInstallments,
            entradaTaxaJuros,
            intercaladaValue,
            intercaladaInstallments,
            financiamentoInstallments,
            financiamentoParcelaValue,
          }
        : item
    )
    setHistory(updatedHistory)
    localStorage.setItem(SIMULACOES_STORAGE_KEY, JSON.stringify(updatedHistory))
    setOpenSaveConfirmation(false)
    setShowSaveToast(true)
  }

  const handleClearValues = () => {
    setFinanciamentoValue("")
    setFgtsValue("")
    setSubsidioFederalValue("")
    setSubsidioEstadualValue("")
    setDescontoValue("")
    setAtoValue("")
    setAtoInstallments("1")
    setResidualValue("")
    setResidualInstallments("1")
    setEntradaValue("")
    setEntradaInstallments("12")
    setEntradaTaxaJuros("")
    setIntercaladaValue("")
    setIntercaladaInstallments("1")
    setFinanciamentoInstallments("360")
    setFinanciamentoParcelaValue("")
  }

  const handleDelete = (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id)
    setHistory(updatedHistory)
    localStorage.setItem(SIMULACOES_STORAGE_KEY, JSON.stringify(updatedHistory))
    setSelectedId((prev) => (prev === id ? null : prev))
  }

  const handleCreateLead = () => {
    if (!newLeadName.trim() || !newLeadEmail.trim() || !newLeadPhone.trim()) {
      alert("Por favor, preencha todos os campos do lead")
      return
    }

    const newLead: Lead = {
      id: String(Date.now()),
      name: newLeadName,
      email: newLeadEmail,
      phone: newLeadPhone,
      status: "novo",
      createdAt: new Date().toISOString(),
    }

    const updated = [newLead, ...leads]
    setLeads(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated))
    }

    // Limpar formulário e fechar diálogo
    setNewLeadName("")
    setNewLeadEmail("")
    setNewLeadPhone("")
    setShowNewLeadDialog(false)

    // Selecionar o novo lead
    setSelectedLeadId(newLead.id)
  }

  return (
    <div className="flex h-full flex-col gap-4 lg:flex-row">
      <aside className="w-full lg:w-64">
        <Card className="h-full">
          <CardHeader className="">
            <div className="flex items-center gap-2">
              <ClockIcon className="size-4" />
              <CardTitle className="text-sm">Histórico</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0">
            <div className="relative">
              <Input
                placeholder="Pesquisar por nome"
                aria-label="Pesquisar simulações"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pr-10"
              />
              {searchQuery ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                  aria-label="Limpar pesquisa"
                  onClick={() => setSearchQuery("")}
                >
                  <XIcon className="size-4" />
                </Button>
              ) : null}
            </div>
            {history.length === 0 ? (
              <div className="rounded-md border border-dashed p-4 text-xs text-muted-foreground">
                Nenhuma simulação registrada.
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={
                    "w-full rounded-md border p-3 text-left transition-colors cursor-pointer hover:bg-muted/40 " +
                    (selectedId === item.id
                      ? "border-primary/40 bg-muted"
                      : "")
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <UserIcon className="size-4 text-muted-foreground" />
                        <span>{item.principal}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <HomeIcon className="size-3.5" />
                        <span>
                          {item.empreendimento || "Empreendimento não informado"}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      aria-label={`Excluir simulação de ${item.principal}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        setDeleteTarget(item)
                      }}
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter className="border-t">
            <AlertDialog open={openNewSimulation} onOpenChange={setOpenNewSimulation}>
              <AlertDialogTrigger asChild>
                <Button className="w-full">Nova simulação</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Nova simulação</AlertDialogTitle>
                  <AlertDialogDescription>
                    Selecione o lead, imóvel e os proponentes da simulação.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lead">Lead *</Label>
                    {selectedLead ? (
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-3 py-1.5 rounded-full">
                          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">{selectedLead.name}</span>
                          <button
                            onClick={() => {
                              setSelectedLeadId("")
                              setSearchLeadTerm("")
                            }}
                            className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 ml-1"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div ref={leadSearchRef} className="relative flex gap-2">
                        <Input
                          id="lead"
                          placeholder="Buscar lead..."
                          value={searchLeadTerm}
                          onChange={(e) => {
                            setSearchLeadTerm(e.target.value)
                            setShowLeadDropdown(true)
                          }}
                          onFocus={() => setShowLeadDropdown(true)}
                          className="h-9 flex-1"
                        />
                        <Button
                          type="button"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => setShowNewLeadDialog(true)}
                          title="Adicionar novo lead"
                        >
                          <PlusIcon className="size-3.5" />
                        </Button>
                        
                        {showLeadDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-md z-50 max-h-48 overflow-y-auto">
                            {filteredLeads.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground text-center">
                                Nenhum lead encontrado
                              </div>
                            ) : (
                              filteredLeads.map(lead => (
                                <button
                                  key={lead.id}
                                  onClick={() => {
                                    setSelectedLeadId(lead.id)
                                    setSearchLeadTerm("")
                                    setShowLeadDropdown(false)
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                                >
                                  <div className="font-medium text-sm">{lead.name}</div>
                                  <div className="text-xs text-muted-foreground">{lead.email}</div>
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="empreendimento">Empreendimento + Pavimento</Label>
                    <Select
                      value={empreendimento && pavimento ? `${empreendimento}|${pavimento}` : ""}
                      onValueChange={(value) => {
                        const selected = empreendimentosCombinadosList.find(
                          (item) => item.value === value
                        )
                        if (selected) {
                          setEmpreendimento(selected.empreendimento)
                          setPavimento(selected.pavimento)
                          setValor(selected.valor)
                        }
                      }}
                    >
                      <SelectTrigger id="empreendimento">
                        <SelectValue placeholder="Selecione o empreendimento e pavimento" />
                      </SelectTrigger>
                      <SelectContent>
                        {empreendimentosCombinadosList.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="multiple-proponents"
                      checked={hasMultipleProponents}
                      onCheckedChange={(checked) => {
                        const isMultiple = checked === true
                        setHasMultipleProponents(isMultiple)
                        if (!isMultiple) {
                          setProponentsList([""])
                        }
                      }}
                    />
                    <Label
                      htmlFor="multiple-proponents"
                      className="cursor-pointer font-normal"
                    >
                      Mais de um proponente?
                    </Label>
                  </div>
                  {hasMultipleProponents && (
                    <div className="space-y-2">
                      <Label>Proponentes</Label>
                      <div className="space-y-2">
                        {proponentsList.map((value, index) => (
                          <div
                            key={`proponente-${index}`}
                            className="flex items-center gap-2"
                          >
                            <Input
                              placeholder={`Proponente ${index + 1}`}
                              value={value}
                              onChange={(event) => {
                                const next = [...proponentsList]
                                next[index] = event.target.value
                                setProponentsList(next)
                              }}
                            />
                            {proponentsList.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() =>
                                  setProponentsList((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  )
                                }
                              >
                                <Trash2Icon className="size-4" />
                              </Button>
                            )}
                            {index === proponentsList.length - 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  setProponentsList((prev) => [...prev, ""])
                                }
                              >
                                <PlusIcon className="size-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCreateSimulation}>
                    Criar simulação
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Dialog open={showNewLeadDialog} onOpenChange={setShowNewLeadDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Lead</DialogTitle>
                  <DialogDescription>
                    Cadastre um novo lead para usar nesta simulação.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-lead-name">Nome do lead</Label>
                    <Input
                      id="new-lead-name"
                      placeholder="Ex: João Silva"
                      value={newLeadName}
                      onChange={(e) => setNewLeadName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-lead-email">E-mail</Label>
                    <Input
                      id="new-lead-email"
                      placeholder="Ex: joao@example.com"
                      value={newLeadEmail}
                      onChange={(e) => setNewLeadEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-lead-phone">Telefone</Label>
                    <Input
                      id="new-lead-phone"
                      placeholder="Ex: (11) 9999-9999"
                      value={newLeadPhone}
                      onChange={(e) => setNewLeadPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowNewLeadDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateLead}>
                    Criar Lead
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </aside>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir simulação?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Tem certeza que deseja excluir a simulação de ${deleteTarget.principal}?`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) {
                  handleDelete(deleteTarget.id)
                  setDeleteTarget(null)
                }
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedSimulation ? (
        <div className="flex w-full flex-col gap-4 lg:flex-row">
          <Card className="w-full max-w-2xl">
            <CardHeader className="pb-1">
              <div className="flex items-center gap-2">
                <CalculatorIcon className="size-4" />
                <CardTitle className="text-base">Simulador de Financiamento</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Preencha os dados para estimar o valor das parcelas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <div className="rounded-md border bg-muted/30 p-2.5">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{selectedSimulation.principal}</span>
                  {selectedSimulation.proponentes && (
                    <>
                      <span className="text-muted-foreground">+</span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <UsersIcon className="size-3.5" />
                        <span className="text-xs">
                          {selectedSimulation.proponentes}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <HomeIcon className="size-3.5" />
                    <span>{selectedSimulation.empreendimento} - {selectedSimulation.pavimento}</span>
                  </div>
                  <span>•</span>
                  <span className="font-medium">{selectedSimulation.valor}</span>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="financiamento">Financiamento</Label>
                  <Input 
                    id="financiamento" 
                    placeholder="R$ 130.000" 
                    value={financiamentoValue}
                    onChange={(e) => setFinanciamentoValue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fgts">FGTS</Label>
                  <Input 
                    id="fgts" 
                    placeholder="R$ 30.000" 
                    value={fgtsValue}
                    onChange={(e) => setFgtsValue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subsidio-federal">Subsídio Federal (MCMV)</Label>
                  <Input 
                    id="subsidio-federal" 
                    placeholder="R$ 55.000" 
                    value={subsidioFederalValue}
                    onChange={(e) => setSubsidioFederalValue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subsidio-estadual">Subsídio Estadual (Morar Bem)</Label>
                  <Input 
                    id="subsidio-estadual" 
                    placeholder="R$ 20.000" 
                    value={subsidioEstadualValue}
                    onChange={(e) => setSubsidioEstadualValue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ato">Ato (Reserva)</Label>
                    {calculateInstallment(atoValue, atoInstallments) && (
                      <span className="text-xs text-muted-foreground">
                        {calculateInstallment(atoValue, atoInstallments)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      id="ato" 
                      placeholder="R$ 5.400" 
                      className="flex-1" 
                      value={atoValue}
                      onChange={(e) => setAtoValue(e.target.value)}
                    />
                    <Select value={atoInstallments} onValueChange={setAtoInstallments}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">À vista</SelectItem>
                        <SelectItem value="2">2x</SelectItem>
                        <SelectItem value="3">3x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="residual">Residual (sinal)</Label>
                    {calculateInstallment(residualValue, residualInstallments) && (
                      <span className="text-xs text-muted-foreground">
                        {calculateInstallment(residualValue, residualInstallments)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      id="residual" 
                      placeholder="R$ 5.400" 
                      className="flex-1" 
                      value={residualValue}
                      onChange={(e) => setResidualValue(e.target.value)}
                    />
                    <Select value={residualInstallments} onValueChange={setResidualInstallments}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">À vista</SelectItem>
                        <SelectItem value="2">2x</SelectItem>
                        <SelectItem value="3">3x</SelectItem>
                        <SelectItem value="4">4x</SelectItem>
                        <SelectItem value="5">5x</SelectItem>
                        <SelectItem value="6">6x</SelectItem>
                        <SelectItem value="7">7x</SelectItem>
                        <SelectItem value="8">8x</SelectItem>
                        <SelectItem value="9">9x</SelectItem>
                        <SelectItem value="10">10x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="entrada">Entrada</Label>
                    {calculateInstallment(entradaValue, entradaInstallments, entradaTaxaJuros) && (
                      <span className="text-xs text-muted-foreground">
                        {calculateInstallment(entradaValue, entradaInstallments, entradaTaxaJuros)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      id="entrada" 
                      placeholder="R$ 20.000" 
                      className="flex-1" 
                      value={entradaValue}
                      onChange={(e) => setEntradaValue(e.target.value)}
                    />
                    <Select value={entradaInstallments} onValueChange={setEntradaInstallments}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12x</SelectItem>
                        <SelectItem value="24">24x</SelectItem>
                        <SelectItem value="36">36x</SelectItem>
                        <SelectItem value="48">48x</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      placeholder="Taxa %" 
                      className="w-[80px]" 
                      value={entradaTaxaJuros}
                      onChange={(e) => setEntradaTaxaJuros(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="intercalada">Intercalada</Label>
                    {calculateIntercaladaTotal(intercaladaValue, intercaladaInstallments) && (
                      <span className="text-xs text-muted-foreground">
                        {calculateIntercaladaTotal(intercaladaValue, intercaladaInstallments)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      id="intercalada" 
                      placeholder="R$ 1.250 (por parcela)" 
                      className="flex-1" 
                      value={intercaladaValue}
                      onChange={(e) => setIntercaladaValue(e.target.value)}
                    />
                    <Select value={intercaladaInstallments} onValueChange={setIntercaladaInstallments}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">À vista</SelectItem>
                        <SelectItem value="2">2x</SelectItem>
                        <SelectItem value="3">3x</SelectItem>
                        <SelectItem value="4">4x</SelectItem>
                        <SelectItem value="5">5x</SelectItem>
                        <SelectItem value="6">6x</SelectItem>
                        <SelectItem value="7">7x</SelectItem>
                        <SelectItem value="8">8x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desconto">Desconto</Label>
                  <Input 
                    id="desconto" 
                    placeholder="R$ 5.000" 
                    value={descontoValue}
                    onChange={(e) => setDescontoValue(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={handleClearValues}>
                  Limpar valores
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full lg:w-80">
            <CardHeader >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileTextIcon className="size-4" />
                  <CardTitle className="text-sm">Resumo</CardTitle>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>{selectedSimulation.principal}</span>
                  {selectedSimulation.proponentes && (
                    <>
                      <span>+</span>
                      <UsersIcon className="size-3" />
                      <span>{selectedSimulation.proponentes}</span>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-1">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Valor do imóvel</span>
                  <span className="font-medium text-destructive">-R$ {selectedSimulation.valor}</span>
                </div>
              </div>
              <div className="border-t pt-1.5 space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Financiamento</span>
                  <span className="font-medium">{financiamento > 0 ? `+${formatCurrency(financiamento)}` : "—"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">FGTS</span>
                  <span className="font-medium">{fgts > 0 ? `+${formatCurrency(fgts)}` : "—"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subsídios</span>
                  <span className="font-medium">{totalSubsidios > 0 ? `+${formatCurrency(totalSubsidios)}` : "—"}</span>
                </div>
              </div>
              <div className="border-t pt-1.5 space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Desconto</span>
                  <span className="font-medium">{desconto > 0 ? `+${formatCurrency(desconto)}` : "—"}</span>
                </div>
              </div>
              <div className="border-t pt-1.5">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-foreground">Recursos Próprios</span>
                  <span className={totalRecursosProprios > 0 ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}>
                    {totalRecursosProprios > 0 ? `+${formatCurrency(totalRecursosProprios)}` : "—"}
                  </span>
                </div>
              </div>
              <div className="border-t pt-1.5">
                <div className="rounded-md border border-dashed border-green-600 p-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Saldo</span>
                    <span className={`text-lg font-bold ${saldo < 0 ? "text-destructive" : saldo > 0 ? "text-yellow-600" : "text-green-600"}`}>
                      {formatCurrency(saldo)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <div className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-2">
                  <span>Parcelas</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="space-y-1">
                  {financiamento > 0 && (
                    <div className="group">
                      {editingFinanciamento ? (
                        <div className="flex items-center gap-0.5 px-2 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20">
                          <span className="text-xs font-medium text-amber-700 dark:text-amber-400 min-w-[120px]">Financiamento</span>
                          <Input
                            type="text"
                            placeholder="R$ 0,00"
                            value={financiamentoParcelaValue}
                            onChange={(e) => setFinanciamentoParcelaValue(e.target.value)}
                            className="h-7 flex-1 text-xs border-amber-300 focus-visible:ring-amber-500"
                          />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">360x</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => setEditingFinanciamento(false)}
                          >
                            ✓
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-0.5 px-2 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                          <span className="text-xs font-medium text-amber-700 dark:text-amber-400 min-w-[120px]">Financiamento</span>
                          <span className="inline-flex items-center rounded-full bg-amber-500/20 px-1.5 py-0 text-xs font-medium text-amber-700 dark:text-amber-300">360×</span>
                          <span className="w-32 text-left font-semibold text-xs text-amber-700 dark:text-amber-300">
                            {financiamentoParcelaValue ? `R$ ${financiamentoParcelaValue}` : "a definir"}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                            onClick={() => setEditingFinanciamento(true)}
                          >
                            ✎
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {ato > 0 && (
                    <div className="flex items-center gap-0.5 px-2 py-1.5 rounded-lg bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 hover:border-green-500/40 transition-colors">
                      <span className="text-xs font-medium text-green-700 dark:text-green-400 min-w-[120px]">Ato (Reserva)</span>
                      <span className="inline-flex items-center rounded-full bg-green-500/20 px-1.5 py-0 text-xs font-medium text-green-700 dark:text-green-300">{atoInstallments.padStart(3, '0')}×</span>
                      <span className="w-32 text-left font-semibold text-xs text-green-700 dark:text-green-300">{formatCurrency(ato / parseInt(atoInstallments || "1"))}</span>
                      <span className="w-6" />
                    </div>
                  )}
                  
                  {residual > 0 && (
                    <div className="flex items-center gap-0.5 px-2 py-1.5 rounded-lg bg-gradient-to-r from-rose-500/10 to-rose-500/5 border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                      <span className="text-xs font-medium text-rose-700 dark:text-rose-400 min-w-[120px]">Residual (Sinal)</span>
                      <span className="inline-flex items-center rounded-full bg-rose-500/20 px-1.5 py-0 text-xs font-medium text-rose-700 dark:text-rose-300">{residualInstallments.padStart(3, '0')}×</span>
                      <span className="w-32 text-left font-semibold text-xs text-rose-700 dark:text-rose-300">{formatCurrency(residual / parseInt(residualInstallments || "1"))}</span>
                      <span className="w-6" />
                    </div>
                  )}
                  
                  {entrada > 0 && (
                    <div className="flex items-center gap-0.5 px-2 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-400 min-w-[120px]">Entrada</span>
                      <span className="inline-flex items-center rounded-full bg-blue-500/20 px-1.5 py-0 text-xs font-medium text-blue-700 dark:text-blue-300">{entradaInstallments.padStart(3, '0')}×</span>
                      <span className="w-32 text-left font-semibold text-xs text-blue-700 dark:text-blue-300">{formatCurrency(entrada / parseInt(entradaInstallments || "1"))}</span>
                      <span className="w-6" />
                    </div>
                  )}
                  
                  {intercalada > 0 && (
                    <div className="flex items-center gap-0.5 px-2 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                      <span className="text-xs font-medium text-purple-700 dark:text-purple-400 min-w-[120px]">Intercalada</span>
                      <span className="inline-flex items-center rounded-full bg-purple-500/20 px-1.5 py-0 text-xs font-medium text-purple-700 dark:text-purple-300">{intercaladaInstallments.padStart(3, '0')}×</span>
                      <span className="w-32 text-left font-semibold text-xs text-purple-700 dark:text-purple-300">{formatCurrency(parseCurrency(intercaladaValue))}</span>
                      <span className="w-6" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog open={openSaveConfirmation} onOpenChange={setOpenSaveConfirmation}>
                <DialogTrigger asChild>
                  <Button className="w-full">Salvar simulação</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar gravação</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja salvar as alterações desta simulação?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setOpenSaveConfirmation(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveSimulation} className="bg-green-600 hover:bg-green-700">
                      Salvar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <Card className="w-full max-w-2xl border-dashed">
          <CardContent className="flex min-h-[360px] flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <p>Selecione uma simulação no histórico</p>
            <p>ou crie uma nova para começar.</p>
          </CardContent>
        </Card>
      )}
      {showSaveToast ? (
        <div className="fixed bottom-4 right-4 z-50 rounded-md border bg-background px-4 py-3 text-sm shadow-lg">
          <div className="font-medium text-green-600">
            Simulação salva com sucesso!
          </div>
        </div>
      ) : null}
    </div>
  )
}