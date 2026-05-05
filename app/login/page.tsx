'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      setMessage('Error: Supabase no configurado')
      return
    }
    setLoading(true)
    setMessage('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else router.push('/')
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nombre, ciudad: 'Ambato' }
        }
      })
      if (error) setMessage(error.message)
      else setMessage('Revisa tu correo para confirmar tu cuenta')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen mundial-gradient flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-display font-bold text-center mb-2 text-mundial-green">
          🏆 Mundial Ambato 2026
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {isLogin ? 'Inicia sesión para coleccionar cromos' : 'Regístrate gratis y empieza a coleccionar'}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-3 border-2 border-mundial-green/30 rounded-lg focus:border-mundial-green outline-none"
              required
            />
          )}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border-2 border-mundial-green/30 rounded-lg focus:border-mundial-green outline-none"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border-2 border-mundial-green/30 rounded-lg focus:border-mundial-green outline-none"
            required
            minLength={6}
          />

          <button
            type="submit"
            disabled={loading}
            className="mundial-btn w-full py-3"
          >
            {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center ${message.includes('error') || message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-gray-600">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <button
            onClick={() => { setIsLogin(!isLogin); setMessage('') }}
            className="ml-2 text-mundial-green font-bold hover:underline"
          >
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  )
}
