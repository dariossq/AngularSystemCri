import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-autoridad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registro-autoridad.component.html',
  styleUrls: ['./registro-autoridad.component.scss']
})
export class RegistroAutoridadComponent {
  protected readonly title = 'Registro de Autoridad';
  protected readonly description = 'Registre y administre las autoridades de la junta comunal. Incluya datos de contacto y período de funciones.';
}
