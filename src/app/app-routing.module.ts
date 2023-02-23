import { NgModule } from '@angular/core';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './components/login/login.component';
import { PersonalInformationFormComponent } from './components/personal-information-form/personal-information-form.component';
import { MapsComponent } from './components/mapsPrueba/maps/maps.component';
import { AcademicFormComponent } from './components/academic-forms/academic-form.component';
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
    component: PersonalInformationFormComponent,
  },
  {
    path: 'academic-profile-form',
    component: AcademicFormComponent,
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
