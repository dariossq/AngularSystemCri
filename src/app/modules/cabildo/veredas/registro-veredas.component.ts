import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-veredas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-content">
      <h1>Registro de veredas</h1>
      <p>Use este espacio para registrar nuevas veredas y administrar sus datos básicos.</p>
    </section>
  `,
  styles: [
    `.page-content { padding: 1.5rem; }`,
    `h1 { margin-bottom: 1rem; }`
  ]
})
export class RegistroVeredasComponent {}
