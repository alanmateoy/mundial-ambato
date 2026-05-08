'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AlbumStats {
  obtenidos: number
  total: number
  porcentaje: number
}

export default function AlbumPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<AlbumStats>({ obtenidos: 0, total: 980, porcentaje: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUserAndLoadStats()
  }, [])

  const checkUserAndLoadStats = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/login'
      return
    }

    setUser(user)

    const { data } = await supabase
      .from('usuario_cromos')
      .select('estado')
      .eq('usuario_id', user.id)
      .eq('estado', 'obtenido')

    const obtenidos = data?.length || 0
    setStats({
      obtenidos,
      total: 980,
      porcentaje: Math.round((obtenidos / 980) * 100),
    })
    setLoading(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-mundial-green to-green-800">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-mundial-gold"></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-mundial-green to-green-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <Link href="/" className="text-white/80 hover:text-white mb-4 inline-block">
            ← Volver
          </Link>
          <h1 className="text-4xl font-display font-bold mb-2">🎫 Mi Álbum Virtual</h1>
          <p className="text-xl">Completa tu colección del Mundial 2026</p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur rounded-xl p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-5xl font-bold text-mundial-gold mb-2">
                {stats.obtenidos}/{stats.total}
              </h2>
              <p className="text-xl text-white/80">Cromos obtenidos</p>
            </div>

            <div className="w-full bg-white/20 rounded-full h-4 mb-4 overflow-hidden">
              <div
                className="bg-mundial-gold h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.porcentaje}%` }}
              ></div>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-mundial-gold">{stats.porcentaje}%</p>
              <p className="text-white/60">Progreso del álbum</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/mis-cromos"
              className="bg-white/10 backdrop-blur rounded-xl p-6 hover:bg-white/20 transition-all"
            >
              <div className="text-4xl mb-3">🃏</div>
              <h3 className="text-2xl font-bold mb-2">Mis Cromos</h3>
              <p className="text-white/80">Ver y gestionar tu inventario de cromos</p>
            </Link>

            <Link
              href="/catalogo"
              className="bg-white/10 backdrop-blur rounded-xl p-6 hover:bg-white/20 transition-all"
            >
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-2xl font-bold mb-2">Catálogo</h3>
              <p className="text-white/80">Explora todos los cromos disponibles</p>
            </Link>
          </div>

          <div className="mt-8 bg-blue-500/20 border border-blue-400/50 rounded-xl p-6">
            <p className="text-blue-200">
              💡 <strong>Próximamente:</strong> Visualización del álbum como libro con páginas interactivas
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
