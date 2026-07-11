import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reporte-por-anio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-content">
      <h1>Reporte por Año</h1>
      <p>Visualice los reportes de veredas agrupados por año.</p>
    </section>
  `,
  styles: [
    `.page-content { padding: 1.5rem; }`,
    `h1 { margin-bottom: 1rem; }`
  ]
})
export class ReportePorAnioComponent {}
