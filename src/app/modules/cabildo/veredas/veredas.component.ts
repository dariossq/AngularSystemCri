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
  protected searchTerm = signal('');
  protected veredaEditando = signal<any | null>(null);
  protected mostrarModalEdicion = signal(false);
  protected errorMessage = signal('');
  protected successMessage = signal('');
  protected errores: { [key: string]: string } = {};
  protected mostrarErrores = false;

  // Paginación
  protected currentPage = signal(1);
  protected pageSize = signal(10);
  protected pageSizeOptions = [5, 10, 15, 20];

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

  protected onUpdate(): void {
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

    const veredaEditando = this.veredaEditando();
    if (!veredaEditando || !veredaEditando.id) {
      this.errorMessage.set('No se encontró la vereda a actualizar.');
      return;
    }

    const usuarioId = Number(veredaEditando.usuarioId ?? this.currentUser()?.id ?? 0);

    if (!Number.isFinite(usuarioId)) {
      this.errorMessage.set('No se encontró el usuario para actualizar la vereda.');
      return;
    }

    const payload = {
      veredaNom: nombre,
      veredaUbicacion: ubicacion,
      usuarioId
    };

    this.veredasService.update(veredaEditando.id, payload).subscribe({
      next: (updated) => {
        // Actualizar en la lista local y refrescar desde el servidor para asegurar datos actuales.
        const veredasActualizadas = this.veredas().map(v => 
          v.id === veredaEditando.id ? updated : v
        );
        this.veredas.set(veredasActualizadas);
        this.loadVeredas();
        
        this.veredaNombre.set('');
        this.veredaUbicacion.set('');
        this.veredaEditando.set(null);
        this.mostrarModalEdicion.set(false);
        this.successMessage.set('Vereda actualizada correctamente.');
        this.errores = {};
        this.mostrarErrores = false;
        
        // Cerrar el modal de éxito después de 3 segundos
        setTimeout(() => {
          this.successMessage.set('');
        }, 3000);
      },
      error: (err) => {
        console.error('Error actualizando vereda:', err);
        this.errorMessage.set('Error al actualizar la vereda. Verifica el servidor o los datos.');
      }
    });
  }

  protected onCancel(): void {
    this.veredaNombre.set('');
    this.veredaUbicacion.set('');
    this.errores = {};
    this.mostrarErrores = false;
    this.errorMessage.set('');
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
    if (!item) return;
    this.veredaEditando.set(item);
    this.veredaNombre.set(item.veredaNom || item.veredaNombre || '');
    this.veredaUbicacion.set(item.veredaUbicacion || '');
    this.mostrarModalEdicion.set(true);
    this.errores = {};
    this.mostrarErrores = false;

    // Cerrar la modal automáticamente después de 3 segundos
    setTimeout(() => {
      this.mostrarModalEdicion.set(false);
    }, 3000);
  }

  protected cerrarModalEdicion(): void {
    this.mostrarModalEdicion.set(false);
    this.veredaEditando.set(null);
    this.veredaNombre.set('');
    this.veredaUbicacion.set('');
    this.errores = {};
    this.mostrarErrores = false;
  }

  protected cerrarMensajeExito(): void {
    this.successMessage.set('');
  }

  protected limpiarError(campo: string, valor: any): void {
    if (valor !== '' && valor !== null && valor !== undefined) {
      delete this.errores[campo];
    }
  }

  protected validarCampo(campo: string): void {
    const valor = campo === 'veredaNombre' 
      ? this.veredaNombre().trim()
      : campo === 'veredaUbicacion'
      ? this.veredaUbicacion().trim()
      : '';

    if (!valor) {
      if (campo === 'veredaNombre') {
        this.errores[campo] = 'Nombre vereda es requerido';
      } else if (campo === 'veredaUbicacion') {
        this.errores[campo] = 'Descripción geográfica es requerida';
      }
    } else {
      delete this.errores[campo];
    }
  }

  // Métodos de paginación
  protected getVeredasFiltradas(): any[] {
    const veredas = this.veredas();
    const search = this.searchTerm().toLowerCase().trim();

    if (!search) {
      return veredas;
    }

    return veredas.filter(v => {
      const nombre = (v.veredaNom || v.veredaNombre || v.nombre || '').toLowerCase();
      const ubicacion = (v.veredaUbicacion || '').toLowerCase();
      return nombre.includes(search) || ubicacion.includes(search);
    });
  }

  protected getVeredasPaginadas(): any[] {
    const veredasFiltradas = this.getVeredasFiltradas();
    const pageSize = this.pageSize();
    const currentPage = this.currentPage();
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return veredasFiltradas.slice(startIndex, endIndex);
  }

  protected getTotalPages(): number {
    const total = this.getVeredasFiltradas().length;
    const pageSize = this.pageSize();
    return Math.ceil(total / pageSize);
  }

  protected cambiarPagina(page: number): void {
    const totalPages = this.getTotalPages();
    if (page >= 1 && page <= totalPages) {
      this.currentPage.set(page);
      // Scroll al inicio de la tabla
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  protected cambiarTamanioPagina(size: number | string): void {
    this.pageSize.set(Number(size));
    this.currentPage.set(1); // Volver a la primera página
  }

  protected onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1); // Volver a la primera página cuando se busca
  }

  protected limpiarBusqueda(): void {
    this.searchTerm.set('');
    this.currentPage.set(1);
  }

  protected getPaginas(): number[] {
    const totalPages = this.getTotalPages();
    const currentPage = this.currentPage();
    const pagesToShow = 5;
    const paginas: number[] = [];

    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    if (endPage - startPage + 1 < pagesToShow) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  protected getRangoVisible(): string {
    const pageSize = this.pageSize();
    const currentPage = this.currentPage();
    const total = this.getVeredasFiltradas().length;

    const desde = (currentPage - 1) * pageSize + 1;
    const hasta = Math.min(currentPage * pageSize, total);

    return `${desde}-${hasta} de ${total}`;
  }

  protected puedeAnterior(): boolean {
    return this.currentPage() > 1;
  }

  protected puedeSiguiente(): boolean {
    return this.currentPage() < this.getTotalPages();
  }
}
