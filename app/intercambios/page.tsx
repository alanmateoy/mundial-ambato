'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LIMIT_INTERCAMBIOS, LIMIT_USUARIO_CROMOS, CIUDAD_PREDETERMINADA } from '@/lib/constants'
import type { User } from '@supabase/supabase-js'
import type { Intercambio, UsuarioCromo } from '@/lib/types'

export default function IntercambiosPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [intercambios, setIntercambios] = useState<Intercambio[]>([])
  const [misCromos, setMisCromos] = useState<UsuarioCromo[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cromoOfrecido, setCromoOfrecido] = useState('')
  const [cromoBuscado, setCromoBuscado] = useState('')
  const [ubicacion, setUbicacion] = useState(CIUDAD_PREDETERMINADA)
  const [notas, setNotas] = useState('')
  const [loadingInter, setLoadingInter] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadMisCromos = useCallback(async (userId: string) => {
    if (!supabase) return
    const { data } = await supabase
      .from('usuario_cromos')
      .select(`id, cromo_id, estado, cromos(numero_cromo, jugadores(nombre, apellido))`)
      .eq('usuario_id', userId)
      .eq('estado', 'repetido')
      .limit(LIMIT_USUARIO_CROMOS)
    if (data) setMisCromos(data as any)
  }, [])

  const loadIntercambios = useCallback(async () => {
    if (!supabase) {
      setLoadingInter(false)
      return
    }
    setLoadingInter(true)
    setError('')
    const { data, error: err } = await supabase
      .from('intercambios')
      .select(`
        id, usuario_ofrece_id, cromo_ofrecido_id, cromo_buscado_id, estado, ubicacion, notas,
        perfiles(nombre, whatsapp),
        cromo_ofrecido:cromos!cromo_ofrecido_id(numero_cromo, jugadores(nombre, apellido)),
        cromo_buscado:cromos!cromo_buscado_id(numero_cromo, jugadores(nombre, apellido))
      `)
      .eq('estado', 'abierto')
      .order('created_at', { ascending: false })
      .limit(LIMIT_INTERCAMBIOS)

    if (err) {
      setError('Error cargando intercambios: ' + err.message)
    } else if (data) {
      setIntercambios(data as Intercambio[])
    }
    setLoadingInter(false)
  }, [])

  const checkUser = useCallback(async () => {
    if (!supabase) {
      setLoadingInter(false)
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)
  }, [router])

  useEffect(() => {
    checkUser()
  }, [checkUser])

  useEffect(() => {
    if (user) {
      loadMisCromos(user.id)
      loadIntercambios()
    }
  }, [user, loadMisCromos, loadIntercambios])

  const crearIntercambio = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!user || !cromoOfrecido || !cromoBuscado) {
      setError('Debes seleccionar ambos cromos')
      return
    }
    if (!supabase) return

    const cromoBuscadoNum = parseInt(cromoBuscado)
    if (isNaN(cromoBuscadoNum) || cromoBuscadoNum < 1 || cromoBuscadoNum > 980) {
      setError('El número de cromo debe estar entre 1 y 980')
      return
    }

    const { error } = await supabase.from('intercambios').insert({
      usuario_ofrece_id: user.id,
      cromo_ofrecido_id: parseInt(cromoOfrecido),
      cromo_buscado_id: cromoBuscadoNum,
      ubicacion,
      notas,
      estado: 'abierto',
    })

    if (error) {
      setError('Error al crear intercambio: ' + error.message)
    } else {
      setMostrarForm(false)
      setCromoOfrecido('')
      setCromoBuscado('')
      setNotas('')
      setSuccess('¡Intercambio publicado!')
      loadIntercambios()
      setTimeout(() => setSuccess(''), 3000)
    }
  }, [user, cromoOfrecido, cromoBuscado, ubicacion, notas, loadIntercambios])

  if (!user && !loadingInter) return null

  const intercambiosVisibles = intercambios.filter((i) => i.usuario_ofrece_id !== user?.id)

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <section className="container mx-auto px-4 lg:px-6 pt-8 pb-12">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="badge-purple inline-flex mb-4">
            <span>🔄</span>
            <span>Comunidad Ambato</span>
          </div>
          <h1 className="page-title">
            <span className="text-gradient">Intercambios</span>
          </h1>
          <p className="page-subtitle max-w-2xl mx-auto mt-4">
            Conecta con coleccionistas en Ambato e intercambia tus cromos repetidos.
          </p>
        </div>
      </section>

      {/* CTA + Form */}
      <section className="container mx-auto px-4 lg:px-6 mb-8">
        <div className="max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {success && (
            <div className="mb-4 p-4 rounded-xl bg-mundial-green/10 border border-mundial-green/30 text-mundial-green-light text-center animate-fade-in">
              ✅ {success}
            </div>
          )}

          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className={mostrarForm ? 'btn-ghost w-full sm:w-auto' : 'btn-primary w-full sm:w-auto'}
          >
            {mostrarForm ? (
              <>
                <span>✕</span>
                Cancelar
              </>
            ) : (
              <>
                <span>+</span>
                Crear oferta de intercambio
              </>
            )}
          </button>

          {mostrarForm && (
            <form
              onSubmit={crearIntercambio}
              className="mt-6 glass-premium p-6 lg:p-8 space-y-5 animate-scale-in"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mundial-purple to-fuchsia-700 flex items-center justify-center shadow-glow-purple">
                  <span className="text-xl">📝</span>
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold">Nueva oferta</h2>
                  <p className="text-xs text-white/50">Publica un intercambio para la comunidad</p>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                  Tu cromo repetido (que ofreces)
                </label>
                <select
                  value={cromoOfrecido}
                  onChange={(e) => setCromoOfrecido(e.target.value)}
                  className="input-premium"
                  required
                >
                  <option value="">Selecciona un cromo repetido</option>
                  {misCromos.map((c: any) => (
                    <option key={c.id} value={c.cromo_id} className="bg-mundial-dark">
                      #{c.cromos.numero_cromo} - {c.cromos.jugadores?.nombre} {c.cromos.jugadores?.apellido}
                    </option>
                  ))}
                </select>
                {misCromos.length === 0 && (
                  <p className="text-xs text-mundial-gold mt-2">
                    ⚠️ No tienes cromos repetidos aún
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                  Cromo que buscas (1-980)
                </label>
                <input
                  type="number"
                  placeholder="Número del cromo"
                  value={cromoBuscado}
                  onChange={(e) => setCromoBuscado(e.target.value)}
                  className="input-premium"
                  min={1}
                  max={980}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                  Lugar de encuentro
                </label>
                <input
                  type="text"
                  placeholder="Ej: Parque Montalvo, Mall del Centro..."
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className="input-premium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                  Notas adicionales
                </label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="input-premium resize-none"
                  rows={3}
                  placeholder="Horario preferido, condiciones, etc."
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Publicar oferta
                <span>→</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Intercambios List */}
      <section className="container mx-auto px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold">
              Ofertas <span className="text-gradient">activas</span>
            </h2>
            <div className="text-sm text-white/40 font-mono">
              {intercambiosVisibles.length} {intercambiosVisibles.length === 1 ? 'oferta' : 'ofertas'}
            </div>
          </div>

          {loadingInter ? (
            <div className="flex justify-center py-16">
              <div className="loader-premium"></div>
            </div>
          ) : intercambiosVisibles.length === 0 ? (
            <div className="max-w-md mx-auto glass-premium p-10 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">No hay ofertas activas</h3>
              <p className="text-white/50 mb-6">
                Sé el primero en publicar una oferta de intercambio
              </p>
              <button
                onClick={() => setMostrarForm(true)}
                className="btn-primary inline-flex"
              >
                Crear oferta
                <span>→</span>
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {intercambiosVisibles.map((inter, i) => (
                <article
                  key={inter.id}
                  className="glass-card-hover p-5 group animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(i * 50, 400)}ms` }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-mundial-green animate-pulse"></span>
                      <span className="text-xs font-semibold text-mundial-green-light uppercase tracking-wider">
                        Activa
                      </span>
                    </div>
                    <div className="text-xs text-white/40 flex items-center gap-1">
                      <span>📍</span>
                      <span className="truncate max-w-[100px]">{inter.ubicacion}</span>
                    </div>
                  </div>

                  {/* Ofrece */}
                  <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-mundial-green/10 to-emerald-700/5 border border-mundial-green/20">
                    <div className="text-[10px] font-bold text-mundial-green-light uppercase tracking-widest mb-1">
                      Ofrece
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">
                        {inter.cromo_ofrecido?.jugadores
                          ? `${inter.cromo_ofrecido.jugadores.nombre} ${inter.cromo_ofrecido.jugadores.apellido}`
                          : 'Cromo'}
                      </span>
                      <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded-md">
                        #{inter.cromo_ofrecido?.numero_cromo}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center my-2">
                    <span className="text-mundial-gold text-lg">⇅</span>
                  </div>

                  {/* Busca */}
                  <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-mundial-gold/10 to-amber-700/5 border border-mundial-gold/20">
                    <div className="text-[10px] font-bold text-mundial-gold-light uppercase tracking-widest mb-1">
                      Busca
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">
                        {inter.cromo_buscado?.jugadores
                          ? `${inter.cromo_buscado.jugadores.nombre} ${inter.cromo_buscado.jugadores.apellido}`
                          : `Cromo #${inter.cromo_buscado?.numero_cromo}`}
                      </span>
                      <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded-md">
                        #{inter.cromo_buscado?.numero_cromo}
                      </span>
                    </div>
                  </div>

                  {/* Notes */}
                  {inter.notas && (
                    <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-xs text-white/70 italic line-clamp-2">"{inter.notas}"</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mundial-cyan to-mundial-purple flex items-center justify-center text-xs font-bold">
                          {inter.perfiles?.nombre?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="text-sm text-white/80">
                          {inter.perfiles?.nombre || 'Coleccionista'}
                        </span>
                      </div>
                    </div>

                    {inter.perfiles?.whatsapp ? (
                      <a
                        href={`https://wa.me/${inter.perfiles.whatsapp}?text=Hola! Vi tu oferta de intercambio en Mundial Ambato 2026`}
                        target="_blank"
                        rel="noopener"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold hover:shadow-glow-green transition-all"
                      >
                        <span>💬</span>
                        Contactar por WhatsApp
                      </a>
                    ) : (
                      <div className="text-center text-xs text-white/40 py-2">
                        Sin WhatsApp registrado
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="text-center mt-12">
        <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">
          ← Volver al inicio
        </Link>
      </div>
    </main>
  )
}
