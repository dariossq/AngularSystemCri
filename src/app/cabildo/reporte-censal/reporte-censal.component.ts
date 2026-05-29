import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonaService } from '../../services/persona.service';

@Component({
  selector: 'app-reporte-censal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reporte-censal.component.html',
  styleUrls: ['./reporte-censal.component.scss']
})
export class ReporteCensalComponent {
  private personaService = inject(PersonaService);

  protected readonly title = 'Reporte Censal';
  protected readonly description = 'Visualice el análisis y estadísticas del censo. Incluye datos demográficos, familiares y de ubicación.';

  protected personas = this.personaService.personas;

  protected get totalPersonas(): number {
    return this.personas().length;
  }

  protected get estadisticas() {
    const datos = this.personas();
    return {
      hombres: datos.filter(p => p.genero === 'Masculino').length,
      mujeres: datos.filter(p => p.genero === 'Femenino').length,
      activos: datos.filter(p => p.estado === 'Activo').length,
      inactivos: datos.filter(p => p.estado === 'Inactivo').length
    };
  }
}
