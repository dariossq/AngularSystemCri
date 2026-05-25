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
    path: '**',
    redirectTo: 'login'
  }
];
