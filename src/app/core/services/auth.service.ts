import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Usuario } from '../../shared/models/usuario.model';
import { getApiUrl } from '../../config';

interface User {
  id: string | number;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyecciones necesarias
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  
  // URL base de la API (obtenida en runtime desde `window.__env` o valor por defecto)
  private apiUrl = getApiUrl();

  // Señal para usuario autenticado
  private currentUser = signal<User | null>(null);
  private isAuthenticatedSignal = signal(false);

  // Variables para almacenar usuarios registrados (en producción usar un backend)
  private users: Map<string, { password: string; email: string }> = new Map();

  constructor() {
    this.initializeDefaultUsers();
    // Solo cargar del storage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserFromStorage();
    }
  }

  // Inicializar usuarios por defecto para pruebas
  private initializeDefaultUsers(): void {
    this.users.set('admin', {
      password: this.hashPassword('admin123'),
      email: 'admin@systemcri.com'
    });
    this.users.set('usuario', {
      password: this.hashPassword('usuario123'),
      email: 'usuario@systemcri.com'
    });
  }

  // Función simple de hash (en producción usar bcrypt en el backend)
  private hashPassword(password: string): string {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  // Login de usuario
  public login(username: string, password: string): boolean {
    const user = this.users.get(username);

    if (user && user.password === this.hashPassword(password)) {
      const userData: User = {
        id: this.generateId(),
        username,
        email: user.email
      };

      this.currentUser.set(userData);
      this.isAuthenticatedSignal.set(true);
      this.saveUserToStorage(userData);
      return true;
    }

    return false;
  }

  // Registrar nuevo usuario
  public register(username: string, email: string, password: string, confirmPassword: string): boolean {
    // Validaciones
    if (password !== confirmPassword) {
      console.error('Las contraseñas no coinciden');
      return false;
    }

    if (this.users.has(username)) {
      console.error('El usuario ya existe');
      return false;
    }

    if (password.length < 6) {
      console.error('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    // Registrar usuario
    this.users.set(username, {
      password: this.hashPassword(password),
      email
    });

    // Hacer login automático después del registro
    return this.login(username, password);
  }

  // Logout de usuario
  public logout(): void {
    this.currentUser.set(null);
    this.isAuthenticatedSignal.set(false);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('user');
    }
    this.router.navigate(['/login']);
  }

  // Obtener usuario actual
  public getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  // Verificar si está autenticado
  public isAuthenticated() {
    return this.isAuthenticatedSignal.asReadonly();
  }

  // Guardar usuario en storage
  private saveUserToStorage(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }

  // Cargar usuario del storage
  private loadUserFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userData = sessionStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData) as User;
          this.currentUser.set(user);
          this.isAuthenticatedSignal.set(true);
        } catch (error) {
          console.error('Error al cargar usuario del storage:', error);
        }
      }
    }
  }

  // Generar ID único
  private generateId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  // Obtener lista de usuarios activos desde la API
  public getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/Usuario/UsuarioActivo`).pipe(
      catchError(err => {
        console.error('Error cargando usuarios:', err);
        // Retornar array vacío por defecto para no bloquear la UI
        return of([]);
      })
    );
  }

  

  // Codifica la cadena usando el mismo algoritmo que el backend C#:
  // System.Text.Encoding.Unicode.GetBytes(...) -> Convert.ToBase64String(...)
  private encodeUnicodeBase64(value: string): string {
    const buf = new ArrayBuffer(value.length * 2);
    const bufView = new Uint16Array(buf);
    for (let i = 0; i < value.length; i++) {
      bufView[i] = value.charCodeAt(i);
    }
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Login remoto contra el endpoint de Seguridad. Devuelve Observable<boolean>.
  // Este método intenta obtener la lista de seguridad y buscar una coincidencia
  // entre usuario y contraseña codificada (igual que el backend C# mostrada).
  // Nota: es preferible que el backend exponga un endpoint POST de autenticación
  // que devuelva un token (JWT). Aquí hacemos lo mínimo compatible con el
  // servicio existente.
  public loginRemote(username: string, password: string, companyId?: number): Observable<boolean> {
    const encoded = this.encodeUnicodeBase64(password);
    return this.http.get<any[]>(`${this.apiUrl}/Seguridad`).pipe(
      map(list => {
        if (!Array.isArray(list)) return false;
        const found = list.find(item => {
          // Normalizar campos por si vienen con otros nombres
          const userField = item.seguridadPer ?? item.seguridadUsuario ?? item.usuario ?? '';
          const passField = item.seguridadContra ?? item.seguridadPass ?? item.contrasena ?? '';
          return userField === username && passField === encoded;
        });

        if (found) {
          const foundId = found.id;
          const parsedId = typeof foundId === 'number' ? foundId : Number(foundId);
          const effectiveId: string | number = Number.isFinite(companyId ?? NaN)
            ? companyId!
            : Number.isFinite(parsedId)
              ? parsedId
              : this.generateId();
          const userData: User = {
            id: effectiveId,
            username,
            email: (found.email as string) ?? `${username}@local`
          };
          this.currentUser.set(userData);
          this.isAuthenticatedSignal.set(true);
          this.saveUserToStorage(userData);
          return true;
        }

        return false;
      }),
      catchError(err => {
        console.error('Error en loginRemote:', err);
        // Intentar login local como fallback si la API falla
        const user = this.users.get(username);
        if (user && user.password === this.hashPassword(password)) {
          const userId = Number.isFinite(companyId ?? NaN) ? companyId! : this.generateId();
          const userData: User = {
            id: userId,
            username,
            email: user.email
          };
          this.currentUser.set(userData);
          this.isAuthenticatedSignal.set(true);
          this.saveUserToStorage(userData);
          return of(true);
        }
        return of(false);
      })
    );
  }
}
