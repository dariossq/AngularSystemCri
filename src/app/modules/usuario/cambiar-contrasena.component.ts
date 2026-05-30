import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cambiar-contrasena',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-body">
        <h4>Cambiar contraseña</h4>
        <p>Página para cambiar contraseña (placeholder).</p>
      </div>
    </div>
  `,
  styles: [`.card{background:#fff}`]
})
export class CambiarContrasenaComponent {}
