export function getApiUrl(): string {
  try {
    const win: any = window as any;
    if (win && win.__env && win.__env.API_URL) {
      return win.__env.API_URL;
    }
  } catch (e) {
    // ignore
  }
  return 'http://localhost:5078/api';
}

export function setApiUrl(url: string): void {
  const win: any = window as any;
  win.__env = win.__env || {};
  win.__env.API_URL = url;
}
