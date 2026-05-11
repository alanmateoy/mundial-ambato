'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { LIMIT_USUARIO_CROMOS, ESTADO_CROMO_COLORES } from '@/lib/constants'
import type { User } from '@supabase/supabase-js'
import type { UsuarioCromo } from '@/lib/types'

type Filtro = 'todos' | 'obtenido' | 'repetido'

export default function MisCromosPage() {
  const [user, setUser] = useState<User | null>(null)
  const [cromos, setCromos] = useState<UsuarioCromo[]>([])
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [cromoInput, setCromoInput] = useState('')
  const [estadoInput, setEstadoInput] = useState<'obtenido' | 'repetido'>('obtenido')
  const [registering, setRegistering] = useState(false)

  useEffect(() => {
    checkUserAndLoadCromos()
  }, [])

  const checkUserAndLoadCromos = async () => {
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
    loadCromos(user.id)
  }

  const loadCromos = useCallback(async (userId: string) => {
    if (!supabase) return
    const { data } = await supabase
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
      .limit(LIMIT_USUARIO_CROMOS)

    if (data) setCromos(data as any[])
    setLoading(false)
  }, [])

  const registrarCromo = useCallback(async () => {
    if (!user || !supabase || !cromoInput) return

    const cromoNum = parseInt(cromoInput)
    if (cromoNum < 1 || cromoNum > 980) {
      alert('El número debe estar entre 1 y 980')
      return
    }

    setRegistering(true)
    const { data: cromo } = await supabase
      .from('cromos')
      .select('id')
      .eq('numero_cromo', cromoNum)
      .single()

    if (!cromo) {
      alert('Cromo no encontrado')
      setRegistering(false)
      return
    }

    const { error } = await supabase
      .from('usuario_cromos')
      .insert({
        usuario_id: user.id,
        cromo_id: cromo.id,
        estado: estadoInput,
      })

    if (error) {
      alert('Error al registrar cromo: ' + error.message)
    } else {
      setCromoInput('')
      setEstadoInput('obtenido')
      setModalOpen(false)
      loadCromos(user.id)
    }
    setRegistering(false)
  }, [user, cromoInput, estadoInput, loadCromos])

  const cromosFiltrados = filtro === 'todos' ? cromos : cromos.filter((c) => c.estado === filtro)
  const obtenidos = cromos.filter((c) => c.estado === 'obtenido').length
  const repetidos = cromos.filter((c) => c.estado === 'repetido').length

  const getTipoIcon = (tipo: string) => {
    const map: Record<string, string> = {
      normal: '👤',
      escudo: '🛡️',
      foto_equipo: '📸',
      introduccion: '🌟',
      museo_fifa: '🏛️',
      especial: '✨',
      dorado: '🥇',
      seleccion: '⚽',
    }
    return map[tipo] || '🎴'
  }

  const isFoil = (tipo: string) =>
    ['escudo', 'introduccion', 'museo_fifa', 'dorado', 'especial'].includes(tipo)

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="loader-premium"></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <section className="container mx-auto px-4 lg:px-6 pt-8 pb-12">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="badge-cyan inline-flex mb-4">
            <span>🎴</span>
            <span>Tu Inventario</span>
          </div>
          <h1 className="page-title">
            Mis <span className="text-gradient">Cromos</span>
          </h1>
          <p className="page-subtitle max-w-2xl mx-auto mt-4">
            Gestiona tu colección, identifica repetidos y publícalos para intercambio.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 lg:px-6 mb-8">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-3 lg:gap-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">✅</span>
              <span className="badge-green text-[10px]">Obtenidos</span>
            </div>
            <div className="text-3xl lg:text-4xl font-display font-black text-mundial-green-light">
              {obtenidos}
            </div>
            <div className="text-xs text-white/40 mt-1">Únicos en tu colección</div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🔄</span>
              <span className="badge-cyan text-[10px]">Repetidos</span>
            </div>
            <div className="text-3xl lg:text-4xl font-display font-black text-cyan-300">
              {repetidos}
            </div>
            <div className="text-xs text-white/40 mt-1">Listos para intercambiar</div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📦</span>
              <span className="badge-gold text-[10px]">Total</span>
            </div>
            <div className="text-3xl lg:text-4xl font-display font-black text-mundial-gold-light">
              {cromos.length}
            </div>
            <div className="text-xs text-white/40 mt-1">Cromos registrados</div>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="container mx-auto px-4 lg:px-6 mb-6">
        <div className="max-w-5xl mx-auto flex justify-center">
          <div className="inline-flex glass-premium p-1.5 gap-1">
            {[
              { id: 'todos' as Filtro, label: 'Todos', icon: '🎴', count: cromos.length },
              { id: 'obtenido' as Filtro, label: 'Obtenidos', icon: '✅', count: obtenidos },
              { id: 'repetido' as Filtro, label: 'Repetidos', icon: '🔄', count: repetidos },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFiltro(f.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  filtro === f.id
                    ? 'bg-gradient-to-r from-mundial-green to-mundial-cyan text-white shadow-glow-green'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{f.icon}</span>
                <span className="hidden sm:inline">{f.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  filtro === f.id ? 'bg-white/20' : 'bg-white/5'
                }`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cromos Grid */}
      <section className="container mx-auto px-4 lg:px-6">
        {cromosFiltrados.length === 0 ? (
          <div className="max-w-md mx-auto glass-premium p-10 text-center animate-fade-in">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold mb-2">No tienes cromos registrados</h3>
            <p className="text-white/50 mb-6">
              Empieza a coleccionar registrando tus primeros cromos
            </p>
            <Link href="/catalogo" className="btn-primary inline-flex">
              Ver catálogo
              <span>→</span>
            </Link>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
            {cromosFiltrados.map((uc, i) => {
              const c = uc.cromos
              const foil = isFoil(c.tipo)
              const repetido = uc.estado === 'repetido'

              return (
                <article
                  key={uc.id}
                  className={foil ? 'cromo-card-foil animate-scale-in' : 'cromo-card animate-scale-in'}
                  style={{ animationDelay: `${Math.min(i * 20, 400)}ms` }}
                >
                  <div className="relative z-10">
                    {/* Tipo Icon */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs px-2 py-1 rounded-md font-mono font-bold ${
                        foil ? 'bg-mundial-gold/20 text-mundial-gold-light' : 'bg-white/10 text-white/70'
                      }`}>
                        #{c.numero_cromo}
                      </span>
                      <span className="text-2xl">{getTipoIcon(c.tipo)}</span>
                    </div>

                    {/* Player/Card Info */}
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-mundial-dark-3 to-mundial-dark-4 flex items-center justify-center mb-3 border border-white/5 relative overflow-hidden">
                      {foil && (
                        <div className="absolute inset-0 holographic opacity-30"></div>
                      )}
                      <div className="text-5xl relative z-10">
                        {getTipoIcon(c.tipo)}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="text-center mb-2">
                      {c.jugadores ? (
                        <>
                          <div className="text-sm font-bold truncate">
                            {c.jugadores.nombre}
                          </div>
                          <div className="text-xs text-white/60 truncate">
                            {c.jugadores.apellido}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm font-bold capitalize">
                          {c.tipo.replace('_', ' ')}
                        </div>
                      )}
                      {c.selecciones && (
                        <div className="text-[10px] text-white/40 mt-1 truncate">
                          {c.selecciones.nombre}
                        </div>
                      )}
                    </div>

                    {/* Estado */}
                    <div className="flex items-center justify-center">
                      {repetido ? (
                        <span className="badge-cyan text-[10px]">
                          <span>🔄</span>
                          Repetido
                        </span>
                      ) : (
                        <span className="badge-green text-[10px]">
                          <span>✅</span>
                          Obtenido
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <div className="text-center mt-12 space-y-4">
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary"
        >
          + Registrar Cromo
        </button>
        <Link href="/catalogo" className="btn-ghost block">
          Ir al catálogo
          <span>→</span>
        </Link>
        <div>
          <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>

      {/* Modal Registrar Cromo */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-card max-w-sm w-full animate-scale-in">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-white">Registrar Cromo</h2>

              <div className="space-y-4">
                {/* Número Cromo */}
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">
                    Número de Cromo (1-980)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="980"
                    value={cromoInput}
                    onChange={(e) => setCromoInput(e.target.value)}
                    placeholder="Ej: 123"
                    className="input-premium w-full"
                    disabled={registering}
                  />
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">
                    Estado
                  </label>
                  <select
                    value={estadoInput}
                    onChange={(e) => setEstadoInput(e.target.value as 'obtenido' | 'repetido')}
                    className="input-premium w-full"
                    disabled={registering}
                  >
                    <option value="obtenido">✅ Obtenido</option>
                    <option value="repetido">🔄 Repetido</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
                  disabled={registering}
                >
                  Cancelar
                </button>
                <button
                  onClick={registrarCromo}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-mundial-green to-mundial-cyan text-white shadow-glow-green transition-all duration-300 disabled:opacity-50"
                  disabled={registering || !cromoInput}
                >
                  {registering ? 'Registrando...' : 'Registrar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
