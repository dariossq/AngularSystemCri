import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { Usuario } from '../shared/models/usuario.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit {
  // Modo de formulario: 'login' o 'register'
  protected isLoginMode = signal(true);

  // Datos del formulario de login
  protected loginUsername = signal('');
  protected loginPassword = signal('');
  // Empresas disponibles y selección
  protected companies = signal<Usuario[]>([]);
  protected selectedCompany = signal<number | null>(null);

  // Datos del formulario de registro
  protected registerUsername = signal('');
  protected registerEmail = signal('');
  protected registerPassword = signal('');
  protected registerConfirmPassword = signal('');

  // Estados
  protected errorMessage = signal('');
  protected successMessage = signal('');
  protected isLoading = signal(false);
  protected showPassword = signal(false);
  protected showConfirmPassword = signal(false);
  protected loadingCompanies = signal(false);
  protected validatingAccess = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  // Cargar empresas desde la API
  private loadCompanies(): void {
    this.loadingCompanies.set(true);
    this.authService.getUsuarios().subscribe({
      next: (usuarios) => {
        const normalized = usuarios.map((u: any) => ({
          ...u,
          usuarioId: u.usuarioId ?? u.id ?? u.USUARIO_ID ?? u.usuario_Id ?? u.usuarioId
        }));
        this.companies.set(normalized);
        this.loadingCompanies.set(false);
      },
      error: (error) => {
        console.error('Error al cargar empresas:', error);
        this.errorMessage.set('No se pudieron cargar las empresas');
        this.loadingCompanies.set(false);
      }
    });
  }

  // Cambiar entre modo login y registro
  protected toggleMode(): void {
    this.isLoginMode.update(mode => !mode);
    this.clearMessages();
  }

  // Limpiar mensajes
  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }
// Manejar cambio de empresa seleccionada
  protected onCompanyChange(companyId: number | null): void {
    this.clearMessages();

    if (companyId === null) {
      this.selectedCompany.set(null);
      return;
    }

    const usuarioId = Number(companyId);
    if (!Number.isFinite(usuarioId)) {
      this.rejectCompanySelection();
      return;
    }

    this.selectedCompany.set(usuarioId);
    this.validatingAccess.set(true);
    // Llamada a la API para validar acceso
    this.authService.getAcceso(usuarioId).subscribe({
      next: (acceso) => {
        const accesoEmpresa = Array.isArray(acceso)
          ? acceso.find(item => Number(item.usuarioId) === usuarioId) ?? acceso[0]
          : acceso;
        const fechaInicio = accesoEmpresa?.fechaIAcceso ?? accesoEmpresa?.fechaIAcceso;
        const fechaFin = accesoEmpresa?.fechaFAcceso ?? accesoEmpresa?.fechaFAcceso;

        // Validar si la fecha actual está dentro del rango permitido
        if (this.isCurrentDateWithinRange(fechaInicio, fechaFin)) {
          this.selectedCompany.set(usuarioId);
        } else {
          this.rejectCompanySelection();
        }
        this.validatingAccess.set(false);
      },
      error: (error) => {
        console.error('Error al validar acceso:', error);
        this.rejectCompanySelection();
        this.validatingAccess.set(false);
      }
    });
  }

  // Rechazar selección de empresa y mostrar mensaje de error
  private rejectCompanySelection(): void {
    this.selectedCompany.set(null);
    this.errorMessage.set('No tiene los permisos adecuados para seleccionar la empresa');
  }

  /// Validar si la fecha actual está dentro del rango proporcionado
  private isCurrentDateWithinRange(startValue?: string, endValue?: string): boolean {
    const start = this.parseApiDate(startValue);
    const end = this.parseApiDate(endValue);
    if (!start || !end) return false;

    const today = new Date();
    const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const rangeStart = start <= end ? start : end;
    const rangeEnd = start <= end ? end : start;
    return current >= rangeStart && current <= rangeEnd;
  }

  /// Convertir fecha de API (YYYY-MM-DD) a objeto Date
  private parseApiDate(value?: string): Date | null {
    if (!value) return null;

    const [datePart] = value.split('T');
    const parts = datePart.split('-').map(Number);
    if (parts.length !== 3 || parts.some(part => !Number.isFinite(part))) return null;

    const [year, month, day] = parts;
    return new Date(year, month - 1, day);
  }

  // Realizar login
  protected onLogin(): void {
    this.clearMessages();

    if (this.validatingAccess()) {
      this.errorMessage.set('Espera mientras se valida el acceso a la empresa');
      return;
    }

    if (this.selectedCompany() === null || !this.loginUsername() || !this.loginPassword()) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    this.isLoading.set(true);
    // Llamada remota al backend. AuthService.loginRemote codifica la contraseña
    // de la misma forma que el backend C# (UTF-16LE -> Base64) antes de comparar.
    const selected = this.companies().find(c => c.usuarioId === Number(this.selectedCompany()));
    this.authService.loginRemote(
      this.loginUsername(),
      this.loginPassword(),
      Number(this.selectedCompany()),
      selected?.usuarioNombre
    ).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage.set('¡Login exitoso!');
          setTimeout(() => this.router.navigate(['/']), 800);
        } else {
          this.errorMessage.set('Usuario o contraseña incorrectos');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al autenticar:', err);
        this.errorMessage.set('Ocurrió un error al conectar con el servidor');
        this.isLoading.set(false);
      }
    });
  }

  // Realizar registro
  protected onRegister(): void {
    this.clearMessages();

    if (
      !this.registerUsername() ||
      !this.registerEmail() ||
      !this.registerPassword() ||
      !this.registerConfirmPassword()
    ) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    if (this.registerPassword() !== this.registerConfirmPassword()) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    if (this.registerPassword().length < 6) {
      this.errorMessage.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerEmail())) {
      this.errorMessage.set('Por favor ingresa un email válido');
      return;
    }

    this.isLoading.set(true);

    // Simular delay de registro
    setTimeout(() => {
      const success = this.authService.register(
        this.registerUsername(),
        this.registerEmail(),
        this.registerPassword(),
        this.registerConfirmPassword()
      );

      if (success) {
        this.successMessage.set('¡Registro exitoso! Iniciando sesión...');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      } else {
        this.errorMessage.set(
          'El usuario ya existe o hay un error en el registro'
        );
      }

      this.isLoading.set(false);
    }, 800);
  }

  // Alternar visibilidad de contraseña
  protected togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  protected toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(show => !show);
  }
}
