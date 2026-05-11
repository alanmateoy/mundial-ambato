// Interfaces TypeScript para toda la app

export interface Seleccion {
  id: number
  nombre: string
  confederacion: 'CONCACAF' | 'CONMEBOL' | 'UEFA' | 'AFC' | 'CAF' | 'OFC'
  codigo_fifa: string
  grupo: string
  orden_album?: number
  ranking_fifa: number
  participaciones: number
  mejor_resultado: string
  created_at?: string
}

export interface Jugador {
  id: number
  seleccion_id: number
  nombre: string
  apellido: string
  numero: number
  posicion: 'Portero' | 'Defensor' | 'Centrocampista' | 'Delantero'
  club: string
  edad: number
  es_titular: boolean
  foto_url?: string
  created_at?: string
}

export interface Cromo {
  id: number
  numero_cromo: number
  jugador_id?: number
  seleccion_id?: number
  tipo: 'normal' | 'escudo' | 'foto_equipo' | 'introduccion' | 'museo_fifa'
  descripcion: string
  seccion?: string
  rareza: number
  es_foil: boolean
  imagen_url?: string
  created_at?: string
  // Relaciones
  jugadores?: Jugador
  selecciones?: Seleccion
}

export interface Perfil {
  id: string
  email: string
  nombre?: string
  apellido?: string
  ciudad: string
  whatsapp?: string
  avatar_url?: string
  cromos_obtenidos?: number
  cromos_repetidos?: number
  created_at?: string
}

export interface UsuarioCromo {
  id: number
  usuario_id: string
  cromo_id: number
  estado: 'obtenido' | 'repetido'
  cantidad?: number
  fecha_registro?: string
  // Relaciones
  cromos?: Cromo & {
    jugadores?: Jugador
    selecciones?: Seleccion
  }
}

export interface Intercambio {
  id: number
  usuario_ofrece_id: string
  usuario_recibe_id?: string
  cromo_ofrecido_id: number
  cromo_buscado_id: number
  estado: 'abierto' | 'en_proceso' | 'completado' | 'cancelado'
  ubicacion?: string
  fecha_encuentro?: string
  notas?: string
  created_at?: string
  updated_at?: string
  // Relaciones
  perfiles?: Perfil
  cromo_ofrecido?: Cromo & {
    jugadores?: Jugador
  }
  cromo_buscado?: Cromo & {
    jugadores?: Jugador
  }
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegistroFormData {
  email: string
  password: string
  nombre: string
}

export interface EditarPerfilFormData {
  nombre?: string
  whatsapp?: string
  ciudad?: string
}

export interface RegistrarCromoFormData {
  numero_cromo: number
  estado: 'obtenido' | 'repetido'
}

export interface CrearIntercambioFormData {
  cromo_ofrecido_id: number
  cromo_buscado_id: number
  ubicacion: string
  notas?: string
}
