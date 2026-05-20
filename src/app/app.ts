import { Component, signal } from '@angular/core';
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
    this.menuOpen.update(value => !value);
  }

  toggleCabildo() {
    this.cabildoOpen.update(value => !value);
  }
}
