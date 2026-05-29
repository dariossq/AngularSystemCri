import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { PersonaComponent } from './modules/cabildo/persona/persona';
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
    loadComponent: () => import('./modules/cabildo/reporte-censal/reporte-censal.component').then(m => m.ReporteCensalComponent),
    canActivate: [authGuard]
  },
  {
    path: 'cabildo/veredas/asignacion-cargo',
    loadComponent: () => import('./modules/cabildo/veredas/asignacion-cargo/asignacion-cargo.component').then(m => m.AsignacionCargoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'cabildo/veredas/reporte-por-anio',
    loadComponent: () => import('./modules/cabildo/veredas/reporte-por-anio/reporte-por-anio.component').then(m => m.ReportePorAnioComponent),
    canActivate: [authGuard]
  },
  {
    path: 'cabildo/obligacion-colaboracion',
    loadComponent: () => import('./modules/cabildo/obligacion-colaboracion/obligacion-colaboracion.component').then(m => m.CabildoObligacionColaboracionComponent),
    canActivate: [authGuard]
  },
  {
    path: 'junta-comunal/obligacion-colaboracion',
    loadComponent: () => import('./modules/junta-comunal/obligacion-colaboracion/obligacion-colaboracion.component').then(m => m.JuntaComunalObligacionColaboracionComponent),
    canActivate: [authGuard]
  },
  {
    path: 'junta-comunal/registro-autoridad',
    loadComponent: () => import('./modules/junta-comunal/registro-autoridad/registro-autoridad.component').then(m => m.RegistroAutoridadComponent),
    canActivate: [authGuard]
  },
  {
    path: 'junta-comunal/certificados',
    loadComponent: () => import('./modules/junta-comunal/certificados/certificados.component').then(m => m.CertificadosComponent),
    canActivate: [authGuard]
  },
  {
    path: 'junta-comunal/reporte-censal',
    loadComponent: () => import('./modules/junta-comunal/reporte-censal/reporte-censal.component').then(m => m.ReporteCensalJuntaComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
