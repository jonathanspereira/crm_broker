"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function EsqueciSenhaPage() {
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim()) {
      toast.error("Informe seu e-mail.")
      return
    }

    try {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast.success("Instruções enviadas para seu e-mail.")
    } catch {
      toast.error("Não foi possível enviar as instruções.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Esqueci minha senha</CardTitle>
          <CardDescription>
            Informe seu e-mail para recuperar o acesso
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar instruções"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Lembrou a senha?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Voltar para login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
