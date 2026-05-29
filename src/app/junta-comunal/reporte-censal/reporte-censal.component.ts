import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reporte-censal-junta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reporte-censal.component.html',
  styleUrls: ['./reporte-censal.component.scss']
})
export class ReporteCensalJuntaComponent {
  protected readonly title = 'Reporte Censal';
  protected readonly description = 'Visualice análisis y estadísticas de la población registrada en la junta comunal.';
}
