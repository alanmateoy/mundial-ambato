// Constantes globales de la app
export const TOTAL_CROMOS = 980
export const TOTAL_EQUIPOS = 48
export const CIUDAD_PREDETERMINADA = 'Ambato'

// Distribución de cromos
export const CROMOS_INTRODUCCION = 9
export const CROMOS_MUSEO = 11
export const CROMOS_EQUIPOS = 960
export const CROMOS_POR_EQUIPO = 20

// Colores por confederación (Tailwind)
export const CONFEDERACION_COLORES: Record<string, { bg: string; text: string }> = {
  'CONCACAF': { bg: 'bg-green-100', text: 'text-green-800' },
  'CONMEBOL': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'UEFA': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'AFC': { bg: 'bg-orange-100', text: 'text-orange-800' },
  'CAF': { bg: 'bg-red-100', text: 'text-red-800' },
  'OFC': { bg: 'bg-purple-100', text: 'text-purple-800' },
}

// Mapeo de banderas por código FIFA (emoji)
export const BANDERAS_POR_CODIGO: Record<string, string> = {
  'MEX': '🇲🇽', 'RSA': '🇿🇦', 'KOR': '🇰🇷', 'CZE': '🇨🇿',
  'CAN': '🇨🇦', 'BIH': '🇧🇦', 'QAT': '🇶🇦', 'SUI': '🇨🇭',
  'BRA': '🇧🇷', 'MAR': '🇲🇦', 'HAI': '🇭🇹', 'SCO': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'USA': '🇺🇸', 'PAR': '🇵🇾', 'AUS': '🇦🇺', 'TUR': '🇹🇷',
  'GER': '🇩🇪', 'CUW': '🇨🇼', 'CIV': '🇨🇮', 'ECU': '🇪🇨',
  'NED': '🇳🇱', 'JPN': '🇯🇵', 'TUN': '🇹🇳', 'SWE': '🇸🇪',
  'BEL': '🇧🇪', 'EGY': '🇪🇬', 'IRN': '🇮🇷', 'NZL': '🇳🇿',
  'ESP': '🇪🇸', 'CPV': '🇨🇻', 'KSA': '🇸🇦', 'URU': '🇺🇾',
  'FRA': '🇫🇷', 'SEN': '🇸🇳', 'IRQ': '🇮🇶', 'NOR': '🇳🇴',
  'ARG': '🇦🇷', 'ALG': '🇩🇿', 'AUT': '🇦🇹', 'JOR': '🇯🇴',
  'POR': '🇵🇹', 'COD': '🇨🇩', 'UZB': '🇺🇿', 'COL': '🇨🇴',
  'ENG': '🇬🇧', 'CRO': '🇭🇷', 'GHA': '🇬🇭', 'PAN': '🇵🇦',
}

// Estados de cromos en el inventario
export const ESTADOS_CROMO = {
  OBTENIDO: 'obtenido',
  REPETIDO: 'repetido',
}

// Colores por estado de cromo
export const ESTADO_CROMO_COLORES: Record<string, { bg: string; text: string }> = {
  [ESTADOS_CROMO.OBTENIDO]: { bg: 'bg-green-100', text: 'text-green-800' },
  [ESTADOS_CROMO.REPETIDO]: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
}

// Tipos de cromos especiales
export const TIPOS_CROMO_ESPECIALES = ['escudo', 'introduccion', 'museo_fifa', 'foto_equipo']

// Validaciones
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PASSWORD_MIN_LENGTH = 8
export const WHATSAPP_REGEX = /^[0-9+\-\s()]*[0-9]{10,}[0-9+\-\s()]*$/

// Límites de paginación
export const LIMIT_SELECCIONES = 48
export const LIMIT_JUGADORES = 500
export const LIMIT_USUARIO_CROMOS = 500
export const LIMIT_INTERCAMBIOS = 100
