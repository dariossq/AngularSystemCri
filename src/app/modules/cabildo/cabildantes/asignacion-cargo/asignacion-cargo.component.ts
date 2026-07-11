import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asignacion-cargo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-content">
      <h1>Asignación de Cargo</h1>
      <p>Use este espacio para asignar cargos a los integrantes de las veredas.</p>
    </section>
  `,
  styles: [
    `.page-content { padding: 1.5rem; }`,
    `h1 { margin-bottom: 1rem; }`
  ]
})
export class AsignacionCargoComponent {}
