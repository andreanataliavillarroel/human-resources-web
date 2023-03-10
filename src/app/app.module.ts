import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatTreeModule } from '@angular/material/tree';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LogInComponent } from './components/login/login.component';
import { EmployeeFormComponent } from './components/personal-information-form/employee-form/employee-form.component';
import { ContactFormComponent } from './components/personal-information-form/contact-form/contact-form.component';
import { AddressFormComponent } from './components/personal-information-form/address-form/address-form.component';
import { FinantialInformationFormComponent } from './components/personal-information-form/finantial-information-form/finantial-information-form.component';
import { ChildFormComponent } from './components/personal-information-form/child-form/child-form.component';
import { PersonalInformationFormComponent } from './components/personal-information-form/personal-information-form.component';

import { MapsComponent } from './components/mapsPrueba/maps/maps.component';
import { AcademicFormComponent } from './components/academic-forms/academic-form.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidenavContentComponent } from './components/sidenav-content/sidenav-content.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LogInComponent,
    EmployeeFormComponent,
    ContactFormComponent,
    AddressFormComponent,
    FinantialInformationFormComponent,
    ChildFormComponent,
    PersonalInformationFormComponent,
    AcademicFormComponent,
    MapsComponent,
    EmployeesComponent,
    ToolbarComponent,
    SidenavContentComponent,
    LayoutComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    HttpClientModule,
    GoogleMapsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatSelectModule,
    MatStepperModule,
    MatRadioModule,
    MatTreeModule,
  ],
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'es-ES',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
