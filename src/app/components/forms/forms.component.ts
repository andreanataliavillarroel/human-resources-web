import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { startWith } from 'rxjs';
import { createEmployeeDto } from 'src/app/dto/create-employee.dto';
import { accountType } from 'src/app/enum/account-type.enum';
import { Classification } from 'src/app/enum/classification.enum';
import { Sex } from 'src/app/enum/gender.enum';
import { CategoryService } from 'src/app/services/category/category.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { EMAIL_REGULAR_EXPRESSION, NAME_REGULAR_EXPRESSION } from 'src/regex';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent implements OnInit {
  public form!: FormGroup;
  public genderOptions = Object.values(Sex);
  public classificationOptions = Object.values(Classification);
  public accountOptions = Object.values(accountType);

  public categories: any;
  public categoryOptions: any;

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
      gender: new FormControl('', [Validators.required]),
      birthDate: new FormControl('', []),
      mail: new FormControl('', [
        Validators.required,
        Validators.pattern(EMAIL_REGULAR_EXPRESSION),
      ]),
      dni: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      classification: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      emergencyPhone: new FormControl('', [Validators.required]),
      accountNumber: new FormControl('', []),
      accountType: new FormControl('', []),
    });
  }

  private buildEmployeePayload(): createEmployeeDto {
    let newEmployee = new createEmployeeDto();
    newEmployee.firstName = this.form.get('firstName')?.value;
    newEmployee.lastName = this.form.get('lastName')?.value;
    newEmployee.email = this.form.get('mail')?.value;
    // newEmployee.recruitmentDate =
    newEmployee.recruitmentDate = '2023-01-13';
    newEmployee.country_id = 1;
    newEmployee.city = 'Cochabamba';
    newEmployee.workLocation = 'Cochabamba';
    newEmployee.address = 'Cochabamba address';
    newEmployee.classification = this.form.get('classification')?.value;
    newEmployee.phone = parseInt(this.form.get('phone')?.value);
    newEmployee.emergencyPhone = parseInt(
      this.form.get('emergencyPhone')?.value
    );
    newEmployee.dni = this.form.get('dni')?.value;
    newEmployee.nickname = this.form.get('firstName')?.value;
    newEmployee.sex = this.form.get('gender')?.value;
    newEmployee.account_id = '083ee0a9-f4f6-4784-8265-294cb4d0eb5c';
    newEmployee.category_id = parseInt(this.form.get('category')?.value);

    return newEmployee;
  }
}
