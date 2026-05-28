import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-feature-placeholder',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="placeholder-page p-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <h1 class="card-title">{{ title }}</h1>
          <p class="card-text mb-4">Esta página todavía no está disponible. El módulo está diseñado para extenderse con datos y componentes específicos más adelante.</p>
          <p class="text-muted">Ruta: <strong>{{ path }}</strong></p>
          <a routerLink="/" class="btn btn-primary">Volver al inicio</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    ".placeholder-page { max-width: 760px; margin: 2rem auto; }",
    ".card-title { font-size: 1.75rem; margin-bottom: 1rem; }"
  ]
})
export class FeaturePlaceholderComponent {
  private route = inject(ActivatedRoute);

  protected get title(): string {
    return (this.route.snapshot.data as { title?: string }).title ?? 'Próxima funcionalidad';
  }

  protected get path(): string {
    return this.route.snapshot.routeConfig?.path ?? '/';
  }
}
