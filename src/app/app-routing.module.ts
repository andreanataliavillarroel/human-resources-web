import { NgModule } from '@angular/core';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './components/login/login.component';
import { FormsComponent } from './components/forms/forms.component';
import { MapsComponent } from './components/mapsPrueba/maps/maps.component';

const routes: Routes = [
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'login',
    component: LogInComponent,
  },
  {
    path: 'forms',
    component: FormsComponent,
  },
  {
    path: 'maps',
    component: MapsComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
