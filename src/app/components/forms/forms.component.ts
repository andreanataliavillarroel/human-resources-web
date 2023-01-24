import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createEmployeeDto } from 'src/app/dto/create-employee.dto';
import { accountType } from 'src/app/enum/account-type.enum';
import { AfpType } from 'src/app/enum/afp-type.enum';
import { Classification } from 'src/app/enum/classification.enum';
import { Sex } from 'src/app/enum/gender.enum';
import { MaritalStatus } from 'src/app/enum/marital-status.enum';
import { CategoryService } from 'src/app/services/category/category.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { EMAIL_REGULAR_EXPRESSION, NAME_REGULAR_EXPRESSION } from 'src/regex';
import { DatePipe } from '@angular/common';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  public form!: FormGroup;
  public finaltialInformationform!: FormGroup;
  public addressForm!: FormGroup;

  public genderOptions = Object.values(Sex);
  public classificationOptions = Object.values(Classification);
  public accountOptions = Object.values(accountType);
  public maritalStatusOptions = Object.values(MaritalStatus);
  public afpOptions = Object.values(AfpType);
  public categories: any;
  public pipe = new DatePipe('en-US');
  public currentDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');

  public display: any;
  public center!: google.maps.LatLngLiteral;
  public zoom = 13;

  public mapOptions: google.maps.MapOptions = {
    maxZoom: 20,
    minZoom: 8,
  };

  public markerPosition!: google.maps.LatLngLiteral;

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
    });
  }

  public onSubmit() {
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
      birthDate: new FormControl('', []), // TODO: suggestion to implement in backend
      gender: new FormControl('', [Validators.required]),
      maritalStatus: new FormControl('', []), // TODO: suggestion to implement in backend
      mail: new FormControl('', [
        Validators.required,
        Validators.pattern(EMAIL_REGULAR_EXPRESSION),
      ]),
      dni: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      classification: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]), // TODO: suggestion other db --- Table Contact
      emergencyPhone: new FormControl('', [Validators.required]), //TODO:  suggestion other db --- Table Contact
    });

    this.finaltialInformationform = this.formBuilder.group({
      accountNumber: new FormControl('', []), // TODO: implement in backend  --- Table: FinantialInformation
      accountType: new FormControl('', []), // TODO:  implement in backend  --- Table: FinantialInformation
      afpType: new FormControl('', []), // TODO: Implement in backend --- Table: FinantialInformation
      afpNumber: new FormControl('', []), // TODO: Implement in backend --- Table: FinantialInformation --- NUA/CUA
    });

    this.addressForm = this.formBuilder.group({
      country: new FormControl('', []), // TODO: implement in backend  --- Table: Address
      department: new FormControl('', []), // TODO: implement in backend  --- Table: Address
      city: new FormControl('', [Validators.required]), // TODO: implement in backend  --- Table: Address
      district: new FormControl('', [Validators.required]), // TODO: implement in backend  --- Table: Address --- Distrito de lugar de trabajo
      address: new FormControl('', [Validators.required]), // TODO: implement in backend  --- Table: Address
      zone: new FormControl('', []), // TODO: implement in backend  --- Table: Address
      linkGoogleMaps: new FormControl('', []), // TODO: implement in backend  --- Table: Address
    });
  }

  private buildEmployeePayload(): createEmployeeDto {
    let newEmployee = new createEmployeeDto();
    newEmployee.firstName = this.form.get('firstName')?.value;
    newEmployee.lastName = this.form.get('lastName')?.value;
    newEmployee.email = this.form.get('mail')?.value;
    newEmployee.recruitmentDate = this.currentDate
      ? this.currentDate
      : '2023-01-08'; // TODO: suggestion --- in backend ...
    newEmployee.country_id = 1; // TODO: Volver a pedir country ms
    newEmployee.city = this.addressForm.get('city')?.value;
    newEmployee.workLocation = this.addressForm.get('district')?.value;
    newEmployee.address = this.addressForm.get('address')?.value;
    newEmployee.classification = this.form.get('classification')?.value;
    newEmployee.phone = parseInt(this.form.get('phone')?.value);
    newEmployee.emergencyPhone = parseInt(
      this.form.get('emergencyPhone')?.value
    );
    newEmployee.dni = this.form.get('dni')?.value;
    newEmployee.nickname = this.form.get('firstName')?.value;
    newEmployee.sex = this.form.get('gender')?.value;
    newEmployee.account_id = '083ee0a9-f4f6-4784-8265-294cb4d0eb5c'; //TODO: EndPoint ...
    newEmployee.category_id = parseInt(this.form.get('category')?.value);

    return newEmployee;
  }

  public moveMap(event: google.maps.MapMouseEvent) {
    console.log(event);

    if (event.latLng !== null) {
      this.center = event.latLng.toJSON();
    }
  }
  public move(event: google.maps.MapMouseEvent) {
    console.log(event);

    if (event.latLng != null) this.display = event.latLng.toJSON();
  }
  public addMarker(event: google.maps.MapMouseEvent) {
    console.log(event);

    if (event.latLng != null) {
      new google.maps.Marker({
        position: event.latLng,
      });
    }
  }
}
