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

const SECCIONES = [
  { id: 'intro', label: 'Introducción', range: '1-9', icon: '🌟', color: 'from-mundial-gold to-amber-700', count: 9 },
  { id: 'museo', label: 'Museo FIFA', range: '10-20', icon: '🏛️', color: 'from-purple-500 to-fuchsia-700', count: 11 },
  { id: 'grupoA', label: 'Grupo A', range: '21-100', icon: '🔵', color: 'from-blue-500 to-blue-700', count: 80 },
  { id: 'grupoB', label: 'Grupo B', range: '101-180', icon: '🔴', color: 'from-red-500 to-red-700', count: 80 },
  { id: 'grupoC', label: 'Grupo C', range: '181-260', icon: '🟢', color: 'from-green-500 to-green-700', count: 80 },
  { id: 'grupoD', label: 'Grupo D', range: '261-340', icon: '🟡', color: 'from-yellow-500 to-amber-700', count: 80 },
  { id: 'grupoE', label: 'Grupo E', range: '341-420', icon: '🟣', color: 'from-purple-500 to-purple-700', count: 80 },
  { id: 'grupoF', label: 'Grupo F', range: '421-500', icon: '🟠', color: 'from-orange-500 to-orange-700', count: 80 },
  { id: 'grupoG', label: 'Grupo G', range: '501-580', icon: '🔷', color: 'from-cyan-500 to-cyan-700', count: 80 },
  { id: 'grupoH', label: 'Grupo H', range: '581-660', icon: '🟦', color: 'from-indigo-500 to-indigo-700', count: 80 },
  { id: 'grupoI', label: 'Grupo I', range: '661-740', icon: '🔶', color: 'from-rose-500 to-rose-700', count: 80 },
  { id: 'grupoJ', label: 'Grupo J', range: '741-820', icon: '⬛', color: 'from-gray-500 to-gray-700', count: 80 },
  { id: 'grupoK', label: 'Grupo K', range: '821-900', icon: '🟫', color: 'from-amber-700 to-amber-900', count: 80 },
  { id: 'grupoL', label: 'Grupo L', range: '901-980', icon: '⬜', color: 'from-slate-400 to-slate-700', count: 80 },
]

export default function AlbumPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<AlbumStats>({ obtenidos: 0, total: 980, porcentaje: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
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
    init()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="loader-premium"></div>
      </main>
    )
  }

  const radius = 90
  const circumference = 2 * Math.PI * radius
  const strokeOffset = circumference - (stats.porcentaje / 100) * circumference

  return (
    <main className="min-h-screen pb-20">
      {/* Hero */}
      <section className="container mx-auto px-4 lg:px-6 pt-8 pb-12">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="badge-gold inline-flex mb-4">
            <span>📖</span>
            <span>Tu Álbum Personal</span>
          </div>
          <h1 className="page-title">
            Mi <span className="text-gradient-gold">Álbum</span> Mundial 2026
          </h1>
          <p className="page-subtitle max-w-2xl mx-auto mt-4">
            Visualiza tu progreso, descubre cuántos cromos te faltan y completa tu colección.
          </p>
        </div>
      </section>

      {/* Progress Ring Hero */}
      <section className="container mx-auto px-4 lg:px-6 mb-12">
        <div className="max-w-5xl mx-auto glass-premium p-6 lg:p-10 animate-scale-in">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Progress Ring */}
            <div className="flex justify-center">
              <div className="relative w-56 h-56 lg:w-64 lg:h-64">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="14"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    filter="url(#glow)"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl lg:text-6xl font-display font-black text-gradient">
                    {stats.porcentaje}%
                  </div>
                  <div className="text-xs lg:text-sm text-white/50 uppercase tracking-widest mt-1">
                    Completado
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div>
              <h2 className="text-2xl font-display font-bold mb-6">
                Tu progreso de <span className="text-gradient-gold">colección</span>
              </h2>

              <div className="space-y-4">
                <div className="stat-card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mundial-green to-emerald-700 flex items-center justify-center shadow-glow-green">
                      <span className="text-xl">✅</span>
                    </div>
                    <div>
                      <div className="text-xs text-white/50 uppercase tracking-wider">Obtenidos</div>
                      <div className="text-xl font-display font-bold">{stats.obtenidos}</div>
                    </div>
                  </div>
                  <div className="text-3xl font-display font-black text-mundial-green-light">
                    {stats.obtenidos}
                  </div>
                </div>

                <div className="stat-card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mundial-gold to-amber-700 flex items-center justify-center shadow-glow-gold">
                      <span className="text-xl">⏳</span>
                    </div>
                    <div>
                      <div className="text-xs text-white/50 uppercase tracking-wider">Faltantes</div>
                      <div className="text-xl font-display font-bold">{stats.total - stats.obtenidos}</div>
                    </div>
                  </div>
                  <div className="text-3xl font-display font-black text-mundial-gold-light">
                    {stats.total - stats.obtenidos}
                  </div>
                </div>

                <div className="stat-card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mundial-cyan to-blue-700 flex items-center justify-center shadow-glow-cyan">
                      <span className="text-xl">🎯</span>
                    </div>
                    <div>
                      <div className="text-xs text-white/50 uppercase tracking-wider">Total</div>
                      <div className="text-xl font-display font-bold">{stats.total}</div>
                    </div>
                  </div>
                  <div className="text-3xl font-display font-black text-cyan-300">
                    {stats.total}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secciones del álbum */}
      <section className="container mx-auto px-4 lg:px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">
              Secciones del <span className="text-gradient">Álbum</span>
            </h2>
            <div className="text-sm text-white/40 font-mono hidden sm:block">
              14 secciones · 980 cromos
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {SECCIONES.map((sec, i) => (
              <button
                key={sec.id}
                className="group glass-card-hover p-4 text-left animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i * 30, 400)}ms` }}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sec.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                  <span className="text-lg">{sec.icon}</span>
                </div>
                <div className="text-sm font-bold mb-1 group-hover:text-gradient transition-all">
                  {sec.label}
                </div>
                <div className="text-[10px] text-white/40 font-mono">
                  #{sec.range}
                </div>
                <div className="text-[10px] text-white/60 mt-1">
                  {sec.count} cromos
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Próximamente */}
      <section className="container mx-auto px-4 lg:px-6">
        <div className="max-w-4xl mx-auto glass-premium p-6 lg:p-8 relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 right-0 w-64 h-64 bg-mundial-purple/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-mundial-cyan/20 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="badge-purple inline-flex mb-4">
              <span>🚀</span>
              <span>Próximamente</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-black mb-3">
              Visualización 3D <span className="text-gradient">tipo libro</span>
            </h3>
            <p className="text-white/60 leading-relaxed mb-6 max-w-2xl">
              Pronto podrás ver tu álbum como un libro real con efecto 3D al pasar páginas,
              cromos holográficos brillantes y animaciones espectaculares.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: '📖', label: 'Pasar páginas' },
                { icon: '✨', label: 'Holográfico' },
                { icon: '🎨', label: 'Animaciones' },
                { icon: '🔥', label: 'Efectos foil' },
              ].map((f) => (
                <div key={f.label} className="glass-card p-3 text-center">
                  <div className="text-2xl mb-1">{f.icon}</div>
                  <div className="text-xs text-white/60">{f.label}</div>
                </div>
              ))}
            </div>
          </div>
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
