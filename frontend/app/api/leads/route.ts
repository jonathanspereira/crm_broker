import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { randomUUID } from 'crypto'
import dns from 'node:dns'

dns.setDefaultResultOrder('ipv4first')

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
      throw new Error('DATABASE_URL is not configured')
    }

    try {
      const parsed = new URL(databaseUrl)
      
      // Parse credentials com decode explícito
      const user = decodeURIComponent(parsed.username)
      const password = decodeURIComponent(parsed.password)
      const port = Number(parsed.port || 5432)
      const database = parsed.pathname.replace(/^\//, '') || 'postgres'
      
      if (isUsingPoolerUrl()) {
        // Pooler: usa hostname direto (sem DNS lookup)
        return new Pool({
          user,
          password,
          host: parsed.hostname,
          port,
          database,
          ssl: {
            rejectUnauthorized: false,
          },
        })
      }

      // Direct connection: tenta IPv4 lookup
      const lookupResult = await dns.promises.lookup(parsed.hostname, { family: 4 })

      return new Pool({
        user,
        password,
        host: lookupResult.address,
        port,
        database,
        ssl: {
          rejectUnauthorized: false,
        },
      })
    } catch (error) {
      console.warn('IPv4 resolution failed, falling back to connectionString:', error)
      return new Pool({
        connectionString: databaseUrl,
        ssl: {
          rejectUnauthorized: false,
        },
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
      const result = await client.query(`
        SELECT 
          user_id as id,
          origem,
          COALESCE(nome, 'Sem nome') as name,
          COALESCE(contato, '') as email,
          COALESCE(contato, '') as phone,
          CASE
            WHEN etapa_conversa IN ('novo', 'qualificado', 'negociacao', 'fechado', 'perdido') THEN etapa_conversa
            ELSE 'novo'
          END as status,
          data_criacao as "createdAt",
          tipo_trabalho as "tipoContrato",
          CASE
            WHEN lower(COALESCE(to_jsonb(leads_whatsapp) ->> 'restricao', '')) IN ('true', 't', '1', 'sim') THEN true
            WHEN lower(COALESCE(to_jsonb(leads_whatsapp) ->> 'restricao', '')) IN ('false', 'f', '0', 'nao', 'não') THEN false
            ELSE NULL
          END as restricao,
          COALESCE(saldo_fgts, 0)::text as fgts
        FROM leads_whatsapp
        ORDER BY data_criacao DESC NULLS LAST
      `)
      
      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Database error:', error)
    const message =
      error instanceof Error && /ENETUNREACH|ENOTFOUND/.test(error.message)
        ? 'Falha de rede com host do banco. Configure DATABASE_URL_POOLER (Supabase Session/Transaction pooler) para conexão IPv4.'
        : 'Failed to fetch leads'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { origem, name, email, phone, status, tipoContrato, restricao, fgts } = body
    
    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: 'Missing required fields: name and (email or phone)' },
        { status: 400 }
      )
    }
    
    const pool = await getPool()
    const client = await pool.connect()
    
    try {
      const result = await client.query(
        `
        INSERT INTO leads_whatsapp (
          user_id,
          nome,
          origem,
          contato,
          etapa_conversa,
          data_criacao,
          ultima_interacao,
          tipo_trabalho,
          saldo_fgts
        )
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6, $7)
        RETURNING 
          user_id as id,
          origem,
          COALESCE(nome, 'Sem nome') as name,
          COALESCE(contato, '') as email,
          COALESCE(contato, '') as phone,
          CASE
            WHEN etapa_conversa IN ('novo', 'qualificado', 'negociacao', 'fechado', 'perdido') THEN etapa_conversa
            ELSE 'novo'
          END as status,
          data_criacao as "createdAt",
          tipo_trabalho as "tipoContrato",
          CASE
            WHEN lower(COALESCE(to_jsonb(leads_whatsapp) ->> 'restricao', '')) IN ('true', 't', '1', 'sim') THEN true
            WHEN lower(COALESCE(to_jsonb(leads_whatsapp) ->> 'restricao', '')) IN ('false', 'f', '0', 'nao', 'não') THEN false
            ELSE NULL
          END as restricao,
          COALESCE(saldo_fgts, 0)::text as fgts
        `,
        [
          randomUUID(),
          name,
          origem || null,
          phone || email || null,
          status || 'novo',
          tipoContrato || null,
          fgts || 0,
        ]
      )
      
      return NextResponse.json(result.rows[0], { status: 201 })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, origem, name, email, phone, status, tipoContrato, restricao, fgts } = body
    
    if (!id || !name || (!email && !phone)) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name and (email or phone)' },
        { status: 400 }
      )
    }
    
    const pool = await getPool()
    const client = await pool.connect()
    
    try {
      const result = await client.query(
        `
        UPDATE leads_whatsapp
        SET 
          ultima_interacao = NOW(),
          nome = $1,
          origem = $2,
          contato = $3,
          etapa_conversa = $4,
          tipo_trabalho = $5,
          saldo_fgts = $6
        WHERE user_id = $7
        RETURNING 
          user_id as id,
          origem,
          COALESCE(nome, 'Sem nome') as name,
          COALESCE(contato, '') as email,
          COALESCE(contato, '') as phone,
          CASE
            WHEN etapa_conversa IN ('novo', 'qualificado', 'negociacao', 'fechado', 'perdido') THEN etapa_conversa
            ELSE 'novo'
          END as status,
          data_criacao as "createdAt",
          tipo_trabalho as "tipoContrato",
          CASE
            WHEN lower(COALESCE(to_jsonb(leads_whatsapp) ->> 'restricao', '')) IN ('true', 't', '1', 'sim') THEN true
            WHEN lower(COALESCE(to_jsonb(leads_whatsapp) ->> 'restricao', '')) IN ('false', 'f', '0', 'nao', 'não') THEN false
            ELSE NULL
          END as restricao,
          COALESCE(saldo_fgts, 0)::text as fgts
        `,
        [
          name,
          origem || null,
          phone || email || null,
          status || 'novo',
          tipoContrato || null,
          fgts || 0,
          id
        ]
      )
      
      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Lead not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(result.rows[0])
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      )
    }
    
    const pool = await getPool()
    const client = await pool.connect()
    
    try {
      const result = await client.query(
        'DELETE FROM leads_whatsapp WHERE user_id = $1 RETURNING user_id as id',
        [id]
      )
      
      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Lead not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ success: true })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    )
  }
}
