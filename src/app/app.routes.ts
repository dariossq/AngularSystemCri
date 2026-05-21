import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { PersonaComponent } from './persona/persona';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'cabildo/censo/gestion-registros',
    component: PersonaComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
