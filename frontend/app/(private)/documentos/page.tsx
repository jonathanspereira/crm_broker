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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileTextIcon,
  PlusIcon,
  PencilIcon,
  SaveIcon,
  CopyIcon,
  Trash2Icon,
  DownloadIcon,
  PrinterIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  ListIcon,
  ListOrderedIcon,
  ImageIcon,
  TableIcon,
  TypeIcon,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { toast } from "sonner"

type DocumentTemplate = {
  id: string
  name: string
  category: string
  content: string
}

type CustomDocument = {
  id: string
  name: string
  templateId: string
  content: string
  leadId?: string
  createdAt: string
  updatedAt: string
}

type Lead = {
  id: string
  origem?: string
  name: string
  email: string
  phone: string
  status: "novo" | "qualificado" | "negociacao" | "fechado" | "perdido"
  createdAt: string
}

type TableEditorKind = "document" | "template"

const STORAGE_KEY = "crm_documentos"
const TEMPLATES_STORAGE_KEY = "crm_templates"

const DEFAULT_TEMPLATES: DocumentTemplate[] = [
  {
    id: "contrato-compra-venda",
    name: "Contrato de Compra e Venda",
    category: "Contratos",
    content: `CONTRATO DE COMPRA E VENDA DE IMÓVEL

Pelo presente instrumento particular de contrato de compra e venda, de um lado:

VENDEDOR(A): [Nome completo], nacionalidade [nacionalidade], estado civil [estado civil], profissão [profissão], portador(a) do CPF nº [CPF], residente e domiciliado(a) na [endereço completo].

E de outro lado:

COMPRADOR(A): [Nome completo], nacionalidade [nacionalidade], estado civil [estado civil], profissão [profissão], portador(a) do CPF nº [CPF], residente e domiciliado(a) na [endereço completo].

OBJETO: O VENDEDOR vende ao COMPRADOR o imóvel localizado em [endereço completo do imóvel], com as seguintes características:
- Área total: [área] m²
- Matrícula nº [número] do Cartório de Registro de Imóveis de [cidade]

VALOR: O valor total do imóvel é de R$ [valor por extenso] ([valor numérico]), que será pago da seguinte forma:
[Forma de pagamento detalhada]

PRAZO: O prazo para quitação total é de [prazo].

ENTREGA: A entrega das chaves será realizada em [data].

[Cidade], [data]

_________________________          _________________________
    VENDEDOR(A)                        COMPRADOR(A)

Testemunhas:
1. _________________________
   Nome: 
   CPF:

2. _________________________
   Nome:
   CPF:`
  },
  {
    id: "procuracao-compra-venda",
    name: "Procuração para Compra e Venda",
    category: "Procurações",
    content: `PROCURAÇÃO

OUTORGANTE: [Nome completo], nacionalidade [nacionalidade], estado civil [estado civil], profissão [profissão], portador(a) do CPF nº [CPF] e RG nº [RG], residente e domiciliado(a) na [endereço completo].

OUTORGADO: [Nome completo], nacionalidade [nacionalidade], estado civil [estado civil], profissão [profissão], portador(a) do CPF nº [CPF] e RG nº [RG], residente e domiciliado(a) na [endereço completo].

PODERES: Pelo presente instrumento, o OUTORGANTE nomeia e constitui seu bastante procurador o OUTORGADO, a quem confere amplos poderes para:

1. Representá-lo(a) perante qualquer repartição pública ou privada;
2. Assinar contratos de compra e venda de imóveis;
3. Receber e dar quitação;
4. Representá-lo(a) em cartórios e órgãos públicos;
5. Praticar todos os atos necessários ao fiel cumprimento deste mandato.

PRAZO: Esta procuração tem validade de [prazo].

[Cidade], [data]

_________________________
OUTORGANTE

Testemunhas:
1. _________________________
   Nome:
   CPF:

2. _________________________
   Nome:
   CPF:`
  },
  {
    id: "distrato",
    name: "Distrato de Compra e Venda",
    category: "Contratos",
    content: `DISTRATO DE CONTRATO DE COMPRA E VENDA

Pelo presente instrumento particular de distrato, de um lado:

PARTE 1: [Nome completo], já qualificado(a) no contrato original.

PARTE 2: [Nome completo], já qualificado(a) no contrato original.

Considerando que as partes celebraram em [data] o Contrato de Compra e Venda do imóvel localizado em [endereço];

Considerando o interesse mútuo em rescindir o referido contrato;

As partes têm, entre si, justo e contratado o seguinte:

CLÁUSULA PRIMEIRA - DO DISTRATO
Fica rescindido, de comum acordo, o Contrato de Compra e Venda celebrado em [data], referente ao imóvel mencionado.

CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES
As partes comprometem-se a:
- [Obrigação 1]
- [Obrigação 2]
- [Obrigação 3]

CLÁUSULA TERCEIRA - DOS VALORES
[Detalhamento de valores a serem devolvidos ou retidos]

CLÁUSULA QUARTA - DA QUITAÇÃO
As partes dão-se recíproca e plena quitação, nada mais tendo a reclamar uma da outra.

[Cidade], [data]

_________________________          _________________________
      PARTE 1                            PARTE 2`
  },
  {
    id: "recibo-entrada",
    name: "Recibo de Entrada/Sinal",
    category: "Recibos",
    content: `RECIBO DE ENTRADA/SINAL

Valor: R$ [valor por extenso] ([valor numérico])

Recebi de [Nome do pagador], portador(a) do CPF nº [CPF], a quantia acima especificada, referente à entrada/sinal para aquisição do imóvel localizado em [endereço completo do imóvel].

Valor total do imóvel: R$ [valor total]
Valor pago nesta data: R$ [valor pago]
Saldo devedor: R$ [saldo]

Forma de pagamento: [Forma de pagamento - dinheiro, PIX, transferência, cheque, etc.]

Este valor será abatido do preço total do imóvel conforme Contrato de Compra e Venda a ser firmado.

Observações: [Observações adicionais]

[Cidade], [data]

_________________________
Assinatura do Recebedor
Nome:
CPF:`
  },
  {
    id: "declaracao-renda",
    name: "Declaração de Renda",
    category: "Declarações",
    content: `DECLARAÇÃO DE RENDA

Eu, [Nome completo], nacionalidade [nacionalidade], estado civil [estado civil], profissão [profissão], portador(a) do CPF nº [CPF] e RG nº [RG], residente e domiciliado(a) na [endereço completo], DECLARO para os devidos fins que:

Possuo renda mensal de R$ [valor por extenso] ([valor numérico]), proveniente de [origem da renda - salário, atividade autônoma, aposentadoria, etc.].

Empresa/Instituição: [Nome da empresa ou N/A]
Cargo/Função: [Cargo ou N/A]
Tempo de serviço: [Tempo ou N/A]

COMPOSIÇÃO DA RENDA:
- Renda principal: R$ [valor]
- Outras rendas: R$ [valor]
- Renda total: R$ [valor]

Declaro ainda que as informações acima prestadas são verdadeiras, podendo ser comprovadas mediante apresentação de documentos, estando ciente das penalidades legais cabíveis no caso de informações falsas.

Por ser a expressão da verdade, firmo a presente declaração.

[Cidade], [data]

_________________________
Declarante`
  },
  {
    id: "autorizacao-consulta",
    name: "Autorização para Consulta",
    category: "Autorizações",
    content: `AUTORIZAÇÃO PARA CONSULTA DE DADOS

Eu, [Nome completo], nacionalidade [nacionalidade], estado civil [estado civil], profissão [profissão], portador(a) do CPF nº [CPF] e RG nº [RG], residente e domiciliado(a) na [endereço completo], AUTORIZO:

[Nome da empresa/corretor], inscrito no CPF/CNPJ sob o nº [número], a realizar consultas junto aos órgãos de proteção ao crédito e demais instituições financeiras, para fins de análise de crédito relacionada à aquisição do imóvel localizado em [endereço do imóvel].

A presente autorização tem validade de [prazo] dias, a contar desta data.

Autorizo também o compartilhamento dos dados coletados com instituições financeiras para fins de análise de financiamento imobiliário.

[Cidade], [data]

_________________________
Autorizante
Nome:
CPF:`
  },
]

