import { NgModule } from '@angular/core';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './components/login/login.component';
import { PersonalInformationFormComponent } from './components/personal-information-form/personal-information-form.component';
import { MapsComponent } from './components/mapsPrueba/maps/maps.component';
import { AcademicFormComponent } from './components/academic-forms/academic-form.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { LayoutComponent } from './components/menu/layout/layout.component';
import { HomeComponent } from './components/home/home.component';
import { AddressesComponent } from './components/addresses/addresses.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { ChartsComponent } from './components/charts/charts.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    // canActivate: [AuthenticationGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'maps',
        component: MapsComponent,
      },
      {
        path: 'employees',
        component: EmployeesComponent,
      },
      {
        path: 'addresses',
        component: AddressesComponent,
      },
      {
        path: 'my-profile',
        component: ProfileComponent,
      },
      {
        path: 'employees/:id',
        component: EmployeeComponent,
      },
      {
        path: 'chart',
        component: ChartsComponent,
      },
    ],
  },

  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'login',
    component: LogInComponent,
  },
  {
    path: 'form',
    component: PersonalInformationFormComponent,
  },

  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
