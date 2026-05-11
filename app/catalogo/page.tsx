'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Seleccion, Jugador } from '@/lib/types'
import { BANDERAS_POR_CODIGO, CONFEDERACION_COLORES, LIMIT_SELECCIONES } from '@/lib/constants'

const CONFEDERACIONES = [
  { id: 'todas', label: 'Todas', icon: '🌍', color: 'from-mundial-green to-mundial-cyan' },
  { id: 'CONCACAF', label: 'CONCACAF', icon: '🌎', color: 'from-green-500 to-emerald-700' },
  { id: 'CONMEBOL', label: 'CONMEBOL', icon: '⚽', color: 'from-yellow-500 to-amber-700' },
  { id: 'UEFA', label: 'UEFA', icon: '🇪🇺', color: 'from-blue-500 to-indigo-700' },
  { id: 'AFC', label: 'AFC', icon: '🌏', color: 'from-red-500 to-rose-700' },
  { id: 'CAF', label: 'CAF', icon: '🦁', color: 'from-orange-500 to-amber-700' },
  { id: 'OFC', label: 'OFC', icon: '🏝️', color: 'from-purple-500 to-fuchsia-700' },
]

const FALLBACK_SELECCIONES: Seleccion[] = [
  { id: 1, nombre: 'México', confederacion: 'CONCACAF', codigo_fifa: 'MEX', grupo: 'A', ranking_fifa: 15, participaciones: 17, mejor_resultado: 'Cuartos (1970, 1986)' },
  { id: 2, nombre: 'Brasil', confederacion: 'CONMEBOL', codigo_fifa: 'BRA', grupo: 'C', ranking_fifa: 5, participaciones: 22, mejor_resultado: 'Campeón (1958, 1962, 1970, 1994, 2002)' },
]

