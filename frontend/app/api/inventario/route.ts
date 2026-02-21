import { NextResponse } from "next/server"
import { Pool } from "pg"
import dns from "node:dns"

dns.setDefaultResultOrder("ipv4first")

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

let poolPromise: Promise<Pool> | null = null

const getDatabaseUrl = () => {
  return (
    process.env.DATABASE_URL_POOLER ||
    process.env.SUPABASE_DB_POOLER_URL ||
    process.env.DATABASE_URL
  )
}

const isUsingPoolerUrl = () => {
  return Boolean(process.env.DATABASE_URL_POOLER || process.env.SUPABASE_DB_POOLER_URL)
}

const getPool = async () => {
  if (poolPromise) return poolPromise

  poolPromise = (async () => {
    const databaseUrl = getDatabaseUrl()
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not configured")
    }

    try {
      const parsed = new URL(databaseUrl)
      const user = decodeURIComponent(parsed.username)
      const password = decodeURIComponent(parsed.password)
      const port = Number(parsed.port || 5432)
      const database = parsed.pathname.replace(/^\//, "") || "postgres"

      if (isUsingPoolerUrl()) {
        return new Pool({
          user,
          password,
          host: parsed.hostname,
          port,
          database,
          ssl: { rejectUnauthorized: false },
        })
      }

      const lookupResult = await dns.promises.lookup(parsed.hostname, { family: 4 })
      return new Pool({
        user,
        password,
        host: lookupResult.address,
        port,
        database,
        ssl: { rejectUnauthorized: false },
      })
    } catch {
      return new Pool({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false },
      })
    }
  })()

  return poolPromise
}

export async function GET() {
  try {
    const pool = await getPool()
    const client = await pool.connect()

    try {
      const result = await client.query(
        `
        SELECT
          id,
          nome,
          pavimentos,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM inventario_imoveis
        ORDER BY created_at DESC
        `
      )

      const data = result.rows.map((row) => ({
        id: row.id,
        nome: row.nome,
        pavimentos: Array.isArray(row.pavimentos) ? row.pavimentos : [],
      }))

      return NextResponse.json(data)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Inventory GET error:", error)

    const message =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      String((error as { code?: string }).code) === "42P01"
        ? "Tabela inventario_imoveis não encontrada. Execute o script SQL de inventário."
        : "Failed to fetch inventory"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, pavimentos } = body

    if (!nome || !Array.isArray(pavimentos)) {
      return NextResponse.json(
        { error: "Payload inválido: nome e pavimentos obrigatórios" },
        { status: 400 }
      )
    }

    const pool = await getPool()
    const client = await pool.connect()

    try {
      const imovelId = String(Date.now())
      const result = await client.query(
        `
        INSERT INTO inventario_imoveis (
          id,
          nome,
          pavimentos,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3::jsonb, NOW(), NOW())
        RETURNING id, nome, pavimentos
        `,
        [imovelId, nome, JSON.stringify(pavimentos)]
      )

      const row = result.rows[0]
      const imovel: Imovel = {
        id: row.id,
        nome: row.nome,
        pavimentos: Array.isArray(row.pavimentos) ? row.pavimentos : [],
      }

      return NextResponse.json(imovel, { status: 201 })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Inventory POST error:", error)

    const message =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      String((error as { code?: string }).code) === "42P01"
        ? "Tabela inventario_imoveis não encontrada. Execute o script SQL de inventário."
        : "Failed to create inventory item"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, nome, pavimentos } = body

    if (!id || !nome || !Array.isArray(pavimentos)) {
      return NextResponse.json(
        { error: "Payload inválido: id, nome e pavimentos obrigatórios" },
        { status: 400 }
      )
    }

    const pool = await getPool()
    const client = await pool.connect()

    try {
      const result = await client.query(
        `
        UPDATE inventario_imoveis
        SET nome = $1, pavimentos = $2::jsonb, updated_at = NOW()
        WHERE id = $3
        RETURNING id, nome, pavimentos
        `,
        [nome, JSON.stringify(pavimentos), id]
      )

      if (result.rowCount === 0) {
        return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 })
      }

      const row = result.rows[0]
      const imovel: Imovel = {
        id: row.id,
        nome: row.nome,
        pavimentos: Array.isArray(row.pavimentos) ? row.pavimentos : [],
      }

      return NextResponse.json(imovel)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Inventory PUT error:", error)
    return NextResponse.json({ error: "Failed to update inventory item" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Parâmetro id é obrigatório" }, { status: 400 })
    }

    const pool = await getPool()
    const client = await pool.connect()

    try {
      const result = await client.query("DELETE FROM inventario_imoveis WHERE id = $1", [id])
      if (result.rowCount === 0) {
        return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 })
      }

      return NextResponse.json({ success: true })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Inventory DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete inventory item" }, { status: 500 })
  }
}
