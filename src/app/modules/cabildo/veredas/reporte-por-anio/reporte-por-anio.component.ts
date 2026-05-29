import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reporte-por-anio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reporte-por-anio.component.html',
  styleUrls: ['./reporte-por-anio.component.scss']
})
export class ReportePorAnioComponent {
  protected readonly title = 'Reporte por Año';
  protected readonly description = 'Visualice análisis y reportes anuales de las actividades y gestión de las veredas.';
}
