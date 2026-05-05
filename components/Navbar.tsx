'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (!supabase) return
    
    supabase.auth.getUser().then((res) => {
      setUser(res.data.user ?? null)
    })
    
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session) => {
        setUser(session?.user ?? null)
      })

      return () => subscription.unsubscribe()
    }
  }, [])

  return (
    <nav className="bg-mundial-green/95 backdrop-blur border-b border-mundial-gold/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <span className="text-xl font-display font-bold text-white">Mundial Ambato</span>
        </Link>

        <div className="flex gap-4 items-center text-sm md:text-base">
          <Link href="/catalogo" className="text-white/80 hover:text-mundial-gold transition-colors">
            📚 Catálogo
          </Link>
          <Link href="/mis-cromos" className="text-white/80 hover:text-mundial-gold transition-colors">
            🃏 Mis Cromos
          </Link>
          <Link href="/intercambios" className="text-white/80 hover:text-mundial-gold transition-colors">
            🔄 Intercambios
          </Link>
          {user ? (
            <Link href="/perfil" className="text-white/80 hover:text-mundial-gold transition-colors">
              👤 Perfil
            </Link>
          ) : (
            <Link href="/login" className="mundial-btn-gold text-sm py-1 px-4">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
