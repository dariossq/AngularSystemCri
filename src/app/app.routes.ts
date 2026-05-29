import { Routes } from '@angular/router';
import { Login } from './login/login';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: '',
    loadComponent: () => import('./shell/shell').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home').then(m => m.HomeComponent)
      },
      {
        path: 'cabildo/censo/gestion-registros',
        loadComponent: () => import('./modules/cabildo/persona/persona').then(m => m.PersonaComponent)
      },
      {
        path: 'cabildo/censo/reporte-censal',
        loadComponent: () => import('./modules/cabildo/reporte-censal/reporte-censal.component').then(m => m.ReporteCensalComponent)
      },
      {
        path: 'cabildo/veredas/registro-veredas',
        loadComponent: () => import('./modules/cabildo/veredas/registro-veredas.component').then(m => m.RegistroVeredasComponent)
      },
      {
        path: 'cabildo/veredas/asignacion-cargo',
        loadComponent: () => import('./modules/cabildo/veredas/asignacion-cargo/asignacion-cargo.component').then(m => m.AsignacionCargoComponent)
      },
      {
        path: 'cabildo/veredas/reporte-por-anio',
        loadComponent: () => import('./modules/cabildo/veredas/reporte-por-anio/reporte-por-anio.component').then(m => m.ReportePorAnioComponent)
      },
      {
        path: 'cabildo/obligacion-colaboracion',
        loadComponent: () => import('./modules/cabildo/obligacion-colaboracion/obligacion-colaboracion.component').then(m => m.CabildoObligacionColaboracionComponent)
      },
      {
        path: 'cabildo/certificados',
        loadComponent: () => import('./modules/cabildo/certificados/certificados.component').then(m => m.CabildoCertificadosComponent)
      },
      {
        path: 'cabildo/proyectos/ayudas-comuneros',
        loadComponent: () => import('./modules/cabildo/proyectos/ayudas-comuneros.component').then(m => m.AyudasComunerosComponent)
      },
      {
        path: 'cabildo/proyectos/registro',
        loadComponent: () => import('./modules/cabildo/proyectos/registro.component').then(m => m.RegistroProyectoComponent)
      },
      {
        path: 'junta-comunal/obligacion-colaboracion',
        loadComponent: () => import('./modules/junta-comunal/obligacion-colaboracion/obligacion-colaboracion.component').then(m => m.JuntaComunalObligacionColaboracionComponent)
      },
      {
        path: 'junta-comunal/registro-autoridad',
        loadComponent: () => import('./modules/junta-comunal/registro-autoridad/registro-autoridad.component').then(m => m.RegistroAutoridadComponent)
      },
      {
        path: 'junta-comunal/certificados',
        loadComponent: () => import('./modules/junta-comunal/certificados/certificados.component').then(m => m.CertificadosComponent)
      },
      {
        path: 'junta-comunal/reporte-censal',
        loadComponent: () => import('./modules/junta-comunal/reporte-censal/reporte-censal.component').then(m => m.ReporteCensalJuntaComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
