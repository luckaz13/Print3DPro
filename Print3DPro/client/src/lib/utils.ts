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
  if (path.startsWith('http')) return path;

  const appBaseUrl = import.meta.env.BASE_URL; // Ex: '/' ou '/Print3DPro/'

  // Normaliza o path do asset para não começar com '/' se appBaseUrl não for '/' e terminar com '/'
  // ou para começar com '/' se appBaseUrl for '/'
  let assetPath = path;
  if (appBaseUrl !== '/' && appBaseUrl.endsWith('/') && assetPath.startsWith('/')) {
    assetPath = assetPath.substring(1);
  } else if (appBaseUrl === '/' && !assetPath.startsWith('/')) {
    assetPath = `/${assetPath}`;
  } else if (appBaseUrl !== '/' && !appBaseUrl.endsWith('/') && !assetPath.startsWith('/')) {
    // Caso appBaseUrl seja algo como /folder e path seja image.png, precisamos de /folder/image.png
     assetPath = `/${assetPath}`;
  }


  // new URL(path, base) é uma boa forma de resolver isso.
  // O construtor URL precisa de uma base absoluta, podemos usar um placeholder.
  // Usamos 'http://placeholder.com' como base para que new URL funcione corretamente.
  // O pathname resultante será o caminho correto relativo à raiz do domínio + appBaseUrl.
  const resolvedUrl = new URL(assetPath, `http://placeholder.com${appBaseUrl === '/' ? '' : appBaseUrl}`).pathname;
  
  // Garante que, se appBaseUrl for apenas '/', não haja barras duplicadas no início.
  // E se appBaseUrl não for '/', garante que o caminho comece com appBaseUrl
  if (appBaseUrl === '/') {
    if (resolvedUrl.startsWith('//')) {
      return resolvedUrl.substring(1);
    }
    // Se o resolvedUrl não começar com /, adiciona
    if(!resolvedUrl.startsWith('/')) {
      return `/${resolvedUrl}`;
    }
  } else if (!resolvedUrl.startsWith(appBaseUrl)) {
     // Se appBaseUrl é /Print3DPro/ e resolvedUrl é /1.jpg, deve ser /Print3DPro/1.jpg
     // Isso pode acontecer se assetPath for absoluto, ex: /1.jpg
     if (assetPath.startsWith('/')) {
        return `${appBaseUrl.endsWith('/') ? appBaseUrl.slice(0, -1) : appBaseUrl}${assetPath}`;
     }
     return `${appBaseUrl.endsWith('/') ? appBaseUrl : `${appBaseUrl}/`}${assetPath.startsWith('/') ? assetPath.substring(1) : assetPath}`;
  }


  return resolvedUrl;
}
