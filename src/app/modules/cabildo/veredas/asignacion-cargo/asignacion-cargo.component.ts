import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asignacion-cargo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asignacion-cargo.component.html',
  styleUrls: ['./asignacion-cargo.component.scss']
})
export class AsignacionCargoComponent {
  protected readonly title = 'Asignación de Cargo';
  protected readonly description = 'Gestione la asignación de cargos y responsabilidades en las veredas. Registre autoridades y sus funciones.';
}
