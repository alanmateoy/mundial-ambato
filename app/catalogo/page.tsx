'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Seleccion {
  id: number
  nombre: string
  confederacion: string
  codigo_fifa: string
  grupo: string
  ranking_fifa: number
  participaciones: number
}

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
  { id: 1, nombre: 'México', confederacion: 'CONCACAF', codigo_fifa: 'MEX', grupo: 'A', ranking_fifa: 15, participaciones: 17 },
  { id: 2, nombre: 'Brasil', confederacion: 'CONMEBOL', codigo_fifa: 'BRA', grupo: 'C', ranking_fifa: 5, participaciones: 22 },
  { id: 3, nombre: 'Argentina', confederacion: 'CONMEBOL', codigo_fifa: 'ARG', grupo: 'J', ranking_fifa: 1, participaciones: 18 },
  { id: 4, nombre: 'España', confederacion: 'UEFA', codigo_fifa: 'ESP', grupo: 'H', ranking_fifa: 2, participaciones: 16 },
  { id: 5, nombre: 'Francia', confederacion: 'UEFA', codigo_fifa: 'FRA', grupo: 'I', ranking_fifa: 4, participaciones: 16 },
  { id: 6, nombre: 'Alemania', confederacion: 'UEFA', codigo_fifa: 'GER', grupo: 'E', ranking_fifa: 3, participaciones: 20 },
  { id: 7, nombre: 'Portugal', confederacion: 'UEFA', codigo_fifa: 'POR', grupo: 'K', ranking_fifa: 7, participaciones: 8 },
  { id: 8, nombre: 'Inglaterra', confederacion: 'UEFA', codigo_fifa: 'ENG', grupo: 'L', ranking_fifa: 4, participaciones: 16 },
  { id: 9, nombre: 'Bélgica', confederacion: 'UEFA', codigo_fifa: 'BEL', grupo: 'G', ranking_fifa: 8, participaciones: 14 },
  { id: 10, nombre: 'Países Bajos', confederacion: 'UEFA', codigo_fifa: 'NED', grupo: 'F', ranking_fifa: 6, participaciones: 11 },
  { id: 11, nombre: 'Italia', confederacion: 'UEFA', codigo_fifa: 'ITA', grupo: '-', ranking_fifa: 10, participaciones: 18 },
  { id: 12, nombre: 'Croacia', confederacion: 'UEFA', codigo_fifa: 'CRO', grupo: 'L', ranking_fifa: 11, participaciones: 6 },
  { id: 13, nombre: 'Uruguay', confederacion: 'CONMEBOL', codigo_fifa: 'URU', grupo: 'H', ranking_fifa: 14, participaciones: 14 },
  { id: 14, nombre: 'Ecuador', confederacion: 'CONMEBOL', codigo_fifa: 'ECU', grupo: 'E', ranking_fifa: 31, participaciones: 4 },
  { id: 15, nombre: 'Estados Unidos', confederacion: 'CONCACAF', codigo_fifa: 'USA', grupo: 'D', ranking_fifa: 16, participaciones: 11 },
  { id: 16, nombre: 'Canadá', confederacion: 'CONCACAF', codigo_fifa: 'CAN', grupo: 'B', ranking_fifa: 28, participaciones: 3 },
  { id: 17, nombre: 'Marruecos', confederacion: 'CAF', codigo_fifa: 'MAR', grupo: 'C', ranking_fifa: 12, participaciones: 6 },
  { id: 18, nombre: 'Senegal', confederacion: 'CAF', codigo_fifa: 'SEN', grupo: 'I', ranking_fifa: 18, participaciones: 4 },
  { id: 19, nombre: 'Japón', confederacion: 'AFC', codigo_fifa: 'JPN', grupo: 'F', ranking_fifa: 18, participaciones: 7 },
  { id: 20, nombre: 'Corea del Sur', confederacion: 'AFC', codigo_fifa: 'KOR', grupo: 'A', ranking_fifa: 23, participaciones: 11 },
]

export default function CatalogoPage() {
  const [selecciones, setSelecciones] = useState<Seleccion[]>([])
  const [filtro, setFiltro] = useState('')
  const [confederacion, setConfederacion] = useState('todas')
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    loadSelecciones()
  }, [])

  const loadSelecciones = async () => {
    if (!supabase) {
      setSelecciones(FALLBACK_SELECCIONES)
      setUsingFallback(true)
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('selecciones')
      .select('*')
      .order('ranking_fifa', { ascending: true })

    if (error || !data || data.length === 0) {
      console.warn('Usando datos de demo:', error?.message)
      setSelecciones(FALLBACK_SELECCIONES)
      setUsingFallback(true)
    } else {
      setSelecciones(data)
    }
    setLoading(false)
  }

  const seleccionesFiltradas = selecciones.filter((s) => {
    const matchNombre = s.nombre.toLowerCase().includes(filtro.toLowerCase())
    const matchConf = confederacion === 'todas' || s.confederacion === confederacion
    return matchNombre && matchConf
  })

  const getConfBadge = (conf: string) => {
    const map: Record<string, string> = {
      CONCACAF: 'badge-green',
      CONMEBOL: 'badge-gold',
      UEFA: 'badge-cyan',
      AFC: 'badge-purple',
      CAF: 'badge-gold',
      OFC: 'badge-purple',
    }
    return map[conf] || 'badge-cyan'
  }

  const getFlag = (codigo: string) => {
    const flags: Record<string, string> = {
      MEX: '🇲🇽', BRA: '🇧🇷', ARG: '🇦🇷', ESP: '🇪🇸', FRA: '🇫🇷',
      GER: '🇩🇪', POR: '🇵🇹', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', BEL: '🇧🇪', NED: '🇳🇱',
      ITA: '🇮🇹', CRO: '🇭🇷', URU: '🇺🇾', ECU: '🇪🇨', USA: '🇺🇸',
      CAN: '🇨🇦', MAR: '🇲🇦', SEN: '🇸🇳', JPN: '🇯🇵', KOR: '🇰🇷',
      RSA: '🇿🇦', CZE: '🇨🇿', BIH: '🇧🇦', QAT: '🇶🇦', SUI: '🇨🇭',
      HAI: '🇭🇹', SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', PAR: '🇵🇾', AUS: '🇦🇺', TUR: '🇹🇷',
      CUW: '🇨🇼', CIV: '🇨🇮', TUN: '🇹🇳', SWE: '🇸🇪', EGY: '🇪🇬',
      IRN: '🇮🇷', NZL: '🇳🇿', CPV: '🇨🇻', KSA: '🇸🇦', IRQ: '🇮🇶',
      NOR: '🇳🇴', ALG: '🇩🇿', AUT: '🇦🇹', JOR: '🇯🇴', COD: '🇨🇩',
      UZB: '🇺🇿', COL: '🇨🇴', GHA: '🇬🇭', PAN: '🇵🇦',
    }
    return flags[codigo] || '⚽'
  }

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
                    <span className={getConfBadge(sel.confederacion)}>
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
                  <button className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-gradient-to-r hover:from-mundial-green/20 hover:to-mundial-cyan/20 border border-white/10 hover:border-mundial-green/40 transition-all duration-300 group-hover:text-mundial-green-light">
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
    </main>
  )
}
