import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('SystemCri');
  protected readonly menuOpen = signal(true);
  protected readonly cabildoOpen = signal(true);

  toggleMenu() {
    this.menuOpen.update(value => {
      const nextValue = !value;

      if (!nextValue) {
        this.cabildoOpen.set(false);
      }

      return nextValue;
    });
  }

  toggleCabildo() {
    this.cabildoOpen.update(value => !value);
  }

  openCabildoSubmenu() {
    this.cabildoOpen.set(true);
  }

  closeCabildoSubmenu() {
    this.cabildoOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  closeSubmenuOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;

    if (!target?.closest('.sidebar-submenu-item')) {
      this.cabildoOpen.set(false);
    }
  }
}
