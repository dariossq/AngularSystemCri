import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-junta-comunal-obligacion-colaboracion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './obligacion-colaboracion.component.html',
  styleUrls: ['./obligacion-colaboracion.component.scss']
})
export class JuntaComunalObligacionColaboracionComponent {
  protected readonly title = 'Obligación y Colaboración';
  protected readonly description = 'Gestione las obligaciones, acuerdos y compromisos de la junta comunal. Esta pantalla se puede ampliar con formas, tablas dinámicas y filtros específicos del proceso.';
}
