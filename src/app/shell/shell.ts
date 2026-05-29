import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './shell.html',
  styleUrls: ['./shell.scss']
})
export class ShellComponent {
  protected readonly menuOpen = signal(true);
  protected readonly cabildoOpen = signal(false);
  protected readonly guardiaOpen = signal(false);
  protected readonly juntaComunalOpen = signal(false);

  private authService = inject(AuthService);

  protected currentUser = this.authService.getCurrentUser();
  protected isAuthenticated = this.authService.isAuthenticated();

  public toggleMenu() {
    this.menuOpen.update(value => {
      const nextValue = !value;

      if (!nextValue) {
        this.cabildoOpen.set(false);
        this.guardiaOpen.set(false);
        this.juntaComunalOpen.set(false);
      }

      return nextValue;
    });
  }

  public toggleCabildo() {
    this.cabildoOpen.update(value => {
      const nextValue = !value;

      if (nextValue) {
        this.guardiaOpen.set(false);
      }

      return nextValue;
    });
  }

  public toggleGuardia() {
    this.guardiaOpen.update(value => {
      const nextValue = !value;

      if (nextValue) {
        this.cabildoOpen.set(false);
        this.juntaComunalOpen.set(false);
      }

      return nextValue;
    });
  }

  public toggleJuntaComunal() {
    this.juntaComunalOpen.update(value => {
      const nextValue = !value;

      if (nextValue) {
        this.cabildoOpen.set(false);
        this.guardiaOpen.set(false);
      }

      return nextValue;
    });
  }

  // Método para logout
  protected logout(): void {
    this.authService.logout();
  }

  public selectCabildo() {
    this.cabildoOpen.set(true);
    this.guardiaOpen.set(false);
    this.juntaComunalOpen.set(false);
  }

  public selectGuardia() {
    this.guardiaOpen.set(true);
    this.cabildoOpen.set(false);
    this.juntaComunalOpen.set(false);
  }

  public selectJuntaComunal() {
    this.juntaComunalOpen.set(true);
    this.cabildoOpen.set(false);
    this.guardiaOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  public closeSubmenuOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;

    if (!target?.closest('.sidebar-submenu-item')) {
      this.cabildoOpen.set(false);
      this.guardiaOpen.set(false);
      this.juntaComunalOpen.set(false);
    }
  }
}
