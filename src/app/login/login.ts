import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  // Modo de formulario: 'login' o 'register'
  protected isLoginMode = signal(true);

  // Datos del formulario de login
  protected loginUsername = signal('');
  protected loginPassword = signal('');

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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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

  // Realizar login
  protected onLogin(): void {
    this.clearMessages();

    if (!this.loginUsername() || !this.loginPassword()) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    this.isLoading.set(true);

    // Simular delay de autenticación
    setTimeout(() => {
      const success = this.authService.login(
        this.loginUsername(),
        this.loginPassword()
      );

      if (success) {
        this.successMessage.set('¡Login exitoso!');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      } else {
        this.errorMessage.set('Usuario o contraseña incorrectos');
      }

      this.isLoading.set(false);
    }, 800);
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
