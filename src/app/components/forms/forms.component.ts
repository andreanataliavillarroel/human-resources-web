import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createEmployeeDto } from 'src/app/dto/employee.dto';
import { AccountType } from 'src/app/enum/account-type.enum';
import { AfpType } from 'src/app/enum/afp-type.enum';
import { Classification } from 'src/app/enum/classification.enum';
import { Sex } from 'src/app/enum/gender.enum';
import { MaritalStatus } from 'src/app/enum/marital-status.enum';
import { CategoryService } from 'src/app/services/category/category.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { EMAIL_REGULAR_EXPRESSION, NAME_REGULAR_EXPRESSION } from 'src/regex';
import { DatePipe } from '@angular/common';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  public form!: FormGroup;
  public contactForm!: FormGroup;
  public finaltialInformationForm!: FormGroup;
  public addressForm!: FormGroup;

  public genderOptions = Object.values(Sex);
  public classificationOptions = Object.values(Classification);
  public accountOptions = Object.values(AccountType);
  public maritalStatusOptions = Object.values(MaritalStatus);
  public afpOptions = Object.values(AfpType);
  public categories: any;
  public pipe = new DatePipe('en-US');
  public currentDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');

  public center!: google.maps.LatLngLiteral;
  public zoom = 15;

  public markerOptions!: google.maps.MarkerOptions;
  public markerPosition!: google.maps.LatLngLiteral;
  public linkGoogleMaps!: string;
  // @ViewChild(MapInfoWindow) info!: MapInfoWindow;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService,
    private categoryService: CategoryService
  ) {
    this.loadCategories();
  }

  ngOnInit(): void {
    this.buildForm();
    this.initMap();
  }

  public initMap() {
    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.markerPosition = this.center;
      this.linkGoogleMaps = this.getGoogleMapsLink();
    });

    this.markerOptions = {
      draggable: true,
    };
  }

  public onSubmit() {
    this.employeeService.createEmployee(this.buildEmployeePayload()).subscribe({
      next: () => {
        this.snackBar.open('Success', 'OK', { duration: 5000 });
        this.form.reset();
        this.onSubmitFinantialInformation();
      },
      error: (data: any) => {
        this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
      },
    });
  }

  public onSubmitFinantialInformation() {
    this.employeeService.createEmployee(this.buildEmployeePayload()).subscribe({
      next: () => {
        this.snackBar.open('Success', 'OK', { duration: 5000 });
        this.form.reset();
      },
      error: (data: any) => {
        this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
      },
    });
  }
  public async loadCategories() {
    await this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (data: any) => {
        this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
      },
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGULAR_EXPRESSION),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGULAR_EXPRESSION),
      ]),
      birthdate: new FormControl('', [Validators.required]), // TODO: comment // backend
      gender: new FormControl('', [Validators.required]),
      maritalStatus: new FormControl('', [Validators.required]), // TODO: comment // backend
      dni: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      classification: new FormControl('', [Validators.required]),
    });

    this.contactForm = this.formBuilder.group({
      mail: new FormControl('', [
        Validators.required,
        Validators.pattern(EMAIL_REGULAR_EXPRESSION),
      ]),
      phone: new FormControl('', [Validators.required]), // TODO: suggestion other db --- Table Contact
      emergencyPhone: new FormControl('', [Validators.required]), //TODO:  suggestion other db --- Table Contact
    });

    this.finaltialInformationForm = this.formBuilder.group({
      accountNumber: new FormControl('', [Validators.required]), // TODO: comment --- Table: FinantialInformation
      accountType: new FormControl('', [Validators.required]), // TODO:  comment  --- Table: FinantialInformation
      afpType: new FormControl('', [Validators.required]), // TODO: comment --- Table: FinantialInformation
      afpNumber: new FormControl('', [Validators.required]), // TODO: comment --- Table: FinantialInformation --- NUA/CUA
    });

    this.addressForm = this.formBuilder.group({
      country: new FormControl('', [Validators.required]), // TODO: comment  --- Table: Address
      department: new FormControl('', [Validators.required]), // TODO: comment  --- Table: Address
      city: new FormControl('', [Validators.required]), // TODO: comment  --- Table: Address
      district: new FormControl('', [Validators.required]), // TODO: comment  --- Table: Address --- Distrito de lugar de trabajo
      address: new FormControl('', [Validators.required]), // TODO: comment  --- Table: Address
      zone: new FormControl('', [Validators.required]), // TODO: comment  --- Table: Address
      linkGoogleMaps: new FormControl('', []), // TODO: comment  --- Table: Address
    });
  }

  private buildEmployeePayload(): createEmployeeDto {
    let newEmployee = new createEmployeeDto();
    newEmployee.firstName = this.form.get('firstName')?.value;
    newEmployee.lastName = this.form.get('lastName')?.value;
    newEmployee.recruitmentDate = this.currentDate
      ? this.currentDate
      : '2023-01-08'; // TODO: suggestion --- in backend ...

    newEmployee.category_id = parseInt(this.form.get('category')?.value);
    newEmployee.classification = this.form.get('classification')?.value;

    newEmployee.dni = this.form.get('dni')?.value;
    newEmployee.nickname = this.form.get('firstName')?.value;
    newEmployee.sex = this.form.get('gender')?.value;
    newEmployee.account_id = '083ee0a9-f4f6-4784-8265-294cb4d0eb5c'; //TODO: EndPoint ...
    newEmployee.marital_status = this.form.get('maritalStatus')?.value;

    //address table -- need refactor in backend
    newEmployee.country_id = 1; // TODO: Volver a pedir country ms
    newEmployee.city = this.addressForm.get('city')?.value;
    newEmployee.workLocation = this.addressForm.get('district')?.value;
    newEmployee.address = this.addressForm.get('address')?.value;

    //contact Table
    newEmployee.email = this.contactForm.get('mail')?.value;
    newEmployee.phone = parseInt(this.contactForm.get('phone')?.value);
    newEmployee.emergencyPhone = parseInt(
      this.contactForm.get('emergencyPhone')?.value
    );

    ///OPCIONAL?
    let birthdate = this.pipe.transform(
      new Date(this.form.get('birthdate')?.value),
      'yyyy-MM-dd'
    );

    newEmployee.birthdate = birthdate ? birthdate : '';
    newEmployee.end_date = this.currentDate ? this.currentDate : '2023-01-08';
    return newEmployee;
  }

  public addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.markerPosition = event.latLng.toJSON();
      this.linkGoogleMaps = this.getGoogleMapsLink();
    }
  }

  public getGoogleMapsLink() {
    return (
      'https://www.google.com/maps/search/?api=1&query=' +
      this.markerPosition.lat +
      ',' +
      this.markerPosition.lng
    );
  }

  // public openMarkerInfo(marker: MapMarker) {
  //   if (this.info) {
  //     this.info.open(marker);
  //   }
  // }
}
