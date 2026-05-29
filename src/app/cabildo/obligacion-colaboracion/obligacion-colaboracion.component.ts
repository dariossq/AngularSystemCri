import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cabildo-obligacion-colaboracion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './obligacion-colaboracion.component.html',
  styleUrls: ['./obligacion-colaboracion.component.scss']
})
export class CabildoObligacionColaboracionComponent {
  protected readonly title = 'Obligación y Colaboración';
  protected readonly description = 'Gestione las obligaciones, compromisos y colaboraciones del cabildo indígena.';
}
