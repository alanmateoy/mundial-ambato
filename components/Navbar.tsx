'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

const navLinks = [
  { href: '/album', label: 'Álbum', icon: '📖' },
  { href: '/catalogo', label: 'Catálogo', icon: '🌍' },
  { href: '/mis-cromos', label: 'Mis Cromos', icon: '🎴' },
  { href: '/intercambios', label: 'Intercambios', icon: '🔄' },
]

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getUser().then((res) => {
      setUser(res.data.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Ocultar navbar en login
  if (pathname === '/login') return null

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-mundial-dark/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-mundial-green to-mundial-cyan rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br from-mundial-green to-mundial-cyan flex items-center justify-center shadow-glow-green">
                  <span className="text-xl lg:text-2xl">🏆</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="font-display font-black text-lg lg:text-xl text-white leading-none">
                  Mundial <span className="text-gradient">Ambato</span>
                </div>
                <div className="text-[10px] lg:text-xs text-white/40 tracking-widest uppercase mt-0.5">
                  FIFA World Cup 2026
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      active
                        ? 'text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{link.icon}</span>
                      {link.label}
                    </span>
                    {active && (
                      <span className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-mundial-green/20 to-mundial-cyan/20 border border-mundial-green/30"></span>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* User Action */}
            <div className="flex items-center gap-3">
              {user ? (
                <Link
                  href="/perfil"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-mundial-green/40 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mundial-green to-mundial-cyan flex items-center justify-center text-sm font-bold text-white">
                    {user.email?.[0].toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-white/80 max-w-[100px] truncate hidden md:inline">
                    {user.email?.split('@')[0]}
                  </span>
                </Link>
              ) : (
                <Link href="/login" className="btn-primary text-sm py-2 px-4">
                  Iniciar Sesión
                </Link>
              )}

              {/* Hamburger Mobile */}
              <button
                className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                <div className="w-5 h-4 relative flex flex-col justify-between">
                  <span className={`block h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`block h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          mobileOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        ></div>

        <div
          className={`absolute top-16 right-4 left-4 glass-premium p-4 transition-all duration-500 ${
            mobileOpen ? 'translate-y-0' : '-translate-y-4'
          }`}
        >
          <div className="space-y-1">
            {navLinks.map((link, i) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-mundial-green/20 to-mundial-cyan/20 border border-mundial-green/30 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  style={{
                    animationDelay: `${i * 50}ms`,
                  }}
                >
                  <span className="text-2xl">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              )
            })}

            {user && (
              <>
                <div className="divider-glow my-3"></div>
                <Link
                  href="/perfil"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
                >
                  <span className="text-2xl">👤</span>
                  <span className="font-medium">Mi Perfil</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Spacer para el fixed navbar */}
      <div className="h-16 lg:h-20"></div>
    </>
  )
}
