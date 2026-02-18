import { NextResponse } from 'next/server'

const getDatabaseUrl = () => {
  return (
    process.env.DATABASE_URL_POOLER ||
    process.env.SUPABASE_DB_POOLER_URL ||
    process.env.DATABASE_URL
  )
}

export async function GET() {
  const databaseUrl = getDatabaseUrl()
  
  if (!databaseUrl) {
    return NextResponse.json({ error: 'No DATABASE_URL configured' })
  }

  try {
    const parsed = new URL(databaseUrl)
    
    // Retorna credenciais parseadas (sem mostrar senha completa)
    return NextResponse.json({
      using: process.env.DATABASE_URL_POOLER ? 'POOLER' : 'DIRECT',
      host: parsed.hostname,
      port: parsed.port,
      user: decodeURIComponent(parsed.username),
      database: parsed.pathname.replace(/^\//, '') || 'postgres',
      passwordLength: parsed.password.length,
      passwordFirstChars: parsed.password.substring(0, 3) + '***'
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) })
  }
}
