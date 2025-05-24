import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Retorna o caminho correto para um asset, considerando o ambiente (desenvolvimento ou produção)
 * No GitHub Pages, o caminho base é /Print3DPro/
 */
export function getAssetPath(path: string): string {
  // Se o caminho já começa com http ou https, retorna o caminho original
  if (path.startsWith('http')) return path

  // Garante que o caminho começa com /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  // Em produção, sempre usa /Print3DPro/ como base
  // Em desenvolvimento, usa /
  const isProduction = import.meta.env.PROD || import.meta.env.NODE_ENV === 'production'
  const baseUrl = isProduction ? '/Print3DPro/' : '/'
  
  // Evita duplicar o base se já estiver presente
  if (normalizedPath.startsWith(baseUrl)) {
    return normalizedPath
  }
  
  // Remove barra final do baseUrl para evitar barras duplas
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')
  return `${cleanBaseUrl}${normalizedPath}`
}
