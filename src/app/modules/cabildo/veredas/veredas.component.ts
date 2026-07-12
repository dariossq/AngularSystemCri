import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VeredasService } from '../../../core/services/veredas.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registro-veredas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './veredas.component.html',
  styleUrls: ['./veredas.component.scss']
})
export class RegistroVeredasComponent {
  protected readonly title = 'Registro de veredas';
  protected readonly description = 'Registra nuevas veredas, actualiza su información y consulta el listado de veredas existentes.';
  protected veredaNombre = signal('');
  protected veredaUbicacion = signal('');
  protected veredas = signal<any[]>([]);
  protected errorMessage = signal('');
  protected successMessage = signal('');
  protected errores: { [key: string]: string } = {};
  protected mostrarErrores = false;

  private veredasService = inject(VeredasService);
  private authService = inject(AuthService);
  protected currentUser = this.authService.getCurrentUser();

  ngOnInit(): void {
    this.loadVeredas();
  }

  protected loadVeredas(): void {
    const usuario = this.currentUser();
    const usuarioId = typeof usuario?.id === 'number' ? usuario.id : Number(usuario?.id);

    if (!Number.isFinite(usuarioId)) {
      console.error('No se encontró el ID de empresa para cargar veredas.');
      this.veredas.set([]);
      return;
    }

    this.veredasService.getByUsuarioId(usuarioId).subscribe({
      next: (list) => this.veredas.set(list || []),
      error: (err) => {
        console.error('Error cargando veredas por empresa:', err);
      }
    });
  }

  protected onRegister(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.errores = {};
    this.mostrarErrores = true;

    const nombre = this.veredaNombre().trim();
    const ubicacion = this.veredaUbicacion().trim();

    // Validar campos
    if (!nombre) {
      this.errores['veredaNombre'] = 'Nombre vereda es requerido';
    }
    if (!ubicacion) {
      this.errores['veredaUbicacion'] = 'Descripción geográfica es requerida';
    }

    // Si hay errores, no continuar
    if (Object.keys(this.errores).length > 0) {
      return;
    }

    const usuario = this.currentUser();

    if (!usuario?.id) {
      this.errorMessage.set('No se encontró el usuario autenticado. Inicia sesión nuevamente.');
      return;
    }

    const userId = typeof usuario.id === 'number' ? usuario.id : Number(usuario.id);

    if (!Number.isFinite(userId)) {
      this.errorMessage.set('El usuario autenticado no tiene un ID válido. Vuelve a iniciar sesión.');
      return;
    }

    const payload = {
      veredaNom: nombre,
      veredaUbicacion: ubicacion,
      usuarioId: userId
    };

    this.veredasService.create(payload).subscribe({
      next: (created) => {
        this.veredas.set([created, ...this.veredas()]);
        this.veredaNombre.set('');
        this.veredaUbicacion.set('');
        this.successMessage.set('Vereda registrada correctamente.');
        this.errores = {};
        this.mostrarErrores = false;
        // Cerrar el modal de éxito después de 3 segundos
        setTimeout(() => {
          this.successMessage.set('');
        }, 3000);
      },
      error: (err) => {
        console.error('Error creando vereda:', err);
        this.errorMessage.set('Error al registrar la vereda. Verifica el servidor o los datos.');
      }
    });
  }

  protected onDelete(id: any): void {
    if (!id) return;
    this.veredasService.delete(id).subscribe({
      next: () => this.veredas.set(this.veredas().filter(v => v.id !== id)),
      error: (err) => console.error('Error eliminando vereda:', err)
    });
  }

  // Placeholder para editar (se puede implementar UI de edición)
  protected onEdit(item: any): void {
    // Por ahora solo rellenar el formulario para edición rápida
    if (!item) return;
    this.veredaNombre.set(item.veredaNom || item.veredaNombre || '');
    this.veredaUbicacion.set(item.veredaUbicacion || '');
  }

  protected cerrarMensajeExito(): void {
    this.successMessage.set('');
  }
}
