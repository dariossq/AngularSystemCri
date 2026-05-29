import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-proyecto',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-content">
      <h1>Registro de proyectos</h1>
      <p>Registre nuevos proyectos y mantenga el seguimiento de su estado.</p>
    </section>
  `,
  styles: [
    `.page-content { padding: 1.5rem; }`,
    `h1 { margin-bottom: 1rem; }`
  ]
})
export class RegistroProyectoComponent {}
