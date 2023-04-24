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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
import { SidenavContentComponent } from './components/menu/sidenav-content/sidenav-content.component';
import { LayoutComponent } from './components/menu/layout/layout.component';
import { HeaderComponent } from './components/menu/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { AddressesComponent } from './components/addresses/addresses.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { PersonalDocumentationComponent } from './components/personal-information-form/personal-documentation-form/personal-documentation-form.component';
import { FileDragAndDropBoxComponent } from './components/file-drag-and-drop-box/file-drag-and-drop-box.component';
import { ChartsComponent } from './components/charts/charts.component';
import { PersonalAcademicFormComponent } from './components/personal-academic-form/personal-academic-form.component';
import { AcademicProfileFormComponent } from './components/personal-academic-form/academic-profile-form/academic-profile-form.component';
import { AcademiaDigitalFormComponent } from './components/personal-academic-form/academia-digital-form/academia-digital-form.component';
import { CertificationFormComponent } from './components/personal-academic-form/certification-form/certification-form.component';
import { UndergraduateStudiesFormComponent } from './components/personal-academic-form/undergraduate-studies-form/undergraduate-studies-form.component';
import { PostgraduateStudiesFormComponent } from './components/personal-academic-form/postgraduate-studies-form/postgraduate-studies-form.component';
import { SkillsFormComponent } from './components/personal-academic-form/skills-form/skills-form.component';

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
    SidenavContentComponent,
    LayoutComponent,
    HeaderComponent,
    HomeComponent,
    AddressesComponent,
    ProfileComponent,
    EmployeeComponent,
    DocumentationComponent,
    PersonalDocumentationComponent,
    FileDragAndDropBoxComponent,
    ChartsComponent,
    PersonalAcademicFormComponent,
    AcademicProfileFormComponent,
    AcademiaDigitalFormComponent,
    CertificationFormComponent,
    UndergraduateStudiesFormComponent,
    PostgraduateStudiesFormComponent,
    SkillsFormComponent,
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
    MatPaginatorModule,
    MatGridListModule,
    DragDropModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
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
