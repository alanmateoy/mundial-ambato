import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Mundial Ambato 2026 - Colecciona y Cambia Cromos',
  description: 'La app oficial para coleccionar y intercambiar cromos del Mundial 2026 en Ambato',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-mundial-light min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
