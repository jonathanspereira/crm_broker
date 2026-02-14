'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PhoneIcon, MailIcon, MapPinIcon, ClockIcon } from 'lucide-react'

export default function ContatoPage() {
  const [formData, setFormData] = React.useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: '',
  })
  const [enviado, setEnviado] = React.useState(false)
  const [carregando, setCarregando] = React.useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    
    // Simular envio do formulário
    setTimeout(() => {
      setEnviado(true)
      setCarregando(false)
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: '',
      })
      
      // Fechar mensagem após 5 segundos
      setTimeout(() => setEnviado(false), 5000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="outline" className="mb-6">
              ← Voltar
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Entre em Contato
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Estamos aqui para ajudar! Entre em contato conosco e responderemos em breve.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Telefone */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <PhoneIcon className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <CardTitle className="text-lg">Telefone</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-slate-700 dark:text-slate-300 font-semibold">
                (11) 3000-0000
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Segunda a sexta, 09:00 - 18:00
              </p>
            </CardContent>
          </Card>

          {/* Email */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <MailIcon className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <CardTitle className="text-lg">Email</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-slate-700 dark:text-slate-300 font-semibold">
                suporte@crmbroker.com
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Resposta em até 24 horas
              </p>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <MapPinIcon className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
                <CardTitle className="text-lg">Endereço</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                São Paulo, SP<br />
                Brasil
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Atendimento presencial com agendamento
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulário */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Enviar Mensagem
            </h2>
            
            {enviado && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-700 dark:text-green-400 font-medium">
                  ✓ Mensagem enviada com sucesso! Entraremos em contato em breve.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder="Seu nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  placeholder="(XX) XXXXX-XXXX"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assunto">Assunto *</Label>
                <Input
                  id="assunto"
                  name="assunto"
                  placeholder="Qual é o assunto?"
                  value={formData.assunto}
                  onChange={handleChange}
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensagem">Mensagem *</Label>
                <Textarea
                  id="mensagem"
                  name="mensagem"
                  placeholder="Escreva sua mensagem aqui..."
                  value={formData.mensagem}
                  onChange={handleChange}
                  required
                  className="min-h-[150px] resize-none"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-10"
                disabled={carregando}
              >
                {carregando ? 'Enviando...' : 'Enviar Mensagem'}
              </Button>
            </form>
          </div>

          {/* Informações Adicionais */}
          <div className="space-y-6">
            {/* Horário de Atendimento */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <ClockIcon className="text-orange-600 dark:text-orange-400" size={24} />
                  </div>
                  <CardTitle>Horário de Atendimento</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-700 dark:text-slate-300">Segunda a Sexta</span>
                  <span className="font-semibold text-slate-900 dark:text-white">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700 dark:text-slate-300">Sábado</span>
                  <span className="font-semibold text-slate-900 dark:text-white">10:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700 dark:text-slate-300">Domingo e Feriados</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Fechado</span>
                </div>
              </CardContent>
            </Card>

            {/* Departamentos */}
            <Card>
              <CardHeader>
                <CardTitle>Departamentos</CardTitle>
                <CardDescription>Escolha o departamento mais apropriado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Suporte Técnico</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      suporte@crmbroker.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Vendas</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      vendas@crmbroker.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Parcerias</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      parcerias@crmbroker.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Rápido */}
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Quanto tempo leva para receber resposta?</p>
                  <p className="text-slate-600 dark:text-slate-400">Geralmente respondemos em até 24 horas.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Posso agendar uma reunião?</p>
                  <p className="text-slate-600 dark:text-slate-400">Sim! Confirme seu interesse e entraremos em contato.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Qual é seu horário de atendimento?</p>
                  <p className="text-slate-600 dark:text-slate-400">Segunda a sexta, 09:00 - 18:00 (horário de Brasília).</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rede Social/Links */}
        <div className="mt-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Siga-nos nas Redes Sociais
          </h3>
          <div className="flex justify-center gap-6">
            <Link href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline">
              LinkedIn
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline">
              Facebook
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline">
              Instagram
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline">
              Twitter
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t mt-12 py-8 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            © 2026 CRM Broker. Todos os direitos reservados.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm">
              Início
            </Link>
            <Link href="/privacidade" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm">
              Política de Privacidade
            </Link>
            <Link href="/politicas-uso" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm">
              Políticas de Uso
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
