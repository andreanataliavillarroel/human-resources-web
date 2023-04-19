import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createEmployeeDto } from 'src/app/dto/employee.dto';
import { Classification } from 'src/app/enum/classification.enum';
import { Sex } from 'src/app/enum/gender.enum';
import { MaritalStatus } from 'src/app/enum/marital-status.enum';
import { CategoryService } from 'src/app/services/category/category.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { NAME_REGULAR_EXPRESSION } from 'src/regex';
import * as uuid from 'uuid';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['../personal-information-form.component.scss'],
})
export class EmployeeFormComponent implements OnInit {
  public form!: FormGroup;

  public categories: any;

  public genderOptions = Object.values(Sex);
  public classificationOptions = Object.values(Classification);
  public maritalStatusOptions = Object.values(MaritalStatus);

  public pipe = new DatePipe('en-US');
  public currentDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');
  public minDate = new Date(1950, 1, 1);
  public maxDate = new Date();

  ngOnInit() {
    this.buildForm();
  }

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService,
    private categoryService: CategoryService
  ) {
    this.loadCategories();
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

  public buildForm() {
    this.form = this.formBuilder.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGULAR_EXPRESSION),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGULAR_EXPRESSION),
      ]),
      nickname: new FormControl('', [Validators.required]),
      birthdate: new FormControl('', [Validators.required]), // TODO: comment // backend
      gender: new FormControl('', [Validators.required]),
      maritalStatus: new FormControl('', [Validators.required]),
      dni: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      classification: new FormControl('', [Validators.required]),
    });
  }

  public buildEmployeePayload(): createEmployeeDto {
    let newEmployee = new createEmployeeDto();
    newEmployee.firstName = this.form.get('firstName')?.value;
    newEmployee.lastName = this.form.get('lastName')?.value;
    newEmployee.recruitmentDate = this.currentDate
      ? this.currentDate
      : '2023-01-08'; // TODO: suggestion --- in backend ...

    newEmployee.category_id = parseInt(this.form.get('category')?.value);
    newEmployee.classification = this.form.get('classification')?.value;

    newEmployee.dni = this.form.get('dni')?.value;
    newEmployee.nickname = this.form.get('nickname')?.value;
    newEmployee.sex = this.form.get('gender')?.value;
    newEmployee.account_id = uuid.v4(); //TODO: EndPoint ...
    newEmployee.marital_status = this.form.get('maritalStatus')?.value;

    newEmployee.country_id = 1; // TODO: Volver a pedir country ms

    let birthdate = this.pipe.transform(
      new Date(this.form.get('birthdate')?.value),
      'yyyy-MM-dd'
    );

    newEmployee.birthdate = birthdate ? birthdate : '';
    newEmployee.end_date = this.currentDate ? this.currentDate : '2023-01-08';
    return newEmployee;
  }
}
