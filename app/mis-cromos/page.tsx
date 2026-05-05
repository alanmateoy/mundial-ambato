'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

interface UsuarioCromo {
  id: number
  cromo_id: number
  estado: 'obtenido' | 'repetido'
  cromos: {
    id: number
    numero_cromo: number
    tipo: string
    jugadores: { nombre: string; apellido: string }
    selecciones: { nombre: string; grupo: string }
  }
}

export default function MisCromosPage() {
  const [user, setUser] = useState<User | null>(null)
  const [cromos, setCromos] = useState<UsuarioCromo[]>([])
  const [filtro, setFiltro] = useState<'todos' | 'obtenido' | 'repetido'>('todos')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUserAndLoadCromos()
  }, [])

  const checkUserAndLoadCromos = async () => {
    if (!supabase) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/login'
      return
    }
    setUser(user)
    loadCromos(user.id)
  }

  const loadCromos = async (userId: string) => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('usuario_cromos')
      .select(`
        id, cromo_id, estado,
        cromos (
          id, numero_cromo, tipo,
          jugadores (nombre, apellido),
          selecciones (nombre, grupo)
        )
      `)
      .eq('usuario_id', userId)

    if (data) setCromos(data as any[])
    setLoading(false)
  }

  const cromosFiltrados = filtro === 'todos' ? cromos : cromos.filter(c => c.estado === filtro)
  const obtenidos = cromos.filter(c => c.estado === 'obtenido').length
  const repetidos = cromos.filter(c => c.estado === 'repetido').length

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>

  return (
    <main className="min-h-screen bg-gradient-to-b from-mundial-green to-green-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <Link href="/" className="text-white/80 hover:text-white mb-4 inline-block">← Volver</Link>
          <h1 className="text-4xl font-display font-bold mb-2">🃏 Mis Cromos</h1>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-mundial-gold">{obtenidos}</p>
            <p>Obtenidos</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">{repetidos}</p>
            <p>Repetidos</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-white">{cromos.length}</p>
            <p>Total registrados</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 justify-center">
          {['todos', 'obtenido', 'repetido'].map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f as any)}
              className={`px-4 py-2 rounded-full ${filtro === f ? 'bg-mundial-gold text-black' : 'bg-white/20'}`}
            >
              {f === 'todos' ? 'Todos' : f === 'obtenido' ? 'Obtenidos' : 'Repetidos'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
          {cromosFiltrados.map(uc => (
            <div key={uc.id} className={`mundial-card p-3 ${uc.estado === 'repetido' ? 'border-blue-400' : 'border-mundial-gold'}`}>
              <div className="text-center">
                <p className="text-xs text-gray-600">#{uc.cromos.numero_cromo}</p>
                <p className="font-bold text-sm">{uc.cromos.jugadores.nombre} {uc.cromos.jugadores.apellido}</p>
                <p className="text-xs text-gray-500">{uc.cromos.selecciones.nombre}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${uc.estado === 'repetido' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                  {uc.estado}
                </span>
              </div>
            </div>
          ))}
        </div>

        {cromosFiltrados.length === 0 && (
          <p className="text-center text-white/60 mt-8">No tienes cromos registrados. ¡Empieza a registrar!</p>
        )}

        <div className="mt-8 text-center">
          <Link href="/catalogo" className="mundial-btn-gold">
            Ir al Catálogo para registrar cromos
          </Link>
        </div>
      </div>
    </main>
  )
}
