import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-certificados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificados.component.html',
  styleUrls: ['./certificados.component.scss']
})
export class CertificadosComponent {
  protected readonly title = 'Certificados';
  protected readonly description = 'Gestione la emisión y seguimiento de certificados expedidos por la junta comunal.';
}
