export function getApiUrl(): string {
  try {
    const win: any = window as any;
    if (win && win.__env && win.__env.API_URL) {
      return win.__env.API_URL;
    }
  } catch (e) {
    // ignore
  }
  // Durante desarrollo, el proxy se encargará de redirigir a localhost:5078
  // En producción, usa la URL del env.js
  return '/api';
}

export function setApiUrl(url: string): void {
  const win: any = window as any;
  win.__env = win.__env || {};
  win.__env.API_URL = url;
}
