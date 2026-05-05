'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Seleccion {
  id: number;
  nombre: string;
  confederacion: string;
  codigo_fifa: string;
  grupo: string;
  ranking_fifa: number;
  participaciones: number;
}

export default function CatalogoPage() {
  const [selecciones, setSelecciones] = useState<Seleccion[]>([])
  const [filtro, setFiltro] = useState('')
  const [confederacion, setConfederacion] = useState('todas')

  useEffect(() => {
    fetch('/data/selecciones.json')
      .then(res => res.json())
      .then(data => setSelecciones(data))
  }, [])

  const seleccionesFiltradas = selecciones.filter(s => {
    const matchNombre = s.nombre.toLowerCase().includes(filtro.toLowerCase())
    const matchConf = confederacion === 'todas' || s.confederacion === confederacion
    return matchNombre && matchConf
  })

  const getConfederacionColor = (conf: string) => {
    const colores: { [key: string]: string } = {
      'CONCACAF': 'bg-green-100 text-green-800',
      'CONMEBOL': 'bg-yellow-100 text-yellow-800',
      'UEFA': 'bg-blue-100 text-blue-800',
      'AFC': 'bg-red-100 text-red-800',
      'CAF': 'bg-orange-100 text-orange-800',
      'OFC': 'bg-purple-100 text-purple-800'
    }
    return colores[conf] || 'bg-gray-100'
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-mundial-green to-green-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <Link href="/" className="text-white/80 hover:text-white mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-4xl font-display font-bold mb-4">📚 Catálogo Completo</h1>
          <p className="text-xl">Las 48 selecciones del Mundial 2026</p>
        </header>

        <div className="max-w-4xl mx-auto mb-8 bg-white/10 backdrop-blur rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar selección..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-mundial-gold"
            />
            <select
              value={confederacion}
              onChange={(e) => setConfederacion(e.target.value)}
              className="p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-mundial-gold"
            >
              <option value="todas">Todas las confederaciones</option>
              <option value="CONCACAF">CONCACAF</option>
              <option value="CONMEBOL">CONMEBOL</option>
              <option value="UEFA">UEFA</option>
              <option value="AFC">AFC</option>
              <option value="CAF">CAF</option>
              <option value="OFC">OFC</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {seleccionesFiltradas.map((sel) => (
            <div key={sel.id} className="mundial-card p-6 hover:scale-105 transition-transform">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getConfederacionColor(sel.confederacion)}`}>
                  {sel.confederacion}
                </span>
                <span className="text-mundial-gold font-bold">#{sel.ranking_fifa}</span>
              </div>
              <h2 className="text-2xl font-bold text-mundial-green mb-2">{sel.nombre}</h2>
              <div className="space-y-1 text-gray-600">
                <p><span className="font-semibold">Grupo:</span> {sel.grupo}</p>
                <p><span className="font-semibold">Código FIFA:</span> {sel.codigo_fifa}</p>
                <p><span className="font-semibold">Participaciones:</span> {sel.participaciones}</p>
              </div>
              <button className="mundial-btn w-full mt-4 text-sm">
                Ver Jugadores
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 text-white/80">
          Mostrando {seleccionesFiltradas.length} de {selecciones.length} selecciones
        </div>
      </div>
    </main>
  )
}
