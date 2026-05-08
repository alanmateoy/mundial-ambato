import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Mundial Ambato 2026 — Colecciona, Intercambia y Gana',
  description: 'La app oficial para coleccionistas del Mundial 2026 en Ambato. Registra tus cromos, encuentra repetidos e intercambia con otros coleccionistas.',
  keywords: ['mundial 2026', 'panini', 'cromos', 'ambato', 'coleccionismo', 'fifa'],
  openGraph: {
    title: 'Mundial Ambato 2026',
    description: 'Colecciona los 980 cromos del Mundial 2026',
    type: 'website',
  },
}

export const viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen antialiased">
        <Navbar />
        <div className="relative">
          {children}
        </div>
      </body>
    </html>
  )
}
