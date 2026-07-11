import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-veredas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './veredas.component.html',
  styleUrls: ['./veredas.component.scss']
})
export class RegistroVeredasComponent {
  protected readonly title = 'Registro de veredas';
  protected readonly description = 'Registra nuevas veredas, actualiza su información y consulta el listado de veredas existentes.';
}
