import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-junta-eclesiastica-certificados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificados.component.html',
  styleUrls: ['./certificados.component.scss']
})
export class JuntaEclesiasticaCertificadosComponent {
  protected readonly title = 'Certificados';
  protected readonly description = 'Emita y administre certificados oficiales de la junta eclesiástica.';
}
