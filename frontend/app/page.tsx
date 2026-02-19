"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, GiftIcon, KeyRoundIcon, MessageCircleIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const BROKER_NAME = process.env.NEXT_PUBLIC_BROKER_NAME || "Seu Nome"
const BROKER_BRAND = process.env.NEXT_PUBLIC_BROKER_BRAND || "CRM Broker"
const WHATSAPP_NUMBER_RAW = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5500000000000"

const normalizeWhatsappNumber = (value: string) => {
	const digits = value.replace(/\D/g, "")
	if (!digits) return "5500000000000"
	return digits.startsWith("55") ? digits : `55${digits}`
}

const WHATSAPP_NUMBER = normalizeWhatsappNumber(WHATSAPP_NUMBER_RAW)
const CONTACT_WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`
const REFERRAL_WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Tenho%20interesse%20na%20indica%C3%A7%C3%A3o%20premiada`
const REFERRAL_INFO_WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Quero%20saber%20mais%20sobre%20a%20indica%C3%A7%C3%A3o%20premiada`

export default function Page() {
	const [name, setName] = React.useState("")
	const [email, setEmail] = React.useState("")
	const [phone, setPhone] = React.useState("")
	const [message, setMessage] = React.useState("")
	const [submitting, setSubmitting] = React.useState(false)

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!name.trim() || !phone.trim() || !message.trim()) {
			toast.error("Preencha nome, telefone e mensagem.")
			return
		}

		try {
			setSubmitting(true)

			const response = await fetch("/api/leads", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					origem: "site",
					name,
					email,
					phone,
					status: "novo",
				}),
			})

			if (!response.ok) {
				throw new Error("Erro ao salvar lead")
			}

			toast.success("Contato enviado com sucesso! Já registrei seu lead com origem site.")
			setName("")
			setEmail("")
			setPhone("")
			setMessage("")
		} catch {
			toast.error("Não foi possível enviar agora. Tente novamente em instantes.")
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<main className="min-h-screen bg-background">
			<section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 md:px-6">
				<header className="flex items-center justify-between">
					<div>
						<p className="text-sm text-muted-foreground">{BROKER_NAME} • Corretor de imóveis</p>
						<h1 className="text-xl font-semibold">{BROKER_BRAND}</h1>
					</div>
					<Link href="/login">
						<Button variant="outline" className="gap-2">
							<KeyRoundIcon className="size-4" />
							Acessar login
						</Button>
					</Link>
				</header>

				<div className="grid gap-6 md:grid-cols-2 md:items-center">
					<div className="space-y-5">
						<h2 className="text-3xl font-bold tracking-tight md:text-4xl">
							Atendimento imobiliário consultivo com {BROKER_NAME} para comprar com segurança e estratégia.
						</h2>
						<p className="text-muted-foreground">
							Eu acompanho você em todo o processo: análise de perfil, simulação,
							escolha do imóvel e negociação com foco no melhor custo-benefício.
						</p>
						<div className="flex flex-wrap gap-3">
							<a
								href={CONTACT_WHATSAPP_URL}
								target="_blank"
								rel="noreferrer"
							>
								<Button className="gap-2">
									<MessageCircleIcon className="size-4" />
									Falar comigo no WhatsApp
								</Button>
							</a>
							<a
								href={REFERRAL_WHATSAPP_URL}
								target="_blank"
								rel="noreferrer"
							>
								<Button variant="secondary" className="gap-2">
									<GiftIcon className="size-4" />
									Indicação premiada
								</Button>
							</a>
						</div>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Por que me escolher?</CardTitle>
							<CardDescription>
								Atendimento humano, ágil e orientado a resultado.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3 text-sm text-muted-foreground">
							<p>• Direcionamento conforme seu momento financeiro.</p>
							<p>• Apoio para documentação e aprovação de crédito.</p>
							<p>• Curadoria de oportunidades com transparência.</p>
							<p>• Pós-venda com acompanhamento contínuo.</p>
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Formulário de contato</CardTitle>
							<CardDescription>
								Envie seus dados que eu retorno com uma proposta personalizada.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form className="space-y-4" onSubmit={handleSubmit}>
								<div className="space-y-2">
									<Label htmlFor="name">Nome</Label>
									<Input
										id="name"
										placeholder="Seu nome"
										value={name}
										onChange={(event) => setName(event.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">E-mail</Label>
									<Input
										id="email"
										type="email"
										placeholder="seuemail@exemplo.com"
										value={email}
										onChange={(event) => setEmail(event.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="phone">Telefone</Label>
									<Input
										id="phone"
										placeholder="(00) 00000-0000"
										value={phone}
										onChange={(event) => setPhone(event.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="message">Mensagem</Label>
									<Textarea
										id="message"
										placeholder="Conte o tipo de imóvel e sua faixa de investimento"
										value={message}
										onChange={(event) => setMessage(event.target.value)}
									/>
								</div>
								<Button type="submit" className="w-full gap-2" disabled={submitting}>
									{submitting ? "Enviando..." : "Enviar contato"}
									<ArrowRightIcon className="size-4" />
								</Button>
							</form>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Pronto para dar o próximo passo?</CardTitle>
							<CardDescription>
								Escolha como você quer começar agora.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<Link href="/login" className="block">
								<Button variant="outline" className="w-full justify-between">
									Acessar área de clientes
									<ArrowRightIcon className="size-4" />
								</Button>
							</Link>
							<a
								href={REFERRAL_INFO_WHATSAPP_URL}
								target="_blank"
								rel="noreferrer"
								className="block"
							>
								<Button className="w-full justify-between" variant="secondary">
									Participar da indicação premiada
									<GiftIcon className="size-4" />
								</Button>
							</a>
						</CardContent>
					</Card>
				</div>
			</section>
		</main>
	)
}