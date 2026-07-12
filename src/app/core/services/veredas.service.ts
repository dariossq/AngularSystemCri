import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { getApiUrl } from '../../config';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VeredasService {
  private http = inject(HttpClient);
  private apiUrl = getApiUrl();
  private platformId = inject(PLATFORM_ID);

  public getAll(): Observable<any[]> {
    if (!isPlatformBrowser(this.platformId)) {
      // Durante SSR/prerender evitar llamadas al backend
      return of([]);
    }
    return this.http.get<any[]>(`${this.apiUrl}/Veredas`).pipe(
      catchError(() => of([]))
    );
  }

  public getByUsuarioId(usuarioId: number): Observable<any[]> {
    if (!isPlatformBrowser(this.platformId)) {
      return of([]);
    }
    return this.http.get<any[]>(`${this.apiUrl}/Veredas/usuario/${usuarioId}`).pipe(
      catchError(() => of([]))
    );
  }

  public create(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Veredas`, payload);
  }

  public update(id: any, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Veredas/${id}`, payload);
  }

  public delete(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Veredas/${id}`);
  }
}
