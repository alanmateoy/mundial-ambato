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

  useEffect(() => {
    loadUserAndProfile()
  }, [])

  const loadUserAndProfile = async () => {
    if (!supabase) return
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    setUser(user)

    const { data, error } = await supabase
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
    setLoading(false)
  }

  const guardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    if (!supabase || !user) return

    if (whatsapp && !/^\d{10,}$/.test(whatsapp)) {
      setMessage('WhatsApp debe ser un número válido sin símbolos (ej: 593999999999)')
      setSaving(false)
      return
    }

    if (!nombre.trim()) {
      setMessage('El nombre es requerido')
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from('perfiles')
      .upsert({
        id: user.id,
        email: user.email,
        nombre,
        whatsapp,
        ciudad
      })

    if (error) {
      setMessage('Error al guardar: ' + error.message)
    } else {
      setMessage('¡Perfil actualizado con éxito!')
      loadUserAndProfile()
    }
    setSaving(false)
  }

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>

  return (
    <main className="min-h-screen bg-gradient-to-b from-mundial-green to-green-800 text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="mb-8">
          <Link href="/" className="text-white/80 hover:text-white mb-4 inline-block">← Volver</Link>
          <h1 className="text-4xl font-display font-bold mb-2">👤 Mi Perfil</h1>
        </header>

        <form onSubmit={guardarPerfil} className="bg-white/10 backdrop-blur rounded-xl p-6 space-y-4">
          <div>
            <label className="block mb-2">Correo electrónico:</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white/60"
            />
          </div>

          <div>
            <label className="block mb-2">Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-mundial-gold outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2">WhatsApp (con código de país, ej: 593999999999):</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="593999999999"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-mundial-gold outline-none"
            />
          </div>

          <div>
            <label className="block mb-2">Ciudad:</label>
            <input
              type="text"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-mundial-gold outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mundial-btn w-full"
          >
            {saving ? 'Guardando...' : 'Guardar Perfil'}
          </button>

          {message && (
            <p className={`text-center ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
              {message}
            </p>
          )}
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="text-white/60 hover:text-white underline"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </main>
  )
}
