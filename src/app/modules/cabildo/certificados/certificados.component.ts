import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cabildo-certificados',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-content">
      <h1>Certificados</h1>
      <p>Administre expedición y seguimiento de certificados dentro del área de Cabildo.</p>
    </section>
  `,
  styles: [
    `.page-content { padding: 1.5rem; }`,
    `h1 { margin-bottom: 1rem; }`
  ]
})
export class CabildoCertificadosComponent {}