export default function CatalogoPage() {
  const [selecciones, setSelecciones] = useState<Seleccion[]>([])
  const [filtro, setFiltro] = useState('')
  const [confederacion, setConfederacion] = useState('todas')
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSeleccion, setModalSeleccion] = useState<Seleccion | null>(null)
  const [modalJugadores, setModalJugadores] = useState<Jugador[]>([])
  const [modalLoading, setModalLoading] = useState(false)

  useEffect(() => {
    loadSelecciones()
  }, [])

  const loadSelecciones = useCallback(async () => {
    if (!supabase) {
      setSelecciones(FALLBACK_SELECCIONES)
      setUsingFallback(true)
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('selecciones')
      .select('*')
      .order('orden_album', { ascending: true })
      .limit(LIMIT_SELECCIONES)

    if (error || !data || data.length === 0) {
      console.warn('Usando datos de demo:', error?.message)
      setSelecciones(FALLBACK_SELECCIONES)
      setUsingFallback(true)
    } else {
      setSelecciones(data)
    }
    setLoading(false)
  }, [])

  const loadJugadores = useCallback(async (seleccion: Seleccion) => {
    if (!supabase) return

    setModalLoading(true)
    const { data, error } = await supabase
      .from('jugadores')
      .select('*')
      .eq('seleccion_id', seleccion.id)
      .order('es_titular', { ascending: false })
      .order('posicion', { ascending: true })

    if (!error && data) {
      setModalJugadores(data)
    }
    setModalLoading(false)
  }, [])

  const abrirModal = (sel: Seleccion) => {
    setModalSeleccion(sel)
    setModalOpen(true)
    loadJugadores(sel)
  }

  const cerrarModal = () => {
    setModalOpen(false)
    setModalSeleccion(null)
    setModalJugadores([])
  }

  const seleccionesFiltradas = selecciones.filter((s) => {
    const matchNombre = s.nombre.toLowerCase().includes(filtro.toLowerCase())
    const matchConf = confederacion === 'todas' || s.confederacion === confederacion
    return matchNombre && matchConf
  })

  const getConfBadge = (conf: string) => {
    const colors = CONFEDERACION_COLORES[conf]
    return colors ? `${colors.bg} ${colors.text}` : 'badge-cyan'
  }

  const getFlag = (codigo: string) => BANDERAS_POR_CODIGO[codigo] || '⚽'

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
      <section className="relative pt-8 pb-12 container mx-auto px-4 lg:px-6">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="badge-cyan mx-auto mb-4 inline-flex">
            <span>📚</span>
            <span>Catálogo Oficial</span>
          </div>

          <h1 className="page-title">
            Las <span className="text-gradient">48 selecciones</span>
            <br />del Mundial 2026
          </h1>
          <p className="page-subtitle max-w-2xl mx-auto mt-4">
            Explora todos los equipos clasificados, conoce sus jugadores y descubre detalles
            de cada selección.
          </p>

          {usingFallback && (
            <div className="mt-6 max-w-md mx-auto badge-gold inline-flex">
              <span>⚡</span>
              <span>Modo Demo — Carga la BD para datos reales</span>
            </div>
          )}
        </div>
      </section>

      {/* Filtros */}
      <section className="container mx-auto px-4 lg:px-6 mb-8">
        <div className="max-w-6xl mx-auto glass-premium p-4 lg:p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {/* Búsqueda */}
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Buscar selección..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="input-premium pl-12 text-base"
            />
          </div>

          {/* Pills de confederaciones */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {CONFEDERACIONES.map((conf) => {
              const active = confederacion === conf.id
              return (
                <button
                  key={conf.id}
                  onClick={() => setConfederacion(conf.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    active
                      ? `bg-gradient-to-r ${conf.color} text-white shadow-glow-green`
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  <span className="text-base">{conf.icon}</span>
                  <span>{conf.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section className="container mx-auto px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white/80">
              {seleccionesFiltradas.length} {seleccionesFiltradas.length === 1 ? 'selección' : 'selecciones'}
            </h2>
            <div className="text-sm text-white/40 font-mono">
              {seleccionesFiltradas.length}/{selecciones.length}
            </div>
          </div>

          {seleccionesFiltradas.length === 0 ? (
            <div className="glass-premium p-10 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">No se encontraron selecciones</h3>
              <p className="text-white/50">Prueba con otra búsqueda o filtro</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {seleccionesFiltradas.map((sel, i) => (
                <article
                  key={sel.id}
                  className="glass-card-hover p-5 group animate-fade-in-up cursor-pointer"
                  style={{ animationDelay: `${Math.min(i * 30, 600)}ms` }}
                >
                  {/* Header con bandera y ranking */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-500 inline-block">
                        {getFlag(sel.codigo_fifa)}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-xs text-white/40 uppercase tracking-wider">FIFA</div>
                      <div className="text-2xl font-display font-black text-gradient-gold">
                        #{sel.ranking_fifa}
                      </div>
                    </div>
                  </div>

                  {/* Nombre */}
                  <h3 className="text-xl font-display font-black mb-1 group-hover:text-gradient transition-all">
                    {sel.nombre}
                  </h3>
                  <div className="text-xs text-white/40 font-mono mb-4 tracking-widest">
                    {sel.codigo_fifa}
                  </div>

                  {/* Info */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`badge ${getConfBadge(sel.confederacion)}`}>
                      {sel.confederacion}
                    </span>
                    {sel.grupo && sel.grupo !== '-' && (
                      <span className="badge-purple">
                        Grupo {sel.grupo}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/5">
                    <div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">
                        Mundiales
                      </div>
                      <div className="text-base font-bold text-white">
                        {sel.participaciones}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">
                        Cromos
                      </div>
                      <div className="text-base font-bold text-mundial-gold">20</div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <button
                    onClick={() => abrirModal(sel)}
                    className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-gradient-to-r hover:from-mundial-green/20 hover:to-mundial-cyan/20 border border-white/10 hover:border-mundial-green/40 transition-all duration-300 group-hover:text-mundial-green-light"
                  >
                    Ver jugadores →
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Volver */}
      <div className="text-center mt-12">
        <Link href="/" className="btn-ghost text-sm">
          ← Volver al inicio
        </Link>
      </div>

      {/* Modal de Jugadores */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-mundial-dark/95 backdrop-blur px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getFlag(modalSeleccion?.codigo_fifa || '')}</span>
                <div>
                  <h2 className="text-xl font-bold">{modalSeleccion?.nombre}</h2>
                  <p className="text-xs text-white/40">{modalSeleccion?.codigo_fifa} • Grupo {modalSeleccion?.grupo}</p>
                </div>
              </div>
              <button
                onClick={cerrarModal}
                className="text-white/60 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {modalLoading ? (
                <div className="flex justify-center py-8">
                  <div className="loader-premium"></div>
                </div>
              ) : modalJugadores.length === 0 ? (
                <div className="text-center py-8 text-white/50">
                  No hay jugadores cargados para este equipo
                </div>
              ) : (
                <div className="space-y-2">
                  {modalJugadores.map((jug) => (
                    <div
                      key={jug.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-white">
                          #{jug.numero} {jug.nombre} {jug.apellido}
                        </div>
                        <div className="text-xs text-white/50">
                          {jug.posicion} • {jug.club} • {jug.edad} años
                        </div>
                      </div>
                      {jug.es_titular && (
                        <span className="badge-gold text-xs">⭐ Titular</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
