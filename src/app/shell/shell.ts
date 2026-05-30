import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './shell.html',
  styleUrls: ['./shell.scss']
})
export class ShellComponent {
  protected readonly menuOpen = signal(!this.isMobile());
  private router = inject(Router);
  protected readonly cabildoOpen = signal(false);
  protected readonly guardiaOpen = signal(false);
  protected readonly juntaComunalOpen = signal(false);

  private authService = inject(AuthService);

  constructor() {
    // Close menu on navigation in mobile view
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobile()) {
          this.menuOpen.set(false);
        }
      });
  }

  private isMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }

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
        this.juntaComunalOpen.set(false);
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

  public handleMenuLinkClick(event: Event): void {
    const target = event.target as HTMLElement | null;

    if (this.isMobile() && !!target?.closest('a[routerLink]')) {
      this.closeMenuAndSubmenus();
    }
  }

  public closeMenuAndSubmenus(): void {
    this.menuOpen.set(false);
    this.cabildoOpen.set(false);
    this.guardiaOpen.set(false);
    this.juntaComunalOpen.set(false);
  }

  @HostListener('window:resize')
  public onResize(): void {
    if (this.isMobile()) {
      this.menuOpen.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  public closeSubmenuOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    const isMobileView = this.isMobile();

    // Close menu on route selection in mobile view
    if (isMobileView && !!target?.closest('a[routerLink]')) {
      this.closeMenuAndSubmenus();
      return;
    }

    // Close all submenus
    if (!target?.closest('.sidebar-submenu-item')) {
      this.cabildoOpen.set(false);
      this.guardiaOpen.set(false);
      this.juntaComunalOpen.set(false);
    }

    // Close menu on outside click in mobile view
    if (isMobileView && !target?.closest('.app-sidebar') && !target?.closest('button.menu-toggle')) {
      this.menuOpen.set(false);
    }
  }
}
