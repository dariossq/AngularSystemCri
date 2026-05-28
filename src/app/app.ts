import { Component, HostListener, OnDestroy, signal, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('SystemCri');
  protected readonly menuOpen = signal(true);
  protected readonly cabildoOpen = signal(false);
  protected readonly guardiaOpen = signal(false);
  protected readonly juntaComunalOpen = signal(false);

  // Inyectar servicio de autenticación y router
  private authService = inject(AuthService);
  private router = inject(Router);

  // Obtener usuario actual del servicio de autenticación
  protected currentUser = this.authService.getCurrentUser();
  protected isAuthenticated = this.authService.isAuthenticated();
  protected showShell = signal(this.router.url !== '/login' && this.isAuthenticated());
  private readonly routerSubscription = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd)
  ).subscribe(() => {
    this.showShell.set(this.router.url !== '/login' && this.isAuthenticated());
  });

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

  public ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
