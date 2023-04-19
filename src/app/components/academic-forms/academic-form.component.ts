import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { DatePipe } from '@angular/common';
import { EnglishLevel } from 'src/app/enum/english-level.enum';
import { AcademicDegree } from 'src/app/enum/academic-degree.enum';
import { AcademiaDigitalType } from 'src/app/enum/academia-digital-type.enum';
import { FileDragAndDropBoxComponent } from '../file-drag-and-drop-box/file-drag-and-drop-box.component';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';

@Component({
  selector: 'app-form',
  templateUrl: './academic-form.component.html',
  styleUrls: ['./academic-form.component.scss'],
})
export class AcademicFormComponent implements OnInit {
  public academiaDigitalProfileForm!: FormGroup;
  public academicProfileForm!: FormGroup;
  //
  @ViewChild('certification')
  certification!: FileDragAndDropBoxComponent;

  @ViewChild('undergraduateStudies')
  undergraduateCertification!: FileDragAndDropBoxComponent;

  @ViewChild('postgraduatedStudies')
  postgraduateCertification!: FileDragAndDropBoxComponent;

  public personalDocumentationForm!: FormGroup;
  public certificationForm!: FormGroup;
  public underGraduateStudiesForm!: FormGroup;
  public postGraduateStudiesForm!: FormGroup;

  public pipe = new DatePipe('en-US');
  public currentDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');

  public englishOptions = Object.values(EnglishLevel);
  public academicDegreesOptions = Object.values(AcademicDegree);
  public academiaDigitalOptions = Object.values(AcademiaDigitalType);

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService,
    private documentationService: DocumentationService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  public onSubmit() {}

  private buildForm() {
    this.academicProfileForm = this.formBuilder.group({
      occupation: new FormControl('', [Validators.required]),
      english_level: new FormControl('', [Validators.required]),
      highestAcademicDegree: new FormControl('', [Validators.required]), //academicDegrees

      hasAcademiaDigitalProfile: new FormControl('', [Validators.required]), //booleano
      hasCertifications: new FormControl('', [Validators.required]), //booleano
    });

    this.academiaDigitalProfileForm = this.formBuilder.group({
      type: new FormControl('', [Validators.required]),
      grades: new FormControl('', []), // TODO: Ask for academia digital grades?
      comments: new FormControl('', []), // TODO: Ask for academia digital comments?
      status: new FormControl('', [Validators.required]), // int
    });

    this.certificationForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      link_drive: new FormControl('', [Validators.required]),
    });

    this.underGraduateStudiesForm = this.formBuilder.group({
      status: new FormControl('', [Validators.required]), // int
      career: new FormControl('', [Validators.required]),
      university: new FormControl('', [Validators.required]),
      link_drive: new FormControl('', [Validators.required]),
    });

    this.postGraduateStudiesForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      area: new FormControl('', [Validators.required]),
      speciality: new FormControl('', [Validators.required]),
      link_drive: new FormControl('', [Validators.required]),
    });
    // this.personalDocumentationForm = this.formBuilder.group({});
  }

  // private buildEmployeePayload(): createFinantialInformationDto {
  //   let newEmployee = new createEmployeeDto();
  // newEmployee.firstName = this.form.get('firstName')?.value;
  // newEmployee.lastName = this.form.get('lastName')?.value;
  // newEmployee.recruitmentDate = this.currentDate
  //   ? this.currentDate
  //   : '2023-01-08'; // TODO: suggestion --- in backend ...
  // newEmployee.category_id = parseInt(this.form.get('category')?.value);
  // newEmployee.classification = this.form.get('classification')?.value;
  // newEmployee.dni = this.form.get('dni')?.value;
  // newEmployee.nickname = this.form.get('firstName')?.value;
  // newEmployee.sex = this.form.get('gender')?.value;
  // newEmployee.account_id = '083ee0a9-f4f6-4784-8265-294cb4d0eb5c'; //TODO: EndPoint ...
  // newEmployee.marital_status = this.form.get('maritalStatus')?.value;
  // //address table -- need refactor in backend
  // newEmployee.country_id = 1; // TODO: Volver a pedir country ms
  // newEmployee.city = this.addressForm.get('city')?.value;
  // newEmployee.workLocation = this.addressForm.get('district')?.value;
  // newEmployee.address = this.addressForm.get('address')?.value;
  // //contact Table
  // newEmployee.email = this.contactForm.get('mail')?.value;
  // newEmployee.phone = parseInt(this.contactForm.get('phone')?.value);
  // newEmployee.emergencyPhone = parseInt(
  //   this.contactForm.get('emergencyPhone')?.value
  // );
  // ///OPCIONAL?
  // let birthdate = this.pipe.transform(
  //   new Date(this.form.get('birthdate')?.value),
  //   'yyyy-MM-dd'
  // );
  // newEmployee.birthdate = birthdate ? birthdate : '';
  // newEmployee.end_date = this.currentDate ? this.currentDate : '2023-01-08';
  // return newEmployee;
  // }
}
