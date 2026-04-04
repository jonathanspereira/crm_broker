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
          id,
          origem,
          name,
          email,
          phone,
          status,
          "createdAt"
        FROM leads
        ORDER BY "createdAt" DESC NULLS LAST
      `)
      
      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('GET /api/leads error:', errorMessage)
    
    let message = 'Failed to fetch leads'
    if (errorMessage.includes('does not exist')) {
      message = 'Tabela "leads" não existe. Execute o script SQL de setup no Supabase primeiro.'
    } else if (/ENETUNREACH|ENOTFOUND|ECONNREFUSED/.test(errorMessage)) {
      message = 'Erro de conexão com banco de dados. Verifique DATABASE_URL em .env.local e a senha Supabase.'
    } else if (errorMessage.includes('password')) {
      message = 'Senha do banco de dados incorreta. Verifique DATABASE_URL em .env.local'
    }
    
    return NextResponse.json(
      { error: message, details: errorMessage },
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
        INSERT INTO leads (
          id,
          origem,
          name,
          email,
          phone,
          status
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING 
          id,
          origem,
          name,
          email,
          phone,
          status,
          "createdAt"
        `,
        [
          randomUUID(),
          origem || null,
          name,
          email || null,
          phone || null,
          status || 'novo'
        ]
      )
      
      return NextResponse.json(result.rows[0], { status: 201 })
    } finally {
      client.release()
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('POST /api/leads error:', errorMessage)
    
    let message = 'Failed to create lead'
    if (errorMessage.includes('does not exist')) {
      message = 'Tabela "leads" não existe. Execute o script SQL de setup no Supabase primeiro.'
    } else if (/ENETUNREACH|ENOTFOUND|ECONNREFUSED/.test(errorMessage)) {
      message = 'Erro de conexão com banco de dados.'
    } else if (errorMessage.includes('Unique violation')) {
      message = 'Este lead já existe ou há conflito com email/telefone.'
    }
    
    return NextResponse.json(
      { error: message, details: errorMessage },
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
        UPDATE leads
        SET 
          name = $1,
          origem = $2,
          email = $3,
          phone = $4,
          status = $5
        WHERE id = $6
        RETURNING 
          id,
          origem,
          name,
          email,
          phone,
          status,
          "createdAt"
        `,
        [
          name,
          origem || null,
          email || null,
          phone || null,
          status || 'novo',
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
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('PUT /api/leads error:', errorMessage)
    
    return NextResponse.json(
      { error: 'Failed to update lead', details: errorMessage },
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
        'DELETE FROM leads WHERE id = $1 RETURNING id',
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
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('DELETE /api/leads error:', errorMessage)
    
    return NextResponse.json(
      { error: 'Failed to delete lead', details: errorMessage },
      { status: 500 }
    )
  }
}
