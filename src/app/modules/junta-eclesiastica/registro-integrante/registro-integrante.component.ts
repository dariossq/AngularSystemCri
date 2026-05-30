import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-junta-eclesiastica-registro-integrante',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registro-integrante.component.html',
  styleUrls: ['./registro-integrante.component.scss']
})
export class JuntaEclesiasticaRegistroIntegranteComponent {
  protected readonly title = 'Registro de integrante';
  protected readonly description = 'Registre y gestione a los integrantes de la junta eclesiástica, sus roles y datos de contacto.';
}
