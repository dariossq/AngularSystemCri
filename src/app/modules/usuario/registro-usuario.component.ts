import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-body">
        <h4>Registro usuario</h4>
        <p>Página de registro de usuario (placeholder).</p>
      </div>
    </div>
  `,
  styles: [`.card{background:#fff}`]
})
export class RegistroUsuarioComponent {}
