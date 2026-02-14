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
  name: string
  email: string
  phone: string
  status: "novo" | "qualificado" | "negociacao" | "fechado" | "perdido"
  createdAt: string
}

const STORAGE_KEY = "crm_documentos"
const TEMPLATES_STORAGE_KEY = "crm_templates"
const LEADS_STORAGE_KEY = "crm_leads"

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
  const [showSaveToast, setShowSaveToast] = React.useState(false)
  const [fontSize, setFontSize] = React.useState("13pt")
  const editorRef = React.useRef<HTMLDivElement>(null)
  const [showNewTemplateDialog, setShowNewTemplateDialog] = React.useState(false)
  const [newTemplateName, setNewTemplateName] = React.useState("")
  const [newTemplateCategory, setNewTemplateCategory] = React.useState("")
  const [newTemplateContent, setNewTemplateContent] = React.useState("")
  const [templateEditorFontSize, setTemplateEditorFontSize] = React.useState("12pt")
  const templateEditorRef = React.useRef<HTMLDivElement>(null)
  const [showNewLeadDialog, setShowNewLeadDialog] = React.useState(false)
  const [newLeadName, setNewLeadName] = React.useState("")
  const [newLeadEmail, setNewLeadEmail] = React.useState("")
  const [newLeadPhone, setNewLeadPhone] = React.useState("")
  const [searchLeadTerm, setSearchLeadTerm] = React.useState("")
  const [showLeadDropdown, setShowLeadDropdown] = React.useState(false)
  const leadSearchRef = React.useRef<HTMLDivElement>(null)

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

      // Carregar leads
      const storedLeads = localStorage.getItem(LEADS_STORAGE_KEY)
      if (storedLeads) {
        setLeads(JSON.parse(storedLeads))
      }
    }
  }, [])

  React.useEffect(() => {
    if (!showSaveToast) return
    const timeout = setTimeout(() => setShowSaveToast(false), 2500)
    return () => clearTimeout(timeout)
  }, [showSaveToast])

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
    
    setShowSaveToast(true)
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

  const applyTemplateFormat = (command: string) => {
    const editor = templateEditorRef.current
    if (!editor) return

    editor.focus()

    // Garantir que há uma seleção ou cursor no editor
    const selection = window.getSelection()
    if (!selection) return

    // Se não há seleção, criar uma no final do editor
    if (selection.rangeCount === 0) {
      const range = document.createRange()
      range.selectNodeContents(editor)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    }

    if (command === "bold") document.execCommand("bold", false)
    else if (command === "italic") document.execCommand("italic", false)
    else if (command === "underline") document.execCommand("underline", false)
    else if (command === "alignLeft") document.execCommand("justifyLeft", false)
    else if (command === "alignCenter") document.execCommand("justifyCenter", false)
    else if (command === "alignRight") document.execCommand("justifyRight", false)
    else if (command === "list") document.execCommand("insertUnorderedList", false)
    else if (command === "orderedList") document.execCommand("insertOrderedList", false)
  }

  const handleCreateTemplate = () => {
    const textContent = templateEditorRef.current ? (templateEditorRef.current.innerText || templateEditorRef.current.textContent || '').trim() : newTemplateContent.trim()
    
    if (!newTemplateName.trim() || !newTemplateCategory.trim() || !textContent) {
      alert("Por favor, preencha todos os campos do modelo")
      return
    }

    const newTemplate: DocumentTemplate = {
      id: String(Date.now()),
      name: newTemplateName,
      category: newTemplateCategory,
      content: templateEditorRef.current?.innerHTML || newTemplateContent,
    }

    const updated = [...templates, newTemplate]
    setTemplates(updated)
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updated))

    // Limpar formulário e fechar diálogo
    setNewTemplateName("")
    setNewTemplateCategory("")
    setNewTemplateContent("")
    if (templateEditorRef.current) {
      templateEditorRef.current.innerHTML = ""
    }
    setTemplateEditorFontSize("12pt")
    setShowNewTemplateDialog(false)

    // Selecionar o novo template
    handleTemplateSelect(newTemplate.id)
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

  const applyFormat = (formatType: string) => {
    const editor = editorRef.current
    if (!editor) return

    editor.focus()

    // Garantir que há uma seleção ou cursor no editor
    const selection = window.getSelection()
    if (!selection) return

    // Se não há seleção, criar uma no final do editor
    if (selection.rangeCount === 0) {
      const range = document.createRange()
      range.selectNodeContents(editor)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    }

    switch (formatType) {
      case "bold":
        document.execCommand("bold", false)
        break
      case "italic":
        document.execCommand("italic", false)
        break
      case "underline":
        document.execCommand("underline", false)
        break
      case "alignLeft":
        document.execCommand("justifyLeft", false)
        break
      case "alignCenter":
        document.execCommand("justifyCenter", false)
        break
      case "alignRight":
        document.execCommand("justifyRight", false)
        break
      case "list":
        document.execCommand("insertUnorderedList", false)
        break
      case "orderedList":
        document.execCommand("insertOrderedList", false)
        break
    }

    // Atualizar o estado com o novo conteúdo
    setEditorContent(editor.innerHTML)
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
                      onClick={() => setShowNewTemplateDialog(true)}
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
            <div className="flex items-center gap-0.5 p-1.5 border rounded-md bg-muted/30">
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
                }}
                onBlur={(e) => {
                  const content = e.currentTarget.innerHTML
                  setEditorContent(content)
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo para criar novo modelo */}
      <AlertDialog className="max-w-9xl max-h-[90vh] overflow-y-auto" open={showNewTemplateDialog} onOpenChange={setShowNewTemplateDialog}>
        <AlertDialogContent className="max-w-9xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Criar Novo Modelo</AlertDialogTitle>
            <AlertDialogDescription>
              Preencha os campos abaixo para criar um novo modelo de documento
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
              <div className="flex items-center gap-0.5 p-1.5 border rounded-md bg-muted/30">
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
                  }}
                />
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
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
              Criar Modelo
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

      {showSaveToast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-md border bg-background px-4 py-3 text-sm shadow-lg">
          <div className="font-medium text-green-600">
            Documento salvo com sucesso!
          </div>
        </div>
      )}
    </div>
  )
}