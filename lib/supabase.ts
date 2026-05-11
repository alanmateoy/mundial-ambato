import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''

// Debug logging
if (typeof window !== 'undefined') {
  console.log('🔍 Supabase Config:')
  console.log('  URL:', supabaseUrl ? '✅ Configurada' : '❌ Falta')
  console.log('  Key:', supabaseKey ? '✅ Configurada' : '❌ Falta')
}

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null as any
