import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actas-documentos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-body">
        <h4>Actas y Documentos</h4>
        <p>Página de actas y documentos (placeholder).</p>
      </div>
    </div>
  `,
  styles: [`.card{background:#fff}`]
})
export class ActasDocumentosComponent {}
