'use client'
import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EMAIL_REGEX, PASSWORD_MIN_LENGTH } from '@/lib/constants'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'error' | 'success' | null>(null)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const router = useRouter()

  const validateEmail = (email: string): boolean => {
    if (!EMAIL_REGEX.test(email)) {
      setEmailError('Por favor ingresa un correo válido')
      return false
    }
    setEmailError('')
    return true
  }

  const validatePassword = (password: string): boolean => {
    if (password.length < PASSWORD_MIN_LENGTH) {
      setPasswordError(`Mínimo ${PASSWORD_MIN_LENGTH} caracteres`)
      return false
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError('Debe incluir una mayúscula')
      return false
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError('Debe incluir un número')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleAuth = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      setMessage('Error: Supabase no configurado')
      setMessageType('error')
      return
    }

    // Check rate limit
    if (blockedUntil && Date.now() < blockedUntil) {
      const secondsLeft = Math.ceil((blockedUntil - Date.now()) / 1000)
      setMessage(`Demasiados intentos. Intenta en ${secondsLeft}s`)
      setMessageType('error')
      return
    }

    // Reset block if time has passed
    if (blockedUntil && Date.now() >= blockedUntil) {
      setBlockedUntil(null)
      setFailedAttempts(0)
    }

    // Validate inputs
    if (!validateEmail(email) || !validatePassword(password)) {
      return
    }

    setLoading(true)
    setMessage('')
    setMessageType(null)

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        const newAttempts = failedAttempts + 1
        setFailedAttempts(newAttempts)

        if (newAttempts >= 5) {
          const blockTime = Date.now() + 30000
          setBlockedUntil(blockTime)
          setMessage('Demasiados intentos fallidos. Bloqueado por 30 segundos.')
        } else {
          setMessage(error.message)
        }
        setMessageType('error')
      } else {
        setFailedAttempts(0)
        setBlockedUntil(null)
        router.push('/')
      }
    } else {
      // For signup, also validate password strength
      if (!validatePassword(password)) {
        setLoading(false)
        return
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nombre, ciudad: 'Ambato' }
        }
      })
      if (error) {
        setMessage(error.message)
        setMessageType('error')
      } else {
        setMessage('¡Cuenta creada! Revisa tu correo para confirmar.')
        setMessageType('success')
        setFailedAttempts(0)
        setBlockedUntil(null)
      }
    }
    setLoading(false)
  }, [email, password, isLogin, failedAttempts, blockedUntil])

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-mundial-green/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-mundial-purple/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-mundial-cyan/15 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      ></div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Logo arriba */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-mundial-green to-mundial-cyan rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-mundial-green via-mundial-cyan to-mundial-purple flex items-center justify-center shadow-glow-strong">
                <span className="text-3xl">🏆</span>
              </div>
            </div>
          </Link>
          <h1 className="text-3xl font-display font-black mt-4 mb-1">
            Mundial <span className="text-gradient">Ambato</span>
          </h1>
          <p className="text-sm text-white/40 tracking-widest uppercase">FIFA World Cup 2026</p>
        </div>

        {/* Card de auth */}
        <div className="glass-premium p-8 animate-scale-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display font-bold mb-1">
              {isLogin ? '¡Bienvenido de vuelta!' : 'Únete al Mundial'}
            </h2>
            <p className="text-sm text-white/50">
              {isLogin
                ? 'Inicia sesión para coleccionar cromos'
                : 'Crea tu cuenta gratis y comienza a coleccionar'}
            </p>
          </div>

          {/* Toggle Login/Registro */}
          <div className="grid grid-cols-2 gap-1 mb-6 p-1 bg-white/5 rounded-xl border border-white/10">
            <button
              onClick={() => { setIsLogin(true); setMessage(''); setMessageType(null) }}
              className={`py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isLogin
                  ? 'bg-gradient-to-r from-mundial-green to-mundial-green-dark text-white shadow-glow-green'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setIsLogin(false); setMessage(''); setMessageType(null) }}
              className={`py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                !isLogin
                  ? 'bg-gradient-to-r from-mundial-green to-mundial-green-dark text-white shadow-glow-green'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="animate-fade-in-up">
                <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                  Nombre
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">👤</span>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="input-premium pl-12"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                Correo electrónico
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">✉️</span>
                <input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailError('')
                  }}
                  className={`input-premium pl-12 ${emailError ? 'border-red-500/50' : ''}`}
                  required
                />
              </div>
              {emailError && (
                <p className="text-xs text-red-400 mt-1">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">🔒</span>
                <input
                  type="password"
                  placeholder={isLogin ? 'Tu contraseña' : `Min ${PASSWORD_MIN_LENGTH} chars, 1 Mayús, 1 número`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError('')
                  }}
                  className={`input-premium pl-12 ${passwordError ? 'border-red-500/50' : ''}`}
                  required
                />
              </div>
              {passwordError && (
                <p className="text-xs text-red-400 mt-1">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (blockedUntil !== null && Date.now() < blockedUntil)}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Cargando...
                </>
              ) : (
                <>
                  {isLogin ? 'Entrar' : 'Crear cuenta'}
                  <span className="text-lg">→</span>
                </>
              )}
            </button>

            {message && (
              <div
                className={`p-3 rounded-xl text-sm text-center backdrop-blur-md border animate-fade-in ${
                  messageType === 'error'
                    ? 'bg-red-500/10 border-red-500/30 text-red-300'
                    : 'bg-mundial-green/10 border-mundial-green/30 text-mundial-green-light'
                }`}
              >
                {message}
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-white/40">
              Al continuar aceptas los términos de uso de la app
            </p>
          </div>
        </div>

        {/* Stats pequeños abajo */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { num: '980', label: 'Cromos' },
            { num: '48', label: 'Equipos' },
            { num: 'Ambato', label: 'Comunidad' },
          ].map((s, i) => (
            <div
              key={s.label}
              className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/5 animate-fade-in-up"
              style={{ animationDelay: `${i * 100 + 200}ms` }}
            >
              <div className="text-lg font-display font-bold text-gradient">{s.num}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