export default function DocumentosPage() {
  const [templates, setTemplates] = React.useState<DocumentTemplate[]>([])
  const [customDocuments, setCustomDocuments] = React.useState<CustomDocument[]>([])
  const [leads, setLeads] = React.useState<Lead[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>("")
  const [selectedDocumentId, setSelectedDocumentId] = React.useState<string | null>(null)
  const [selectedLeadId, setSelectedLeadId] = React.useState<string>("")
  const [filterLeadId, setFilterLeadId] = React.useState<string>("")
  const [filterSearchLeadTerm, setFilterSearchLeadTerm] = React.useState<string>("")
  const [showFilterLeadDropdown, setShowFilterLeadDropdown] = React.useState(false)
  const filterLeadSearchRef = React.useRef<HTMLDivElement>(null)
  const [documentName, setDocumentName] = React.useState("")
  const [editorContent, setEditorContent] = React.useState("")
  const [filterCategory, setFilterCategory] = React.useState<string>("all")
  const [fontSize, setFontSize] = React.useState("13pt")
  const editorRef = React.useRef<HTMLDivElement>(null)
  const [showNewTemplateDialog, setShowNewTemplateDialog] = React.useState(false)
  const [editingTemplateId, setEditingTemplateId] = React.useState<string | null>(null)
  const [newTemplateName, setNewTemplateName] = React.useState("")
  const [newTemplateCategory, setNewTemplateCategory] = React.useState("")
  const [newTemplateContent, setNewTemplateContent] = React.useState("")
  const [templateEditorFontSize, setTemplateEditorFontSize] = React.useState("12pt")
  const templateEditorRef = React.useRef<HTMLDivElement>(null)
  const editorSelectionRef = React.useRef<Range | null>(null)
  const templateSelectionRef = React.useRef<Range | null>(null)
  const editorImageInputRef = React.useRef<HTMLInputElement>(null)
  const templateImageInputRef = React.useRef<HTMLInputElement>(null)
  const activeTableCellRef = React.useRef<HTMLTableCellElement | null>(null)
  const activeTableEditorRef = React.useRef<HTMLDivElement | null>(null)
  const [tableUi, setTableUi] = React.useState<{
    editorKind: TableEditorKind
    left: number
    top: number
    width: number
    height: number
  } | null>(null)
  const [showNewLeadDialog, setShowNewLeadDialog] = React.useState(false)
  const [newLeadOrigem, setNewLeadOrigem] = React.useState("")
  const [newLeadName, setNewLeadName] = React.useState("")
  const [newLeadEmail, setNewLeadEmail] = React.useState("")
  const [newLeadPhone, setNewLeadPhone] = React.useState("")
  const [searchLeadTerm, setSearchLeadTerm] = React.useState("")
  const [showLeadDropdown, setShowLeadDropdown] = React.useState(false)
  const leadSearchRef = React.useRef<HTMLDivElement>(null)

  const fetchLeads = React.useCallback(async () => {
    try {
      const response = await fetch("/api/leads", { cache: "no-store" })
      if (!response.ok) throw new Error("Erro ao carregar leads")
      const data = await response.json()
      setLeads(data)
    } catch (error) {
      console.error("Erro ao carregar leads:", error)
    }
  }, [])

  const categories = ["all", ...Array.from(new Set(templates.map(t => t.category)))]

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // Carregar templates
      const storedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY)
      if (storedTemplates) {
        setTemplates(JSON.parse(storedTemplates))
      } else {
        setTemplates(DEFAULT_TEMPLATES)
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(DEFAULT_TEMPLATES))
      }
      
      // Carregar documentos
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setCustomDocuments(JSON.parse(stored))
      }
    }
    fetchLeads()
  }, [fetchLeads])

  React.useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    
    // Atualizar o conteúdo do editor quando editorContent mudar
    // Mas apenas se o editor não estiver focado (para evitar interferir na digitação)
    if (document.activeElement !== editor) {
      // Se o conteúdo está vazio, limpar completamente o editor
      if (!editorContent || editorContent.trim() === '' || editorContent === '<br>') {
        editor.innerHTML = ''
      } else if (editor.innerHTML !== editorContent) {
        editor.innerHTML = editorContent
      }
    }
  }, [editorContent])

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplateId(templateId)
      setSelectedDocumentId(null)
      setDocumentName(`${template.name} - ${new Date().toLocaleDateString()}`)
      setEditorContent(template.content)
    }
  }

  const handleDocumentSelect = (documentId: string) => {
    const doc = customDocuments.find(d => d.id === documentId)
    if (doc) {
      setSelectedDocumentId(documentId)
      setSelectedTemplateId(doc.templateId)
      setSelectedLeadId(doc.leadId || "")
      setDocumentName(doc.name)
      setEditorContent(doc.content)
    }
  }

  const handleSaveDocument = () => {
    const editor = editorRef.current
    const textContent = editor ? (editor.innerText || editor.textContent || '').trim() : editorContent.trim()
    
    if (!documentName.trim() || !textContent) {
      alert("Por favor, preencha o nome e o conteúdo do documento")
      return
    }

    if (!selectedLeadId) {
      alert("Por favor, selecione um lead antes de salvar o documento")
      return
    }

    const now = new Date().toISOString()
    
    if (selectedDocumentId) {
      // Atualizar documento existente
      const updated = customDocuments.map(doc =>
        doc.id === selectedDocumentId
          ? { ...doc, name: documentName, content: editorContent, leadId: selectedLeadId, updatedAt: now }
          : doc
      )
      setCustomDocuments(updated)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } else {
      // Criar novo documento
      const newDoc: CustomDocument = {
        id: String(Date.now()),
        name: documentName,
        templateId: selectedTemplateId,
        content: editorContent,
        leadId: selectedLeadId,
        createdAt: now,
        updatedAt: now,
      }
      const updated = [newDoc, ...customDocuments]
      setCustomDocuments(updated)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setSelectedDocumentId(newDoc.id)
    }
    
    toast.success("Documento salvo com sucesso!")
  }

  const handleNewDocument = () => {
    setSelectedTemplateId("")
    setSelectedDocumentId(null)
    setSelectedLeadId("")
    setDocumentName("")
    setEditorContent("")
    
    // Limpar o editor diretamente
    if (editorRef.current) {
      editorRef.current.innerHTML = ""
    }
  }

  const handleDeleteDocument = (id: string) => {
    const updated = customDocuments.filter(doc => doc.id !== id)
    setCustomDocuments(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    
    if (selectedDocumentId === id) {
      handleNewDocument()
    }
  }

  const handleDeleteTemplate = (id: string) => {
    const updated = templates.filter(template => template.id !== id)
    setTemplates(updated)
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updated))
    
    if (selectedTemplateId === id && !selectedDocumentId) {
      handleNewDocument()
    }
  }

  const openCreateTemplateDialog = () => {
    setEditingTemplateId(null)
    setNewTemplateName("")
    setNewTemplateCategory("")
    setNewTemplateContent("")
    setTemplateEditorFontSize("12pt")
    setShowNewTemplateDialog(true)
    window.setTimeout(() => {
      if (templateEditorRef.current) {
        templateEditorRef.current.innerHTML = ""
      }
    }, 0)
  }

  const handleEditTemplate = (template: DocumentTemplate) => {
    setEditingTemplateId(template.id)
    setNewTemplateName(template.name)
    setNewTemplateCategory(template.category)
    setNewTemplateContent(template.content)
    setTemplateEditorFontSize("12pt")
    setShowNewTemplateDialog(true)
    window.setTimeout(() => {
      if (templateEditorRef.current) {
        templateEditorRef.current.innerHTML = template.content
      }
    }, 0)
  }

  const runEditorCommand = (
    editor: HTMLDivElement | null,
    selectionRef: React.MutableRefObject<Range | null>,
    command: string,
    setContent: (value: string) => void
  ) => {
    if (!editor) return
    if (!ensureEditorSelection(editor, selectionRef)) return
    document.execCommand(command, false)
    setContent(editor.innerHTML)
    saveSelection(editor, selectionRef)
  }

  const insertImageAtSelection = (
    editor: HTMLDivElement | null,
    selectionRef: React.MutableRefObject<Range | null>,
    setContent: (value: string) => void,
    imageSource: string,
    altText: string
  ) => {
    if (!editor) return
    if (!ensureEditorSelection(editor, selectionRef)) return

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    const range = selection.getRangeAt(0)

    const image = document.createElement("img")
    image.src = imageSource
    image.alt = altText || "Imagem"
    image.style.maxWidth = "100%"
    image.style.height = "auto"
    image.style.display = "block"
    image.style.margin = "8px 0"

    range.deleteContents()
    range.insertNode(image)

    const spacer = document.createElement("p")
    spacer.innerHTML = "<br>"
    image.after(spacer)

    const newRange = document.createRange()
    newRange.setStart(spacer, 0)
    newRange.collapse(true)
    selection.removeAllRanges()
    selection.addRange(newRange)

    setContent(editor.innerHTML)
    saveSelection(editor, selectionRef)
  }

  const handleInsertImageFromFile = async (
    file: File,
    editorKind: TableEditorKind
  ) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem válido.")
      return
    }

    const toDataUrl = () =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result || ""))
        reader.onerror = () => reject(new Error("Falha ao ler imagem"))
        reader.readAsDataURL(file)
      })

    try {
      const dataUrl = await toDataUrl()
      if (editorKind === "document") {
        insertImageAtSelection(editorRef.current, editorSelectionRef, setEditorContent, dataUrl, file.name)
      } else {
        insertImageAtSelection(templateEditorRef.current, templateSelectionRef, setNewTemplateContent, dataUrl, file.name)
      }
    } catch {
      toast.error("Não foi possível inserir a imagem.")
    }
  }

  const applyTemplateFormat = (command: string) => {
    const editor = templateEditorRef.current
    if (!editor) return

    if (command === "bold") runEditorCommand(editor, templateSelectionRef, "bold", setNewTemplateContent)
    else if (command === "italic") runEditorCommand(editor, templateSelectionRef, "italic", setNewTemplateContent)
    else if (command === "underline") runEditorCommand(editor, templateSelectionRef, "underline", setNewTemplateContent)
    else if (command === "alignLeft") runEditorCommand(editor, templateSelectionRef, "justifyLeft", setNewTemplateContent)
    else if (command === "alignCenter") runEditorCommand(editor, templateSelectionRef, "justifyCenter", setNewTemplateContent)
    else if (command === "alignRight") runEditorCommand(editor, templateSelectionRef, "justifyRight", setNewTemplateContent)
    else if (command === "list") runEditorCommand(editor, templateSelectionRef, "insertUnorderedList", setNewTemplateContent)
    else if (command === "orderedList") runEditorCommand(editor, templateSelectionRef, "insertOrderedList", setNewTemplateContent)
    else if (command === "table") {
      const config = getTableConfig()
      if (!config) return
      insertTableAtSelection(editor, templateSelectionRef, setNewTemplateContent, config)
    }
  }

  const handleCreateTemplate = () => {
    const textContent = templateEditorRef.current ? (templateEditorRef.current.innerText || templateEditorRef.current.textContent || '').trim() : newTemplateContent.trim()
    
    if (!newTemplateName.trim() || !newTemplateCategory.trim() || !textContent) {
      alert("Por favor, preencha todos os campos do modelo")
      return
    }

    const templateContent = templateEditorRef.current?.innerHTML || newTemplateContent

    if (editingTemplateId) {
      const updated = templates.map((template) =>
        template.id === editingTemplateId
          ? {
              ...template,
              name: newTemplateName,
              category: newTemplateCategory,
              content: templateContent,
            }
          : template
      )
      setTemplates(updated)
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updated))
      toast.success("Modelo atualizado com sucesso!")
    } else {
      const newTemplate: DocumentTemplate = {
        id: String(Date.now()),
        name: newTemplateName,
        category: newTemplateCategory,
        content: templateContent,
      }

      const updated = [...templates, newTemplate]
      setTemplates(updated)
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updated))
      handleTemplateSelect(newTemplate.id)
      toast.success("Modelo criado com sucesso!")
    }

    // Limpar formulário e fechar diálogo
    setEditingTemplateId(null)
    setNewTemplateName("")
    setNewTemplateCategory("")
    setNewTemplateContent("")
    if (templateEditorRef.current) {
      templateEditorRef.current.innerHTML = ""
    }
    setTemplateEditorFontSize("12pt")
    setShowNewTemplateDialog(false)
  }

  const applyTemplateFont = (size: string) => {
    setTemplateEditorFontSize(size)
    document.execCommand("fontSize", false, "7")
    const elements = templateEditorRef.current?.querySelectorAll("font[size='7']")
    elements?.forEach(el => {
      el.removeAttribute("size")
      ;(el as HTMLElement).style.fontSize = size
    })
    templateEditorRef.current?.focus()
  }

  const handleCreateLead = async () => {
    if (!newLeadName.trim() || !newLeadEmail.trim() || !newLeadPhone.trim()) {
      alert("Por favor, preencha todos os campos do lead")
      return
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origem: newLeadOrigem.trim(),
          name: newLeadName,
          email: newLeadEmail,
          phone: newLeadPhone,
          status: "novo",
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar lead")
      }

      const newLead: Lead = await response.json()
      setLeads((prev) => [newLead, ...prev.filter((lead) => lead.id !== newLead.id)])

    // Limpar formulário e fechar diálogo
      setNewLeadOrigem("")
      setNewLeadName("")
      setNewLeadEmail("")
      setNewLeadPhone("")
      setShowNewLeadDialog(false)

      setSelectedLeadId(newLead.id)
    } catch (error) {
      console.error("Erro ao criar lead:", error)
      alert("Erro ao criar lead no Supabase.")
    }
  }

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchLeadTerm.toLowerCase())
  )

  const filteredLeadsForDisplay = leads.filter(lead =>
    lead.name.toLowerCase().includes(filterSearchLeadTerm.toLowerCase())
  )

  const selectedLead = leads.find(l => l.id === selectedLeadId)
  const filterSelectedLead = leads.find(l => l.id === filterLeadId)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (leadSearchRef.current && !leadSearchRef.current.contains(event.target as Node)) {
        setShowLeadDropdown(false)
      }
    }

    if (showLeadDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLeadDropdown])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterLeadSearchRef.current && !filterLeadSearchRef.current.contains(event.target as Node)) {
        setShowFilterLeadDropdown(false)
      }
    }

    if (showFilterLeadDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showFilterLeadDropdown])

  const handleCopyToClipboard = () => {
    const editor = editorRef.current
    if (!editor) return
    
    const text = editor.innerText || editor.textContent || ""
    navigator.clipboard.writeText(text)
    alert("Conteúdo copiado para a área de transferência!")
  }

  const saveSelection = (editor: HTMLDivElement | null, targetRef: React.MutableRefObject<Range | null>) => {
    if (!editor) return
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    const range = selection.getRangeAt(0)
    if (!editor.contains(range.commonAncestorContainer)) return
    targetRef.current = range.cloneRange()
  }

  const ensureEditorSelection = (
    editor: HTMLDivElement | null,
    targetRef: React.MutableRefObject<Range | null>
  ) => {
    if (!editor) return false
    editor.focus()

    const selection = window.getSelection()
    if (!selection) return false

    if (targetRef.current) {
      selection.removeAllRanges()
      selection.addRange(targetRef.current)
      return true
    }

    const range = document.createRange()
    range.selectNodeContents(editor)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
    targetRef.current = range.cloneRange()
    return true
  }

  const insertTableAtSelection = (
    editor: HTMLDivElement | null,
    targetRef: React.MutableRefObject<Range | null>,
    setContent: (value: string) => void,
    config: { rows: number; columns: number; cellWidth: string }
  ) => {
    if (!editor) return
    if (!ensureEditorSelection(editor, targetRef)) return

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    const range = selection.getRangeAt(0)

    const rowsHtml = Array.from({ length: config.rows })
      .map((_, rowIndex) => {
        const cols = Array.from({ length: config.columns })
          .map((__, colIndex) => {
            const label = rowIndex === 0 ? `Cabeçalho ${colIndex + 1}` : `Linha ${rowIndex + 1} - Coluna ${colIndex + 1}`
            return `<td style="border:1px solid #d4d4d8; padding:8px; width:${config.cellWidth};">${label}</td>`
          })
          .join("")
        return `<tr>${cols}</tr>`
      })
      .join("")

    const template = document.createElement("template")
    template.innerHTML = `
      <table style="width:100%; border-collapse:collapse; margin:8px 0; table-layout:fixed;">
        <tbody>${rowsHtml}</tbody>
      </table>
      <p><br></p>
    `

    const fragment = template.content.cloneNode(true) as DocumentFragment
    range.deleteContents()
    range.insertNode(fragment)
    setContent(editor.innerHTML)

    const finalRange = document.createRange()
    finalRange.selectNodeContents(editor)
    finalRange.collapse(false)
    selection.removeAllRanges()
    selection.addRange(finalRange)
    targetRef.current = finalRange.cloneRange()
  }

  const getTableConfig = () => {
    const rowsInput = window.prompt("Quantidade de linhas da tabela:", "2")
    if (!rowsInput) return null
    const columnsInput = window.prompt("Quantidade de colunas da tabela:", "2")
    if (!columnsInput) return null
    const cellWidthInput = window.prompt("Largura das células (ex: 180px ou 25%):", "180px")
    if (!cellWidthInput) return null

    const rows = Number.parseInt(rowsInput, 10)
    const columns = Number.parseInt(columnsInput, 10)
    const cellWidth = cellWidthInput.trim()

    if (!Number.isFinite(rows) || rows < 1 || rows > 20) {
      toast.error("Linhas inválidas. Use um número entre 1 e 20.")
      return null
    }

    if (!Number.isFinite(columns) || columns < 1 || columns > 12) {
      toast.error("Colunas inválidas. Use um número entre 1 e 12.")
      return null
    }

    if (!/(px|%)$/.test(cellWidth)) {
      toast.error("Largura inválida. Use valor terminado em px ou %.")
      return null
    }

    return { rows, columns, cellWidth }
  }

  const syncEditorContent = (editor: HTMLDivElement | null) => {
    if (!editor) return
    if (editor === editorRef.current) {
      setEditorContent(editor.innerHTML)
      saveSelection(editor, editorSelectionRef)
    } else if (editor === templateEditorRef.current) {
      setNewTemplateContent(editor.innerHTML)
      saveSelection(editor, templateSelectionRef)
    }
  }

  const clearTableUi = React.useCallback(() => {
    activeTableCellRef.current = null
    activeTableEditorRef.current = null
    setTableUi(null)
  }, [])

  const updateTableUiPosition = React.useCallback(() => {
    const cell = activeTableCellRef.current
    setTableUi((prev) => {
      if (!cell || !prev) return null
      const rect = cell.getBoundingClientRect()
      return {
        ...prev,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      }
    })
  }, [])

  const activateTableCell = (
    cell: HTMLTableCellElement,
    editorKind: TableEditorKind,
    editor: HTMLDivElement
  ) => {
    activeTableCellRef.current = cell
    activeTableEditorRef.current = editor
    const rect = cell.getBoundingClientRect()
    setTableUi({
      editorKind,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    })
  }

  const handleTableCellSelection = (
    target: EventTarget | null,
    editorKind: TableEditorKind,
    editor: HTMLDivElement | null
  ) => {
    if (!editor || !(target instanceof HTMLElement)) return
    const cell = target.closest("td,th") as HTMLTableCellElement | null
    if (!cell || !editor.contains(cell)) {
      clearTableUi()
      return
    }
    activateTableCell(cell, editorKind, editor)
  }

  const addTableRow = () => {
    const cell = activeTableCellRef.current
    const editor = activeTableEditorRef.current
    if (!cell || !editor) return

    const row = cell.parentElement as HTMLTableRowElement | null
    const table = cell.closest("table")
    if (!row || !table) return

    const rowIndex = row.rowIndex
    const newRow = table.insertRow(rowIndex + 1)
    const totalColumns = row.cells.length

    for (let index = 0; index < totalColumns; index++) {
      const sourceCell = row.cells[index] as HTMLTableCellElement | undefined
      const newCell = newRow.insertCell(index)
      newCell.innerHTML = `Nova célula ${index + 1}`
      newCell.style.border = sourceCell?.style.border || "1px solid #d4d4d8"
      newCell.style.padding = sourceCell?.style.padding || "8px"
      if (sourceCell?.style.width) newCell.style.width = sourceCell.style.width
      if (sourceCell?.style.height) newCell.style.height = sourceCell.style.height
    }

    syncEditorContent(editor)
    activateTableCell(newRow.cells[0] as HTMLTableCellElement, tableUi?.editorKind || "document", editor)
  }

  const addTableColumn = () => {
    const cell = activeTableCellRef.current
    const editor = activeTableEditorRef.current
    if (!cell || !editor) return

    const table = cell.closest("table") as HTMLTableElement | null
    const row = cell.parentElement as HTMLTableRowElement | null
    if (!table || !row) return

    const columnIndex = Array.from(row.cells).indexOf(cell)
    if (columnIndex < 0) return

    Array.from(table.rows).forEach((tableRow) => {
      const sourceCell = tableRow.cells[columnIndex] as HTMLTableCellElement | undefined
      const inserted = tableRow.insertCell(columnIndex + 1)
      inserted.innerHTML = "Nova coluna"
      inserted.style.border = sourceCell?.style.border || "1px solid #d4d4d8"
      inserted.style.padding = sourceCell?.style.padding || "8px"
      if (sourceCell?.style.width) inserted.style.width = sourceCell.style.width
      if (sourceCell?.style.height) inserted.style.height = sourceCell.style.height
    })

    syncEditorContent(editor)
    const currentRow = table.rows[row.rowIndex]
    const insertedCell = currentRow?.cells[columnIndex + 1] as HTMLTableCellElement | undefined
    if (insertedCell) {
      activateTableCell(insertedCell, tableUi?.editorKind || "document", editor)
    }
  }

  const startResize = (axis: "width" | "height", event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const cell = activeTableCellRef.current
    const editor = activeTableEditorRef.current
    if (!cell || !editor) return

    const row = cell.parentElement as HTMLTableRowElement | null
    const table = cell.closest("table") as HTMLTableElement | null
    if (!row || !table) return

    const startX = event.clientX
    const startY = event.clientY
    const rowIndex = row.rowIndex
    const columnIndex = Array.from(row.cells).indexOf(cell)

    const columnCells = Array.from(table.rows)
      .map((tableRow) => tableRow.cells[columnIndex] as HTMLTableCellElement | undefined)
      .filter((item): item is HTMLTableCellElement => Boolean(item))

    const baseWidths = columnCells.map((tableCell) => tableCell.getBoundingClientRect().width)
    const rowCells = Array.from(row.cells) as HTMLTableCellElement[]
    const baseHeights = rowCells.map((tableCell) => tableCell.getBoundingClientRect().height)

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (axis === "width") {
        const deltaX = moveEvent.clientX - startX
        columnCells.forEach((tableCell, index) => {
          const nextWidth = Math.max(80, baseWidths[index] + deltaX)
          tableCell.style.width = `${nextWidth}px`
        })
      } else {
        const deltaY = moveEvent.clientY - startY
        const currentRow = table.rows[rowIndex]
        if (!currentRow) return
        Array.from(currentRow.cells).forEach((tableCell, index) => {
          const nextHeight = Math.max(36, baseHeights[index] + deltaY)
          ;(tableCell as HTMLTableCellElement).style.height = `${nextHeight}px`
        })
      }
      updateTableUiPosition()
    }

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      syncEditorContent(editor)
      updateTableUiPosition()
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  React.useEffect(() => {
    if (!tableUi) return
    const onWindowUpdate = () => updateTableUiPosition()
    window.addEventListener("resize", onWindowUpdate)
    window.addEventListener("scroll", onWindowUpdate, true)
    return () => {
      window.removeEventListener("resize", onWindowUpdate)
      window.removeEventListener("scroll", onWindowUpdate, true)
    }
  }, [tableUi, updateTableUiPosition])

  React.useEffect(() => {
    const onDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return
      if (target.closest("[data-table-tools='true']")) return
      if (target.closest("td") || target.closest("th")) return
      clearTableUi()
    }

    document.addEventListener("mousedown", onDocumentMouseDown)
    return () => document.removeEventListener("mousedown", onDocumentMouseDown)
  }, [clearTableUi])

  const applyFormat = (formatType: string) => {
    const editor = editorRef.current
    if (!editor) return

    switch (formatType) {
      case "bold":
        runEditorCommand(editor, editorSelectionRef, "bold", setEditorContent)
        break
      case "italic":
        runEditorCommand(editor, editorSelectionRef, "italic", setEditorContent)
        break
      case "underline":
        runEditorCommand(editor, editorSelectionRef, "underline", setEditorContent)
        break
      case "alignLeft":
        runEditorCommand(editor, editorSelectionRef, "justifyLeft", setEditorContent)
        break
      case "alignCenter":
        runEditorCommand(editor, editorSelectionRef, "justifyCenter", setEditorContent)
        break
      case "alignRight":
        runEditorCommand(editor, editorSelectionRef, "justifyRight", setEditorContent)
        break
      case "list":
        runEditorCommand(editor, editorSelectionRef, "insertUnorderedList", setEditorContent)
        break
      case "orderedList":
        runEditorCommand(editor, editorSelectionRef, "insertOrderedList", setEditorContent)
        break
      case "table":
        {
          const config = getTableConfig()
          if (!config) return
          insertTableAtSelection(editor, editorSelectionRef, setEditorContent, config)
        }
        break
    }
  }

  const applyFontSize = (size: string) => {
    const editor = editorRef.current
    if (!editor) return

    setFontSize(size)
    editor.focus()

    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      document.execCommand("fontSize", false, "7")
      
      // Substituir o font tag por span com estilo
      const fontElements = editor.querySelectorAll('font[size="7"]')
      fontElements.forEach(el => {
        const span = document.createElement('span')
        span.style.fontSize = size
        span.innerHTML = el.innerHTML
        el.replaceWith(span)
      })
      
      setEditorContent(editor.innerHTML)
    }
  }

  const handlePrint = () => {
    // Criar um iframe oculto para impressão
    const iframe = document.createElement('iframe')
    iframe.style.position = 'absolute'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = 'none'
    
    document.body.appendChild(iframe)
    
    const iframeDoc = iframe.contentWindow?.document
    if (iframeDoc) {
      iframeDoc.open()
      iframeDoc.write(`
        <html>
          <head>
            <title>${documentName || 'Documento'}</title>
            <style>
              @page { margin: 2cm; }
              body {
                font-family: 'Times New Roman', Times, serif;
                font-size: 12pt;
                line-height: 1.6;
                color: #000;
                white-space: pre-wrap;
                max-width: 21cm;
                margin: 0 auto;
              }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>${editorContent}</body>
        </html>
      `)
      iframeDoc.close()
      
      // Aguardar o carregamento e imprimir
      iframe.contentWindow?.focus()
      setTimeout(() => {
        iframe.contentWindow?.print()
        // Remover o iframe após a impressão
        setTimeout(() => {
          document.body.removeChild(iframe)
        }, 100)
      }, 250)
    }
  }

  const handleDownload = (format: 'txt' | 'doc' | 'pdf') => {
    const fileName = documentName || 'documento'
    
    if (format === 'txt') {
      // Extrair texto sem formatação
      const editor = editorRef.current
      const textContent = editor ? (editor.innerText || editor.textContent || '') : editorContent
      const blob = new Blob([textContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fileName}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else if (format === 'doc') {
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${fileName}</title></head><body>"
      const footer = "</body></html>"
      const sourceHTML = header + editorContent + footer
      const blob = new Blob([sourceHTML], { type: 'application/msword' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fileName}.doc`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else if (format === 'pdf') {
      // Para PDF, abre janela de impressão configurada para salvar como PDF
      alert('Use o botão Imprimir e selecione "Salvar como PDF" nas opções da impressora.')
      handlePrint()
    }
  }

  const filteredTemplates = filterCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === filterCategory)

  return (
    <div className="flex h-full flex-col gap-4 lg:flex-row">
      {/* Sidebar - Modelos e Documentos */}
      <aside className="w-full lg:w-100 min-w-0">
        <Card className="h-full min-w-[350px] max-w-[480px]">
          <CardHeader>
            <CardTitle className="text-base">Modelos e Documentos</CardTitle>
            <CardDescription className="text-xs">
              Selecione um modelo ou documento salvo
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 overflow-hidden">
            <Tabs defaultValue="modelos" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="modelos">Modelos</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
              </TabsList>
              
              <Button onClick={handleNewDocument} variant="outline" className="w-full my-4">
                <PlusIcon className="size-4 mr-2" />
                Novo Documento
              </Button>
              
              <TabsContent value="modelos" className="space-y-4 min-h-[550px] max-h-[550px] overflow-y-auto">
            {/* Filtro por categoria */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs">Categoria</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger id="category" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.filter(c => c !== "all").map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

                {/* Modelos */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-muted-foreground">Lista de Modelos</div>
                    <Button
                      size="icon"
                      className="h-6 w-6"
                      onClick={openCreateTemplateDialog}
                      title="Adicionar novo modelo"
                    >
                      <PlusIcon className="size-3.5" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                {filteredTemplates.map(template => (
                  <div
                    key={template.id}
                    className={`rounded-md border p-2.5 transition-colors ${
                      selectedTemplateId === template.id && !selectedDocumentId
                        ? "border-primary bg-muted"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => handleTemplateSelect(template.id)}
                        className="flex items-start gap-2 flex-1 min-w-0 text-left"
                      >
                        <FileTextIcon className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{template.name}</div>
                          <div className="text-xs text-muted-foreground">{template.category}</div>
                        </div>
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-muted-foreground"
                        onClick={() => handleEditTemplate(template)}
                        title="Editar modelo"
                      >
                        <PencilIcon className="size-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2Icon className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir modelo?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o modelo "{template.name}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTemplate(template.id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </div>
              </TabsContent>
              
              <TabsContent value="documentos" className="space-y-4 min-h-[550px] max-h-[550px] overflow-y-auto">
            {/* Filtro de Lead */}
            <div className="space-y-2">
              <Label htmlFor="filter-lead" className="text-xs">Filtrar por Lead</Label>
              <div ref={filterLeadSearchRef} className="relative">
                {filterSelectedLead ? (
                  <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-3 py-1.5 rounded-full">
                    <span className="text-sm font-medium">{filterSelectedLead.name}</span>
                    <button 
                      onClick={() => {
                        setFilterLeadId("")
                        setFilterSearchLeadTerm("")
                        setShowFilterLeadDropdown(false)
                      }}
                      className="text-lg leading-none opacity-70 hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <Input
                      id="filter-lead"
                      placeholder="Buscar lead..."
                      value={filterSearchLeadTerm}
                      onChange={(e) => {
                        setFilterSearchLeadTerm(e.target.value)
                        setShowFilterLeadDropdown(true)
                      }}
                      onFocus={() => setShowFilterLeadDropdown(true)}
                      className="h-9"
                    />
                    {showFilterLeadDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-md max-h-48 overflow-y-auto z-50">
                        {filteredLeadsForDisplay.length === 0 ? (
                          <div className="p-2 text-sm text-center text-muted-foreground">Nenhum lead encontrado</div>
                        ) : (
                          filteredLeadsForDisplay.map(lead => (
                            <button
                              key={lead.id}
                              onClick={() => {
                                setFilterLeadId(lead.id)
                                setFilterSearchLeadTerm("")
                                setShowFilterLeadDropdown(false)
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
                  </>
                )}
              </div>
            </div>

            {/* Documentos Salvos */}
              <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground">Lista de Documentos</div>
                  <div className="space-y-1">
                    {customDocuments.length === 0 ? (
                      <div className="text-center py-8 text-sm text-muted-foreground">
                        Nenhum documento salvo ainda
                      </div>
                    ) : (
                      customDocuments
                        .filter(doc => !filterLeadId || doc.leadId === filterLeadId)
                        .map(doc => (
                    <div
                      key={doc.id}
                      className={`rounded-md border p-2.5 transition-colors ${
                        selectedDocumentId === doc.id
                          ? "border-primary bg-muted"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => handleDocumentSelect(doc.id)}
                          className="flex items-start gap-2 flex-1 min-w-0 text-left"
                        >
                          <FileTextIcon className="size-4 mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{doc.name}</div>
                            {doc.leadId && leads.find(l => l.id === doc.leadId) && (
                              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                {leads.find(l => l.id === doc.leadId)?.name}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              {new Date(doc.updatedAt).toLocaleString()}
                            </div>
                          </div>
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2Icon className="size-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir documento?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir "{doc.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteDocument(doc.id)}>
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </aside>

      {/* Editor */}
      <Card className="w-full flex-1 min-w-0">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">Editor de Documento</CardTitle>
              <CardDescription className="text-xs">
                Edite o conteúdo do documento conforme necessário
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveDocument} size="sm">
                <SaveIcon className="size-4 mr-2" />
                Salvar
              </Button>
              <Button onClick={handleCopyToClipboard} variant="outline" size="sm">
                <CopyIcon className="size-4" />
              </Button>
              <Button onClick={handlePrint} variant="outline" size="sm">
                <PrinterIcon className="size-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <DownloadIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDownload('doc')}>
                    <FileTextIcon className="size-4 mr-2" />
                    Baixar como DOC
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('pdf')}>
                    <FileTextIcon className="size-4 mr-2" />
                    Salvar como PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="doc-lead">Lead *</Label>
            </div>
            
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
                  id="doc-lead"
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
            <Label htmlFor="doc-name">Nome do Documento</Label>
            <Input
              id="doc-name"
              placeholder="Ex: Contrato - João Silva"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="editor">Conteúdo</Label>
            
            {/* Barra de Ferramentas de Formatação */}
            <div
              className="flex items-center gap-0.5 p-1.5 border rounded-md bg-muted/30"
              onMouseDown={(event) => event.preventDefault()}
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => applyFormat("bold")}
                title="Negrito"
              >
                <BoldIcon className="size-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => applyFormat("italic")}
                title="Itálico"
              >
                <ItalicIcon className="size-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => applyFormat("underline")}
                title="Sublinhado"
              >
                <UnderlineIcon className="size-3" />
              </Button>
              
              <div className="w-px h-4 bg-border mx-0.5" />
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => applyFormat("alignLeft")}
                title="Alinhar à esquerda"
              >
                <AlignLeftIcon className="size-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => applyFormat("alignCenter")}
                title="Centralizar"
              >
                <AlignCenterIcon className="size-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => applyFormat("alignRight")}
                title="Alinhar à direita"
              >
                <AlignRightIcon className="size-3" />
              </Button>
              
              <div className="w-px h-4 bg-border mx-0.5" />
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => applyFormat("list")}
                title="Lista não ordenada"
              >
                <ListIcon className="size-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => applyFormat("orderedList")}
                title="Lista ordenada"
              >
                <ListOrderedIcon className="size-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => applyFormat("table")}
                title="Criar tabela"
              >
                <TableIcon className="size-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => editorImageInputRef.current?.click()}
                title="Inserir imagem"
              >
                <ImageIcon className="size-3" />
              </Button>
              
              <div className="w-px h-4 bg-border mx-0.5" />
              
              <div className="flex items-center gap-1.5">
                <TypeIcon className="size-3 text-muted-foreground" />
                <Select value={fontSize} onValueChange={applyFontSize}>
                  <SelectTrigger className="h-6 w-[85px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10pt">10pt</SelectItem>
                    <SelectItem value="11pt">11pt</SelectItem>
                    <SelectItem value="12pt">12pt</SelectItem>
                    <SelectItem value="13pt">13pt</SelectItem>
                    <SelectItem value="14pt">14pt</SelectItem>
                    <SelectItem value="16pt">16pt</SelectItem>
                    <SelectItem value="18pt">18pt</SelectItem>
                    <SelectItem value="20pt">20pt</SelectItem>
                    <SelectItem value="24pt">24pt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <input
                ref={editorImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (event) => {
                  const file = event.target.files?.[0]
                  if (file) {
                    await handleInsertImageFromFile(file, "document")
                  }
                  event.currentTarget.value = ""
                }}
              />
            </div>
            
            <div className="relative">
              <div
                ref={editorRef}
                id="editor"
                contentEditable
                suppressContentEditableWarning
                className="w-full min-h-[600px] rounded-md border-2 shadow-lg bg-white dark:bg-gray-50 px-12 py-8 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground"
                style={{
                  fontFamily: "'Times New Roman', Times, serif",
                  fontSize: fontSize,
                  lineHeight: '1.8',
                  color: '#000',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                }}
                data-placeholder="Selecione um modelo ao lado ou comece a digitar..."
                onInput={(e) => {
                  const content = e.currentTarget.innerHTML
                  setEditorContent(content)
                  saveSelection(editorRef.current, editorSelectionRef)
                }}
                onBlur={(e) => {
                  const content = e.currentTarget.innerHTML
                  setEditorContent(content)
                  saveSelection(editorRef.current, editorSelectionRef)
                }}
                onKeyUp={() => saveSelection(editorRef.current, editorSelectionRef)}
                onMouseUp={(event) => {
                  saveSelection(editorRef.current, editorSelectionRef)
                  handleTableCellSelection(event.target, "document", editorRef.current)
                }}
                onClick={(event) => handleTableCellSelection(event.target, "document", editorRef.current)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tableUi && (
        <div
          data-table-tools="true"
          className="fixed z-[70] pointer-events-none"
          style={{
            left: tableUi.left,
            top: tableUi.top,
            width: tableUi.width,
            height: tableUi.height,
          }}
        >
          <div className="pointer-events-auto absolute -top-8 right-0 flex items-center gap-1 rounded-md border bg-background p-1 shadow">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-6 px-2 text-[10px]"
              onMouseDown={(event) => event.preventDefault()}
              onClick={addTableRow}
            >
              + linha
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-6 px-2 text-[10px]"
              onMouseDown={(event) => event.preventDefault()}
              onClick={addTableColumn}
            >
              + coluna
            </Button>
          </div>

          <button
            type="button"
            className="pointer-events-auto absolute -right-1 top-0 h-full w-2 cursor-col-resize rounded bg-primary/40"
            title="Arraste para ajustar largura"
            onMouseDown={(event) => startResize("width", event)}
          />

          <button
            type="button"
            className="pointer-events-auto absolute -bottom-1 left-0 h-2 w-full cursor-row-resize rounded bg-primary/40"
            title="Arraste para ajustar altura"
            onMouseDown={(event) => startResize("height", event)}
          />
        </div>
      )}

      {/* Diálogo para criar novo modelo */}
      <AlertDialog open={showNewTemplateDialog} onOpenChange={setShowNewTemplateDialog}>
        <AlertDialogContent className="min-w-5xl max-w-7xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>{editingTemplateId ? "Editar Modelo" : "Criar Novo Modelo"}</AlertDialogTitle>
            <AlertDialogDescription>
              {editingTemplateId
                ? "Atualize os campos abaixo para editar o modelo"
                : "Preencha os campos abaixo para criar um novo modelo de documento"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Nome do Modelo</Label>
              <Input
                id="template-name"
                placeholder="Ex: Contrato de Aluguel"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-category">Categoria</Label>
              <Input
                id="template-category"
                placeholder="Ex: Contratos"
                value={newTemplateCategory}
                onChange={(e) => setNewTemplateCategory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-editor">Conteúdo do Modelo</Label>
              
              {/* Barra de Ferramentas de Formatação */}
              <div
                className="flex items-center gap-0.5 p-1.5 border rounded-md bg-muted/30"
                onMouseDown={(event) => event.preventDefault()}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => applyTemplateFormat("bold")}
                  title="Negrito"
                >
                  <BoldIcon className="size-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => applyTemplateFormat("italic")}
                  title="Itálico"
                >
                  <ItalicIcon className="size-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => applyTemplateFormat("underline")}
                  title="Sublinhado"
                >
                  <UnderlineIcon className="size-3" />
                </Button>
                
                <div className="w-px h-4 bg-border mx-0.5" />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => applyTemplateFormat("alignLeft")}
                  title="Alinhar à esquerda"
                >
                  <AlignLeftIcon className="size-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => applyTemplateFormat("alignCenter")}
                  title="Centralizar"
                >
                  <AlignCenterIcon className="size-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => applyTemplateFormat("alignRight")}
                  title="Alinhar à direita"
                >
                  <AlignRightIcon className="size-3" />
                </Button>
                
                <div className="w-px h-4 bg-border mx-0.5" />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => applyTemplateFormat("list")}
                  title="Lista não ordenada"
                >
                  <ListIcon className="size-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => applyTemplateFormat("orderedList")}
                  title="Lista ordenada"
                >
                  <ListOrderedIcon className="size-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => applyTemplateFormat("table")}
                  title="Criar tabela"
                >
                  <TableIcon className="size-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => templateImageInputRef.current?.click()}
                  title="Inserir imagem"
                >
                  <ImageIcon className="size-3" />
                </Button>
                
                <div className="w-px h-4 bg-border mx-0.5" />
                
                <div className="flex items-center gap-1.5">
                  <TypeIcon className="size-3 text-muted-foreground" />
                  <Select value={templateEditorFontSize} onValueChange={applyTemplateFont}>
                    <SelectTrigger className="h-6 w-[85px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10pt">10pt</SelectItem>
                      <SelectItem value="11pt">11pt</SelectItem>
                      <SelectItem value="12pt">12pt</SelectItem>
                      <SelectItem value="13pt">13pt</SelectItem>
                      <SelectItem value="14pt">14pt</SelectItem>
                      <SelectItem value="16pt">16pt</SelectItem>
                      <SelectItem value="18pt">18pt</SelectItem>
                      <SelectItem value="20pt">20pt</SelectItem>
                      <SelectItem value="24pt">24pt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <input
                  ref={templateImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (event) => {
                    const file = event.target.files?.[0]
                    if (file) {
                      await handleInsertImageFromFile(file, "template")
                    }
                    event.currentTarget.value = ""
                  }}
                />
              </div>
              
              <div className="relative">
                <div
                  ref={templateEditorRef}
                  id="template-editor"
                  contentEditable
                  suppressContentEditableWarning
                  className="w-full min-h-[600px] rounded-md border-2 shadow-lg bg-white dark:bg-gray-50 px-12 py-8 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground"
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: templateEditorFontSize,
                    lineHeight: '1.8',
                    color: '#000',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                  }}
                  data-placeholder="Digite o conteúdo do modelo..."
                  onInput={(e) => {
                    const content = e.currentTarget.innerHTML
                    setNewTemplateContent(content)
                    saveSelection(templateEditorRef.current, templateSelectionRef)
                  }}
                  onKeyUp={() => saveSelection(templateEditorRef.current, templateSelectionRef)}
                  onMouseUp={(event) => {
                    saveSelection(templateEditorRef.current, templateSelectionRef)
                    handleTableCellSelection(event.target, "template", templateEditorRef.current)
                  }}
                  onClick={(event) => handleTableCellSelection(event.target, "template", templateEditorRef.current)}
                />
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setEditingTemplateId(null)
              setNewTemplateName("")
              setNewTemplateCategory("")
              setNewTemplateContent("")
              if (templateEditorRef.current) {
                templateEditorRef.current.innerHTML = ""
              }
              setTemplateEditorFontSize("12pt")
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateTemplate}>
              {editingTemplateId ? "Salvar Alterações" : "Criar Modelo"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo para criar novo lead */}
      <AlertDialog open={showNewLeadDialog} onOpenChange={setShowNewLeadDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Criar Novo Lead</AlertDialogTitle>
            <AlertDialogDescription>
              Preencha os campos abaixo para criar um novo lead
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lead-origin">Origem</Label>
              <Input
                id="lead-origin"
                placeholder="Ex: WhatsApp, Instagram, Indicação"
                value={newLeadOrigem}
                onChange={(e) => setNewLeadOrigem(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-name">Nome</Label>
              <Input
                id="lead-name"
                placeholder="Nome completo"
                value={newLeadName}
                onChange={(e) => setNewLeadName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                type="email"
                placeholder="email@exemplo.com"
                value={newLeadEmail}
                onChange={(e) => setNewLeadEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-phone">Telefone</Label>
              <Input
                id="lead-phone"
                placeholder="(XX) XXXXX-XXXX"
                value={newLeadPhone}
                onChange={(e) => setNewLeadPhone(e.target.value)}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setNewLeadOrigem("")
              setNewLeadName("")
              setNewLeadEmail("")
              setNewLeadPhone("")
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateLead}>
              Criar Lead
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}