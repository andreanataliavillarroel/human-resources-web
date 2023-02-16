import { NgModule } from '@angular/core';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './components/login/login.component';
import { FormsComponent } from './components/forms/forms.component';
import { MapsComponent } from './components/mapsPrueba/maps/maps.component';
import { AcademicFormsComponent } from './components/academic-forms/academic-forms.component';
import { EmployeesComponent } from './components/employees/employees.component';

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
    path: 'personal-information-form',
    component: FormsComponent,
  },
  {
    path: 'academic-profile-form',
    component: AcademicFormsComponent,
  },
  {
    path: 'maps',
    component: MapsComponent,
  },
  {
    path: 'a',
    component: EmployeesComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
