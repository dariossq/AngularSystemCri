import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validar-certificacion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-body">
        <h4>Validar Certificación</h4>
        <p>Página para validar certificaciones (placeholder).</p>
      </div>
    </div>
  `,
  styles: [`.card{background:#fff}`]
})
export class ValidarCertificacionComponent {}
