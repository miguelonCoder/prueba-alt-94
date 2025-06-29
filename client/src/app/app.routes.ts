import { Routes } from '@angular/router';
import { Main } from './pages/main/main';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
  {
    path: '',
    component: Main,
  },
  {
    path: 'propiedad/:id',
    component: Profile,
  },
];
