import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { PersonaComponent } from './persona/persona';
import { Login } from './login/login';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'cabildo/censo/gestion-registros',
    component: PersonaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'cabildo/censo/reporte-censal',
    loadComponent: () => import('./feature-placeholder/feature-placeholder.component').then(m => m.FeaturePlaceholderComponent),
    canActivate: [authGuard],
    data: { title: 'Reporte Censal' }
  },
  {
    path: 'cabildo/veredas/asignacion-cargo',
    loadComponent: () => import('./feature-placeholder/feature-placeholder.component').then(m => m.FeaturePlaceholderComponent),
    canActivate: [authGuard],
    data: { title: 'Asignación de Cargo' }
  },
  {
    path: 'cabildo/veredas/reporte-por-anio',
    loadComponent: () => import('./feature-placeholder/feature-placeholder.component').then(m => m.FeaturePlaceholderComponent),
    canActivate: [authGuard],
    data: { title: 'Reporte por Año' }
  },
  {
    path: 'cabildo/obligacion-colaboracion',
    loadComponent: () => import('./feature-placeholder/feature-placeholder.component').then(m => m.FeaturePlaceholderComponent),
    canActivate: [authGuard],
    data: { title: 'Obligación y Colaboración' }
  },
  {
    path: 'junta-comunal/obligacion-colaboracion',
    loadComponent: () => import('./junta-comunal/obligacion-colaboracion/obligacion-colaboracion.component').then(m => m.JuntaComunalObligacionColaboracionComponent),
    canActivate: [authGuard]
  },
  {
    path: 'junta-comunal/registro-autoridad',
    loadComponent: () => import('./feature-placeholder/feature-placeholder.component').then(m => m.FeaturePlaceholderComponent),
    canActivate: [authGuard],
    data: { title: 'Registro de Autoridad' }
  },
  {
    path: 'junta-comunal/certificados',
    loadComponent: () => import('./feature-placeholder/feature-placeholder.component').then(m => m.FeaturePlaceholderComponent),
    canActivate: [authGuard],
    data: { title: 'Certificados' }
  },
  {
    path: 'junta-comunal/reporte-censal',
    loadComponent: () => import('./feature-placeholder/feature-placeholder.component').then(m => m.FeaturePlaceholderComponent),
    canActivate: [authGuard],
    data: { title: 'Reporte Censal' }
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
