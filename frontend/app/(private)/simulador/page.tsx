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
}

type Imovel = {
  id: string
  nome: string
  pavimentos: Array<{ id: string; nome: string; valor: string }>
}

const IMOVEIS_STORAGE_KEY = "crm_imoveis"
const SIMULACOES_STORAGE_KEY = "crm_simulacoes"

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
  
  React.useEffect(() => {
    // Carregar simulações e empreendimentos do storage
    const imoveis = getImoveisFromStorage()
    const combinedList = buildEmpreendimentosCombinadosList(imoveis)
    setEmpreendimentosCombinadosList(combinedList)
    setHistory(getSimulacoesFromStorage())
    
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

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedId(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const [openNewSimulation, setOpenNewSimulation] = React.useState(false)
  const [openSaveConfirmation, setOpenSaveConfirmation] = React.useState(false)

  const handleCreateSimulation = () => {
    if (!clientName.trim()) {
      alert("Por favor, informe o nome do cliente")
      return
    }
    if (!empreendimento.trim() || !pavimento.trim()) {
      alert("Por favor, selecione um empreendimento e pavimento")
      return
    }
    const newSimulation: Simulation = {
      id: String(Date.now()),
      principal: clientName.trim(),
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
    }
    const updatedHistory = [newSimulation, ...history]
    setHistory(updatedHistory)
    localStorage.setItem(SIMULACOES_STORAGE_KEY, JSON.stringify(updatedHistory))
    setSelectedId(newSimulation.id)
    setClientName("")
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
  }

  const handleDelete = (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id)
    setHistory(updatedHistory)
    localStorage.setItem(SIMULACOES_STORAGE_KEY, JSON.stringify(updatedHistory))
    setSelectedId((prev) => (prev === id ? null : prev))
  }

  return (
    <div className="flex h-full flex-col gap-6 lg:flex-row">
      <aside className="w-full lg:w-64">
        <Card className="h-full">
          <CardHeader>
            <div className="space-y-1">
              <CardTitle>Histórico</CardTitle>
              <CardDescription>Fluxo de pagamento</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
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
                    Informe o cliente, imóvel e os proponentes da simulação.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cliente">Nome do cliente</Label>
                    <Input
                      id="cliente"
                      placeholder="Ex: Maria Oliveira"
                      value={clientName}
                      onChange={(event) => setClientName(event.target.value)}
                    />
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
        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CalculatorIcon className="size-5" />
                <CardTitle>Simulador de Financiamento</CardTitle>
              </div>
              <CardDescription>
                Preencha os dados para estimar o valor das parcelas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border bg-muted/30 p-3">
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
              <div className="grid gap-4 sm:grid-cols-2">
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
            <CardHeader>
              <CardTitle className="text-base">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Valor do imóvel</span>
                  <span className="font-medium text-destructive">-{selectedSimulation.valor}</span>
                </div>
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
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Desconto</span>
                  <span className="font-medium">{desconto > 0 ? `+${formatCurrency(desconto)}` : "—"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ato (Reserva)</span>
                  <span className="font-medium">{ato > 0 ? `+${formatCurrency(ato)}` : "—"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Residual (sinal)</span>
                  <span className="font-medium">{residual > 0 ? `+${formatCurrency(residual)}` : "—"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Entrada</span>
                  <span className="font-medium">{entrada > 0 ? `+${formatCurrency(entrada)}` : "—"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Intercalada</span>
                  <span className="font-medium">{intercalada > 0 ? `+${formatCurrency(intercalada)}` : "—"}</span>
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="rounded-md border border-dashed border-green-600 p-3">
                  <div className="text-xs text-muted-foreground">Saldo</div>
                  <div className={`mt-1 text-2xl font-bold ${saldo < 0 ? "text-destructive" : saldo > 0 ? "text-yellow-600" : "text-green-600"}`}>
                    {formatCurrency(saldo)}
                  </div>
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