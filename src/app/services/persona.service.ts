import { Injectable, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Persona, createEmptyPersona } from '../models/persona.model';

const STORAGE_KEY = 'systemcri_personas';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private platformId = inject(PLATFORM_ID);
  private personasSignal = signal<Persona[]>([]);

  public personas = computed(() => this.personasSignal());

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        this.personasSignal.set(JSON.parse(stored) as Persona[]);
      } catch {
        this.personasSignal.set([]);
      }
    }
  }

  private saveToStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.personasSignal()));
  }

  public createEmpty(): Persona {
    return createEmptyPersona();
  }

  public addPersona(persona: Persona): void {
    this.personasSignal.update(personas => [persona, ...personas]);
    this.saveToStorage();
  }

  public updatePersona(persona: Persona): boolean {
    let updated = false;
    this.personasSignal.update(personas => personas.map(current => {
      if (current.identificacion === persona.identificacion) {
        updated = true;
        return { ...persona };
      }
      return current;
    }));
    if (updated) {
      this.saveToStorage();
    }
    return updated;
  }

  public deletePersona(identificacion: string): boolean {
    const before = this.personasSignal().length;
    this.personasSignal.update(personas => personas.filter(persona => persona.identificacion !== identificacion));
    const removed = before !== this.personasSignal().length;
    if (removed) {
      this.saveToStorage();
    }
    return removed;
  }

  public findByIdentificacion(identificacion: string): Persona | undefined {
    return this.personasSignal().find(persona => persona.identificacion === identificacion);
  }

  public searchByIdentificacion(identificacion: string): Persona | undefined {
    return this.findByIdentificacion(identificacion);
  }
}
