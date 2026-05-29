import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ayudas-comuneros',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-content">
      <h1>Ayudas a comuneros</h1>
      <p>Registre y gestione ayudas, proyectos y aportes dirigidos a los comuneros.</p>
    </section>
  `,
  styles: [
    `.page-content { padding: 1.5rem; }`,
    `h1 { margin-bottom: 1rem; }`
  ]
})
export class AyudasComunerosComponent {}
