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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { formatCurrencyInput, formatCurrencyValue, normalizeCurrencyValue } from "@/lib/utils"
import { BuildingIcon, EditIcon, PlusIcon, Trash2Icon } from "lucide-react"

type Pavimento = {
  id: string
  nome: string
  valor: number
  valorTabela?: number
}

type Imovel = {
  id: string
  nome: string
  pavimentos: Pavimento[]
}

const STORAGE_KEY = "crm_imoveis"

const getImoveisFromStorage = (): Imovel[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  const parsed = stored ? JSON.parse(stored) : []
  return parsed.map((imovel: Imovel) => ({
    ...imovel,
    pavimentos: imovel.pavimentos.map((pav) => ({
      ...pav,
      valor: normalizeCurrencyValue(pav.valor),
    })),
  }))
}

export default function InventarioPage() {
  const [imoveis, setImoveis] = React.useState<Imovel[]>([])
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingImovel, setEditingImovel] = React.useState<Imovel | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<{
    imovelId: string
    pavimentoId: string
    imovelNome: string
    pavimentoNome: string
  } | null>(null)

  const [nomeImovel, setNomeImovel] = React.useState("")
  const [pavimentosList, setPavimentosList] = React.useState<
    Array<{ nome: string; valor: string; valorTabela: string }>
  >([{ nome: "", valor: "", valorTabela: "" }])

  const handleOpenDialog = (imovel?: Imovel) => {
    if (imovel) {
      setEditingImovel(imovel)
      setNomeImovel(imovel.nome)
      setPavimentosList(
        imovel.pavimentos.map((p) => ({
          nome: p.nome,
          valor: formatCurrencyValue(p.valor),
          valorTabela: p.valorTabela ? formatCurrencyValue(p.valorTabela) : "",
        }))
      )
    } else {
      setEditingImovel(null)
      setNomeImovel("")
      setPavimentosList([{ nome: "", valor: "", valorTabela: "" }])
    }
    setDialogOpen(true)
  }

  const handleSaveImovel = () => {
    if (!nomeImovel.trim()) return

    const pavimentosValidos = pavimentosList
      .filter((p) => p.nome.trim() && p.valor.trim())
      .map((p) => ({
        nome: p.nome.trim(),
        valor: normalizeCurrencyValue(p.valor),
        valorTabela: p.valorTabela.trim() ? normalizeCurrencyValue(p.valorTabela) : undefined,
      }))
    if (pavimentosValidos.length === 0) return

    let updatedImoveis: Imovel[]
    if (editingImovel) {
      updatedImoveis = imoveis.map((imovel) =>
        imovel.id === editingImovel.id
          ? {
              ...imovel,
              nome: nomeImovel.trim(),
              pavimentos: pavimentosValidos.map((p, idx) => ({
                id: `${imovel.id}-${idx}`,
                nome: p.nome,
                valor: p.valor,
                valorTabela: p.valorTabela,
              })),
            }
          : imovel
      )
    } else {
      const newId = String(Date.now())
      const newImovel: Imovel = {
        id: newId,
        nome: nomeImovel.trim(),
        pavimentos: pavimentosValidos.map((p, idx) => ({
          id: `${newId}-${idx}`,
          nome: p.nome,
          valor: p.valor,
          valorTabela: p.valorTabela,
        })),
      }
      updatedImoveis = [...imoveis, newImovel]
    }

    setImoveis(updatedImoveis)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedImoveis))
    setDialogOpen(false)
    setEditingImovel(null)
    setNomeImovel("")
    setPavimentosList([{ nome: "", valor: "", valorTabela: "" }])
  }

  const handleDeletePavimento = () => {
    if (!deleteTarget) return

    const updatedImoveis = imoveis
      .map((imovel) => {
        if (imovel.id === deleteTarget.imovelId) {
          const updatedPavimentos = imovel.pavimentos.filter(
            (p) => p.id !== deleteTarget.pavimentoId
          )
          return { ...imovel, pavimentos: updatedPavimentos }
        }
        return imovel
      })
      .filter((imovel) => imovel.pavimentos.length > 0)

    setImoveis(updatedImoveis)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedImoveis))
    setDeleteTarget(null)
  }

  const allPavimentos = imoveis.flatMap((imovel) =>
    imovel.pavimentos.map((pav) => ({
      ...pav,
      imovelNome: imovel.nome,
      imovelId: imovel.id,
    }))
  )

  // Carregar dados do localStorage ao montar o componente
  React.useEffect(() => {
    const stored = getImoveisFromStorage()
    setImoveis(stored)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventário</h1>
          <p className="text-muted-foreground">
            Gerencie os imóveis e seus pavimentos
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <PlusIcon className="mr-2 size-4" />
              Adicionar imóvel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingImovel ? "Editar imóvel" : "Novo imóvel"}
              </DialogTitle>
              <DialogDescription>
                Informe o nome do imóvel e adicione os pavimentos com seus
                valores.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome-imovel">Nome do imóvel</Label>
                <Input
                  id="nome-imovel"
                  placeholder="Ex: Residencial Vista Verde"
                  value={nomeImovel}
                  onChange={(e) => setNomeImovel(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Pavimentos</Label>
                <div className="space-y-2">
                  {pavimentosList.map((pav, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Nome do pavimento"
                        value={pav.nome}
                        onChange={(e) => {
                          const next = [...pavimentosList]
                          next[index].nome = e.target.value
                          setPavimentosList(next)
                        }}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Valor (R$)"
                        value={pav.valor}
                        onChange={(e) => {
                          const next = [...pavimentosList]
                          next[index].valor = formatCurrencyInput(e.target.value)
                          setPavimentosList(next)
                        }}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Valor de Tabela (R$)"
                        value={pav.valorTabela}
                        onChange={(e) => {
                          const next = [...pavimentosList]
                          next[index].valorTabela = formatCurrencyInput(e.target.value)
                          setPavimentosList(next)
                        }}
                        className="flex-1"
                      />
                      {pavimentosList.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() =>
                            setPavimentosList((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      )}
                      {index === pavimentosList.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setPavimentosList((prev) => [
                              ...prev,
                              { nome: "", valor: "", valorTabela: "" },
                            ])
                          }
                        >
                          <PlusIcon className="size-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveImovel}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BuildingIcon className="size-5" />
            <CardTitle>Imóveis cadastrados</CardTitle>
          </div>
          <CardDescription>
            {allPavimentos.length}{" "}
            {allPavimentos.length === 1 ? "pavimento" : "pavimentos"} em{" "}
            {imoveis.length} {imoveis.length === 1 ? "imóvel" : "imóveis"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imóvel</TableHead>
                <TableHead>Pavimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Valor de Tabela</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allPavimentos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    <div className="py-8 text-muted-foreground">
                      Nenhum imóvel cadastrado
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                allPavimentos.map((pav) => (
                  <TableRow key={pav.id}>
                    <TableCell className="font-medium">
                      {pav.imovelNome}
                    </TableCell>
                    <TableCell>{pav.nome}</TableCell>
                    <TableCell>{formatCurrencyValue(pav.valor)}</TableCell>
                    <TableCell>{pav.valorTabela ? formatCurrencyValue(pav.valorTabela) : "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            const imovel = imoveis.find(
                              (i) => i.id === pav.imovelId
                            )
                            if (imovel) handleOpenDialog(imovel)
                          }}
                        >
                          <EditIcon className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() =>
                            setDeleteTarget({
                              imovelId: pav.imovelId,
                              pavimentoId: pav.id,
                              imovelNome: pav.imovelNome,
                              pavimentoNome: pav.nome,
                            })
                          }
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir pavimento?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Tem certeza que deseja excluir o pavimento "${deleteTarget.pavimentoNome}" do imóvel "${deleteTarget.imovelNome}"?`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePavimento}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}