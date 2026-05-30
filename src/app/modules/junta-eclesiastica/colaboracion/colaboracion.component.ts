import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-junta-eclesiastica-colaboracion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './colaboracion.component.html',
  styleUrls: ['./colaboracion.component.scss']
})
export class JuntaEclesiasticaColaboracionComponent {
  protected readonly title = 'Colaboración';
  protected readonly description = 'Administre los acuerdos, colaboraciones y solicitudes de apoyo dentro de la junta eclesiástica.';
}
