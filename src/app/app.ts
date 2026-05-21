import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('SystemCri');
  protected readonly menuOpen = signal(true);
  protected readonly cabildoOpen = signal(false);
  protected readonly guardiaOpen = signal(false);

  public toggleMenu() {
    this.menuOpen.update(value => {
      const nextValue = !value;

      if (!nextValue) {
        this.cabildoOpen.set(false);
        this.guardiaOpen.set(false);
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
      }

      return nextValue;
    });
  }

  public selectCabildo() {
    this.cabildoOpen.set(true);
    this.guardiaOpen.set(false);
  }

  public selectGuardia() {
    this.guardiaOpen.set(true);
    this.cabildoOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  public closeSubmenuOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;

    if (!target?.closest('.sidebar-submenu-item')) {
      this.cabildoOpen.set(false);
      this.guardiaOpen.set(false);
    }
  }
}
