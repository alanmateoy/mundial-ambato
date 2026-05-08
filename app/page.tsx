'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

interface Stats {
  obtenidos: number
  total: number
  porcentaje: number
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({ obtenidos: 0, total: 980, porcentaje: 0 })
  const [nombre, setNombre] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      if (!supabase) {
        setLoading(false)
        return
      }
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Cargar nombre del perfil
        const { data: perfil } = await supabase
          .from('perfiles')
          .select('nombre')
          .eq('id', user.id)
          .single()
        if (perfil) setNombre((perfil as any).nombre || user.email?.split('@')[0] || '')

        // Cargar estadísticas
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
      }
      setLoading(false)
    }
    checkUser()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="loader-premium"></div>
      </main>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const modules = [
    {
      href: '/album',
      icon: '📖',
      title: 'Mi Álbum',
      description: 'Visualiza tu progreso del Mundial 2026',
      gradient: 'from-mundial-green to-emerald-700',
      glow: 'shadow-glow-green',
      accent: 'mundial-green',
    },
    {
      href: '/catalogo',
      icon: '🌍',
      title: 'Catálogo',
      description: 'Explora los 48 equipos y todos los jugadores',
      gradient: 'from-mundial-cyan to-blue-700',
      glow: 'shadow-glow-cyan',
      accent: 'mundial-cyan',
    },
    {
      href: '/mis-cromos',
      icon: '🎴',
      title: 'Mis Cromos',
      description: 'Registra obtenidos y repetidos',
      gradient: 'from-mundial-gold to-amber-700',
      glow: 'shadow-glow-gold',
      accent: 'mundial-gold',
    },
    {
      href: '/intercambios',
      icon: '🔄',
      title: 'Intercambios',
      description: 'Conecta con coleccionistas en Ambato',
      gradient: 'from-mundial-purple to-purple-800',
      glow: 'shadow-glow-purple',
      accent: 'mundial-purple',
    },
  ]

  return (
    <main className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative pt-8 lg:pt-16 pb-12 lg:pb-20">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Welcome */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mundial-green/10 border border-mundial-green/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-mundial-green animate-pulse"></span>
              <span className="text-xs font-medium text-mundial-green-light tracking-wider uppercase">
                Bienvenido{nombre ? `, ${nombre}` : ''}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-4 leading-none">
              <span className="text-gradient">Mundial</span>
              <br />
              <span className="text-white">Ambato 2026</span>
            </h1>

            <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto mt-6 leading-relaxed">
              Colecciona los <span className="text-mundial-gold font-bold">980 cromos</span> oficiales,
              encuentra repetidos y conecta con la comunidad coleccionista de Ambato.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Link href="/album" className="btn-primary">
                <span>Ver mi álbum</span>
                <span>→</span>
              </Link>
              <Link href="/catalogo" className="btn-ghost">
                Explorar catálogo
              </Link>
            </div>
          </div>

          {/* Stats Hero */}
          <div className="max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="glass-premium p-6 lg:p-8">
              <div className="grid grid-cols-3 gap-4 lg:gap-6">
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-display font-black text-gradient mb-1">
                    {stats.obtenidos}
                  </div>
                  <div className="text-xs md:text-sm text-white/60 uppercase tracking-wider">
                    Obtenidos
                  </div>
                </div>
                <div className="text-center border-x border-white/10">
                  <div className="text-3xl md:text-5xl font-display font-black text-gradient-gold mb-1">
                    {stats.porcentaje}%
                  </div>
                  <div className="text-xs md:text-sm text-white/60 uppercase tracking-wider">
                    Completado
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-display font-black text-white mb-1">
                    {stats.total - stats.obtenidos}
                  </div>
                  <div className="text-xs md:text-sm text-white/60 uppercase tracking-wider">
                    Faltantes
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-white/50 uppercase tracking-wider">Progreso del álbum</span>
                  <span className="text-xs text-white/70 font-mono">
                    {stats.obtenidos}/{stats.total}
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.max(stats.porcentaje, 1)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module Cards */}
      <section className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-black mb-2">
            Explora la <span className="text-gradient">app</span>
          </h2>
          <p className="text-white/50 text-sm">Todo lo que necesitas para tu colección</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-7xl mx-auto">
          {modules.map((mod, i) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="group glass-card-hover p-6 animate-fade-in-up"
              style={{ animationDelay: `${i * 100 + 300}ms` }}
            >
              <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.gradient} ${mod.glow} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
                <span className="text-2xl">{mod.icon}</span>
              </div>

              <h3 className="text-xl font-display font-bold mb-2 group-hover:text-gradient transition-all">
                {mod.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                {mod.description}
              </p>

              <div className="flex items-center gap-2 text-sm font-medium text-white/80 group-hover:text-mundial-green-light transition-colors">
                <span>Ir ahora</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-4 lg:px-6 mt-16">
        <div className="max-w-4xl mx-auto glass-premium p-6 lg:p-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="badge-gold mb-4">
                <span>🌟</span>
                <span>Comunidad Ambato</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-black mb-3">
                Conecta con coleccionistas <span className="text-gradient-gold">cerca de ti</span>
              </h3>
              <p className="text-white/60 leading-relaxed mb-4">
                Encuentra a otros coleccionistas en Ambato, intercambia tus repetidos
                y completa tu álbum más rápido. Usa WhatsApp para coordinar encuentros.
              </p>
              <Link href="/intercambios" className="btn-gold text-sm">
                Ver intercambios
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '📍', label: 'Mapa local' },
                { icon: '💬', label: 'WhatsApp' },
                { icon: '🤝', label: 'Match auto' },
                { icon: '⭐', label: 'Reputación' },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className="glass-card p-4 text-center animate-scale-in"
                  style={{ animationDelay: `${i * 100 + 600}ms` }}
                >
                  <div className="text-3xl mb-1">{item.icon}</div>
                  <div className="text-xs text-white/60">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer pequeño */}
      <div className="text-center mt-16 text-white/30 text-xs">
        🏆 Mundial Ambato 2026 — Hecho con ❤️ para la comunidad
      </div>
    </main>
  )
}
