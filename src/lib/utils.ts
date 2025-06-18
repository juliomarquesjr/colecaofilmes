import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUniqueCode(): string {
  const timestamp = Date.now().toString(36); // Converte timestamp para base36
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 caracteres aleatórios
  
  // Combina timestamp (que é único) com caracteres aleatórios
  const code = (timestamp.slice(-4) + randomPart).toUpperCase();
  
  // Garante que o código tenha exatamente 8 caracteres
  return code.padEnd(8, '0').slice(0, 8);
}

export function getYouTubeVideoId(url: string) {
  if (!url) return null;
  
  // Padrões possíveis de URL do YouTube
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
    /youtube\.com\/watch\?.*v=([^&]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}
