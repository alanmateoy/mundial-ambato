'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

interface Perfil {
  id: string
  email: string
  nombre: string
  whatsapp: string
  ciudad: string
}

export default function PerfilPage() {
  const [user, setUser] = useState<User | null>(null)
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [nombre, setNombre] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [ciudad, setCiudad] = useState('Ambato')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'error' | 'success' | null>(null)
  const [stats, setStats] = useState({ obtenidos: 0, repetidos: 0, intercambios: 0 })

  useEffect(() => {
    loadUserAndProfile()
  }, [])

  const loadUserAndProfile = async () => {
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
      .from('perfiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setPerfil(data as any)
      setNombre((data as any).nombre || '')
      setWhatsapp((data as any).whatsapp || '')
      setCiudad((data as any).ciudad || 'Ambato')
    }

    // Stats
    const { data: cromos } = await supabase
      .from('usuario_cromos')
      .select('estado')
      .eq('usuario_id', user.id)

    const { data: inters } = await supabase
      .from('intercambios')
      .select('id')
      .eq('usuario_ofrece_id', user.id)

    setStats({
      obtenidos: cromos?.filter((c: any) => c.estado === 'obtenido').length || 0,
      repetidos: cromos?.filter((c: any) => c.estado === 'repetido').length || 0,
      intercambios: inters?.length || 0,
    })

    setLoading(false)
  }

  const guardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setMessageType(null)

    if (!supabase || !user) return

    if (whatsapp && !/^\d{10,}$/.test(whatsapp)) {
      setMessage('WhatsApp debe ser un número válido sin símbolos (ej: 593999999999)')
      setMessageType('error')
      setSaving(false)
      return
    }
    if (!nombre.trim()) {
      setMessage('El nombre es requerido')
      setMessageType('error')
      setSaving(false)
      return
    }

    const { error } = await supabase.from('perfiles').upsert({
      id: user.id,
      email: user.email,
      nombre,
      whatsapp,
      ciudad,
    })

    if (error) {
      setMessage('Error al guardar: ' + error.message)
      setMessageType('error')
    } else {
      setMessage('¡Perfil actualizado con éxito!')
      setMessageType('success')
      loadUserAndProfile()
      setTimeout(() => setMessage(''), 3000)
    }
    setSaving(false)
  }

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut()
    window.location.href = '/login'
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
      <section className="container mx-auto px-4 lg:px-6 pt-8 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Avatar Hero */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-mundial-green to-mundial-cyan rounded-full blur-2xl opacity-60 animate-pulse"></div>
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-mundial-green via-mundial-cyan to-mundial-purple flex items-center justify-center shadow-glow-strong border-4 border-white/10">
                <span className="text-5xl font-display font-black text-white">
                  {(nombre || user?.email || 'U')[0].toUpperCase()}
                </span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-black mb-1">
              {nombre || 'Coleccionista'}
            </h1>
            <p className="text-sm text-white/50">{user?.email}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="stat-card text-center">
              <div className="text-3xl mb-1">✅</div>
              <div className="text-2xl font-display font-black text-mundial-green-light">
                {stats.obtenidos}
              </div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider">Obtenidos</div>
            </div>
            <div className="stat-card text-center">
              <div className="text-3xl mb-1">🔄</div>
              <div className="text-2xl font-display font-black text-cyan-300">
                {stats.repetidos}
              </div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider">Repetidos</div>
            </div>
            <div className="stat-card text-center">
              <div className="text-3xl mb-1">🤝</div>
              <div className="text-2xl font-display font-black text-mundial-gold-light">
                {stats.intercambios}
              </div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider">Intercambios</div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={guardarPerfil}
            className="glass-premium p-6 lg:p-8 space-y-5 animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mundial-cyan to-mundial-purple flex items-center justify-center shadow-glow-cyan">
                <span className="text-xl">⚙️</span>
              </div>
              <div>
                <h2 className="text-xl font-display font-bold">Información personal</h2>
                <p className="text-xs text-white/50">Mantén tus datos actualizados</p>
              </div>
            </div>

            {message && (
              <div
                className={`p-3 rounded-xl text-sm text-center backdrop-blur-md border animate-fade-in ${
                  messageType === 'error'
                    ? 'bg-red-500/10 border-red-500/30 text-red-300'
                    : 'bg-mundial-green/10 border-mundial-green/30 text-mundial-green-light'
                }`}
              >
                {messageType === 'error' ? '⚠️' : '✅'} {message}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input-premium opacity-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                Nombre
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">👤</span>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="input-premium pl-12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                WhatsApp
                <span className="text-white/40 ml-2 normal-case">(con código de país)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">📱</span>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="593999999999"
                  className="input-premium pl-12"
                />
              </div>
              <p className="text-[10px] text-white/40 mt-1">
                Solo números, sin espacios ni símbolos
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                Ciudad
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">📍</span>
                <input
                  type="text"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="input-premium pl-12"
                />
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Guardando...
                </>
              ) : (
                <>
                  Guardar cambios
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Logout */}
          <div className="mt-6 text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <button
              onClick={handleLogout}
              className="text-white/40 hover:text-red-400 text-sm transition-colors flex items-center gap-2 mx-auto"
            >
              <span>🚪</span>
              Cerrar sesión
            </button>
          </div>

          <div className="text-center mt-8">
            <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
