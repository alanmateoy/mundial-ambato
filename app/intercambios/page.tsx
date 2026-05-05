'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import type { Session } from '@supabase/supabase-js'

interface Intercambio {
  id: number
  usuario_ofrece_id: string
  cromo_ofrecido_id: number
  cromo_buscado_id: number
  estado: string
  ubicacion: string
  notas: string
  perfiles: { nombre: string; whatsapp: string }
  cromo_ofrecido: { numero_cromo: number; jugadores: { nombre: string; apellido: string } }
  cromo_buscado: { numero_cromo: number; jugadores: { nombre: string; apellido: string } }
}

export default function IntercambiosPage() {
  const [user, setUser] = useState<any>(null)
  const [intercambios, setIntercambios] = useState<Intercambio[]>([])
  const [misCromos, setMisCromos] = useState<any[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cromoOfrecido, setCromoOfrecido] = useState('')
  const [cromoBuscado, setCromoBuscado] = useState('')
  const [ubicacion, setUbicacion] = useState('Ambato')
  const [notas, setNotas] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    if (!supabase) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    setUser(user)
    loadMisCromos(user.id)
    loadIntercambios()
  }

  const loadMisCromos = async (userId: string) => {
    if (!supabase) return
    const { data } = await supabase
      .from('usuario_cromos')
      .select(`id, cromo_id, estado, cromos(numero_cromo, jugadores(nombre, apellido))`)
      .eq('usuario_id', userId)
      .eq('estado', 'repetido')
    if (data) setMisCromos(data)
  }

  const loadIntercambios = async () => {
    if (!supabase) return
    const { data } = await supabase
      .from('intercambios')
      .select(`
        id, usuario_ofrece_id, cromo_ofrecido_id, cromo_buscado_id, estado, ubicacion, notas,
        perfiles(nombre, whatsapp),
        cromo_ofrecido:cromos!cromo_ofrecido_id(numero_cromo, jugadores(nombre, apellido)),
        cromo_buscado:cromos!cromo_buscado_id(numero_cromo, jugadores(nombre, apellido))
      `)
      .eq('estado', 'abierto')
      .order('created_at', { ascending: false })
    if (data) setIntercambios(data as any[])
  }

  const crearIntercambio = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !cromoOfrecido || !cromoBuscado) return
    if (!supabase) return

    const { error } = await supabase.from('intercambios').insert({
      usuario_ofrece_id: user.id,
      cromo_ofrecido_id: parseInt(cromoOfrecido),
      cromo_buscado_id: parseInt(cromoBuscado),
      ubicacion,
      notas,
      estado: 'abierto'
    })

    if (!error) {
      setMostrarForm(false)
      setCromoOfrecido('')
      setCromoBuscado('')
      setNotas('')
      loadIntercambios()
    }
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-gradient-to-b from-mundial-green to-green-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <Link href="/" className="text-white/80 hover:text-white mb-4 inline-block">← Volver</Link>
          <h1 className="text-4xl font-display font-bold mb-2">🔄 Intercambios en Ambato</h1>
          <p className="text-xl">Encuentra personas con quien cambiar tus cromos repetidos</p>
        </header>

        <div className="max-w-4xl mx-auto mb-8">
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="mundial-btn-gold w-full md:w-auto"
          >
            {mostrarForm ? 'Cancelar' : '+ Crear nueva oferta de intercambio'}
          </button>

          {mostrarForm && (
            <form onSubmit={crearIntercambio} className="mt-4 bg-white/10 backdrop-blur rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold mb-4">Nueva oferta de intercambio</h2>
              
              <div>
                <label className="block mb-2">Tu cromo repetido (que ofreces):</label>
                <select
                  value={cromoOfrecido}
                  onChange={(e) => setCromoOfrecido(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30"
                  required
                >
                  <option value="">Selecciona un cromo repetido</option>
                  {misCromos.map((c: any) => (
                    <option key={c.id} value={c.cromo_id}>
                      #{c.cromos.numero_cromo} - {c.cromos.jugadores.nombre} {c.cromos.jugadores.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Cromo que buscas:</label>
                <input
                  type="number"
                  placeholder="Número del cromo que buscas"
                  value={cromoBuscado}
                  onChange={(e) => setCromoBuscado(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Lugar de encuentro sugerido:</label>
                <input
                  type="text"
                  placeholder="Ej: Parque Montalvo, Mall del Centro..."
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30"
                />
              </div>

              <div>
                <label className="block mb-2">Notas adicionales:</label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30"
                  rows={3}
                  placeholder="Horario preferido, condiciones, etc."
                />
              </div>

              <button type="submit" className="mundial-btn w-full">
                Publicar oferta
              </button>
            </form>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {intercambios.filter((i: Intercambio) => i.usuario_ofrece_id !== user?.id).map((inter: Intercambio) => (
            <div key={inter.id} className="mundial-card p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                  {inter.estado}
                </span>
                <span className="text-sm text-white/60">{inter.ubicacion}</span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-xs text-white/60">OFRECE:</p>
                  <p className="font-bold">#{inter.cromo_ofrecido.numero_cromo} - {inter.cromo_ofrecido.jugadores.nombre} {inter.cromo_ofrecido.jugadores.apellido}</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-xs text-white/60">BUSCA:</p>
                  <p className="font-bold">#{inter.cromo_buscado.numero_cromo}</p>
                </div>
              </div>

              {inter.notas && (
                <p className="text-sm text-white/80 mb-4 italic">"{inter.notas}"</p>
              )}

              <div className="border-t border-white/20 pt-4">
                <p className="text-sm mb-2">Contacto: {inter.perfiles.nombre}</p>
                {inter.perfiles.whatsapp && (
                  <a
                    href={`https://wa.me/${inter.perfiles.whatsapp}`}
                    target="_blank"
                    rel="noopener"
                    className="mundial-btn w-full text-center block"
                  >
                    Contactar por WhatsApp
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {intercambios.filter((i: Intercambio) => i.usuario_ofrece_id !== user?.id).length === 0 && (
          <p className="text-center text-white/60 mt-8">
            No hay ofertas de intercambio disponibles en este momento.
          </p>
        )}
      </div>
    </main>
  )
}
