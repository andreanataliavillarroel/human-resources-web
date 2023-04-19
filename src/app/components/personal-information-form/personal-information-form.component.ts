import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createEmployeeDto } from 'src/app/dto/employee.dto';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { createFinantialInformationDto } from 'src/app/dto/finantial-information.dto';
import { createAddressDto } from 'src/app/dto/address.dto';
import { createChildDto } from 'src/app/dto/child.dto';
import { TreeList } from './tree-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { FinantialInformationFormComponent } from './finantial-information-form/finantial-information-form.component';
import { ChildFormComponent } from './child-form/child-form.component';
import { PersonalDocumentationComponent } from './personal-documentation-form/personal-documentation-form.component';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
import { createPersonalDocumentationDto } from 'src/app/dto/personal-documentation.dto';
import { AcademicFormComponent } from '../academic-forms/academic-form.component';
import { DatePipe } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { AcademiaDigitalType } from 'src/app/enum/academia-digital-type.enum';
import { AcademicDegree } from 'src/app/enum/academic-degree.enum';
import { EnglishLevel } from 'src/app/enum/english-level.enum';
import { FileDragAndDropBoxComponent } from '../file-drag-and-drop-box/file-drag-and-drop-box.component';
import { createAcademicProfileDto } from 'src/app/dto/academic.profile.dto';

@Component({
  selector: 'app-personal-information-form',
  templateUrl: './personal-information-form.component.html',
  styleUrls: ['./personal-information-form.component.scss'],
  providers: [TreeList],
})
export class PersonalInformationFormComponent implements OnInit {
  public employee!: createEmployeeDto;
  public address!: createAddressDto;
  public finantialInformation!: createFinantialInformationDto;

  private employeeId: string = '';
  private folderId: string = '';
  public isUploaded: boolean = false;
  public nextPart: boolean = false;
  ciDocumentation: any;
  cvDocumentation: any;

  @ViewChild(EmployeeFormComponent) employee_form!: EmployeeFormComponent;
  @ViewChild(ContactFormComponent) contact_form!: ContactFormComponent;
  @ViewChild(AddressFormComponent) address_form!: AddressFormComponent;
  @ViewChild(FinantialInformationFormComponent)
  finantial_information_form!: FinantialInformationFormComponent;
  @ViewChild('child') child_form!: ChildFormComponent;
  @ViewChild('documentation')
  documentation_form!: PersonalDocumentationComponent;

  // @ViewChild('academic') academic_form!: AcademicFormComponent;
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

  ngOnInit() {
    this.buildacademicProfileForm();
    this.buildacademiaDigitalProfileForm();
    this.buildcertificationForm();
    this.buildunderGraduateStudiesForm();
    this.buildPostGraduateStudies();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  public async getEmployeeFormData() {
    this.employee = this.employee_form.buildEmployeePayload();
    await this.createGoogleDriveFolder();
  }

  public getContactFormData() {
    this.employee.email = this.contact_form.buildContactPayload().email;
    this.employee.phone = this.contact_form.buildContactPayload().phone;
    this.employee.emergencyPhone =
      this.contact_form.buildContactPayload().emergencyPhone;
  }

  public async getAddressFormData() {
    this.address = this.address_form.builAddressPayload();

    this.employee.city = this.address.city;
    this.employee.workLocation = this.address.workplace_district;
    this.employee.address = this.address.address;

    await this.onSubmitEmployeeData();
  }

  public getFinantialInformationFormData() {
    this.finantialInformation =
      this.finantial_information_form.buildFinantialInformationPayload();
    this.finantialInformation.employee_id = this.employeeId;

    this.onSubmitFinantialInformation();
  }

  public getChildrenFormData() {
    this.onSubmitDocumentationData(this.ciDocumentation);
    this.onSubmitDocumentationData(this.cvDocumentation);
    let child: createChildDto;
    if (this.child_form.getChildrenDatabase()) {
      this.child_form.getChildrenDatabase().forEach(childData => {
        console.log(childData.children);
        childData.children.forEach(item => {
          child = item.data;
          child.employee_id = this.employeeId;

          this.onSubmitChildrenData(child);
        });
      });
    }

    this.clearForm();
  }

  public async getPersonalDocumentationFormData() {
    try {
      this.documentation_form.setFolderId(this.folderId);
      await this.documentation_form.onSubmitData();

      let ciDriveId: string = await this.documentation_form.getCIDriveId();
      let cvDriveId: string = await this.documentation_form.getCVDriveId();
      // if (ciDriveId !== '' && cvDriveId !== '') {
      //   this.ciDocumentation = this.buildPersonalDocumentationPayload(
      //     'CI / DNI',
      //     ciDriveId
      //   );

      //   this.cvDocumentation = this.buildPersonalDocumentationPayload(
      //     'CV',
      //     cvDriveId
      //   );
      // } else {
      this.ciDocumentation = this.buildPersonalDocumentationPayload(
        'CI / DNI',
        this.folderId
      );
      this.cvDocumentation = this.buildPersonalDocumentationPayload(
        'CV',
        this.folderId
      );
      // }
      this.isUploaded = true;
    } catch (error) {
      console.error(error);
    }
  }

  public buildPersonalDocumentationPayload(
    name: string,
    drive_id: string
  ): createPersonalDocumentationDto {
    let newPersonalDocumentation = new createPersonalDocumentationDto();
    newPersonalDocumentation.name = name;
    newPersonalDocumentation.drive_id = drive_id;
    newPersonalDocumentation.employee_id = this.employeeId;

    return newPersonalDocumentation;
  }

  public async onSubmitDocumentationData(
    documentation: createPersonalDocumentationDto
  ) {
    this.documentationService
      .createPersonalDocumentation(documentation)
      .subscribe({
        next: (data: any) => {
          console.log(data);
        },
        error: (data: any) => {
          this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
        },
      });
  }

  public async createGoogleDriveFolder() {
    if (!this.folderId) {
      const data = {
        folderName: `${this.employee.firstName} ${this.employee.lastName} - ${this.employee.dni}`,
      };
      try {
        const response: any = await this.documentationService
          .createFolder(data)
          .toPromise();
        if (response && response.folderId) {
          this.folderId = response.folderId;
        }
      } catch (error: any) {
        this.snackBar.open(error.error, 'OK', { duration: 5000 });
      }
    }
  }

  public async onSubmitEmployeeData() {
    await this.employeeService.createEmployee(this.employee).subscribe({
      next: (data: any) => {
        console.log(data);
        this.employeeId = data.id;
        this.address.employee_id = this.employeeId;
        this.onSubmitAddressData();
        // this.snackBar.open('Employee-Address-Data was saved', 'OK', {
        //   duration: 5000,
        // });
      },
      error: (data: any) => {
        console.log(data);
        this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
      },
    });
  }

  public async onSubmitFinantialInformation() {
    await this.employeeService
      .createFinantialInformationForEmployee(this.finantialInformation)
      .subscribe({
        next: () => {
          // this.snackBar.open('Success', 'OK', { duration: 5000 });
        },
        error: (data: any) => {
          this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
        },
      });
  }

  public async onSubmitAddressData() {
    await this.employeeService
      .createAddressForEmployee(this.address)
      .subscribe({
        next: () => {
          // this.snackBar.open('Success', 'OK', { duration: 5000 });
        },
        error: (data: any) => {
          this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
        },
      });
  }

  public async onSubmitChildrenData(child: createChildDto) {
    await this.employeeService.createChildrenForEmployee(child).subscribe({
      next: () => {
        this.snackBar.open('Success', 'OK', { duration: 5000 });
      },
      error: (data: any) => {
        this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
      },
    });
  }

  private clearForm() {
    this.employee_form.form.reset();
    this.address_form.form.reset();
    this.contact_form.form.reset();
    this.finantial_information_form.form.reset();
    this.child_form.form.reset();
    this.nextPart = true;
  }
  //
  //
  //

  public buildacademicProfileFormPayload() {
    //   contact Table
    let academicProfile = new createAcademicProfileDto();
    academicProfile.occupation =
      this.academicProfileForm.get('occupation')?.value;
    academicProfile.employee_id = this.employeeId;
    academicProfile.english_level =
      this.academicProfileForm.get('english_level')?.value;
    return academicProfile;
  }

  private buildacademicProfileForm() {
    this.academicProfileForm = this.formBuilder.group({
      occupation: new FormControl('', [Validators.required]),
      english_level: new FormControl('', [Validators.required]),
      // highestAcademicDegree: new FormControl('', [Validators.required]), //academicDegrees

      hasAcademiaDigitalProfile: new FormControl('', [Validators.required]), //booleano
      hasCertifications: new FormControl('', [Validators.required]), //booleano
    });

    // this.personalDocumentationForm = this.formBuilder.group({});
  }

  buildacademiaDigitalProfileForm() {
    this.academiaDigitalProfileForm = this.formBuilder.group({
      type: new FormControl('', [Validators.required]),
      grades: new FormControl('', []), // TODO: Ask for academia digital grades?
      comments: new FormControl('', []), // TODO: Ask for academia digital comments?
      status: new FormControl('', [Validators.required]), // int
    });
  }
  buildcertificationForm() {
    this.certificationForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }
  buildunderGraduateStudiesForm() {
    this.underGraduateStudiesForm = this.formBuilder.group({
      status: new FormControl('', [Validators.required]), // int
      career: new FormControl('', [Validators.required]),
      university: new FormControl('', [Validators.required]),
    });
  }
  buildPostGraduateStudies() {
    this.postGraduateStudiesForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      area: new FormControl('', [Validators.required]),
      speciality: new FormControl('', [Validators.required]),
    });
  }
  public async onSubmitAcademicProfile() {
    // await this.employeeService
    //   .createAddressForEmployee(this.address)
    //   .subscribe({
    //     next: () => {
    //       // this.snackBar.open('Success', 'OK', { duration: 5000 });
    //     },
    //     error: (data: any) => {
    //       this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
    //     },
    //   });
  }

  public async onSubmitAcademiaDigitalData() {
    // await this.employeeService
    //   .createAddressForEmployee(this.address)
    //   .subscribe({
    //     next: () => {
    //       // this.snackBar.open('Success', 'OK', { duration: 5000 });
    //     },
    //     error: (data: any) => {
    //       this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
    //     },
    //   });
  }

  public async onSubmitCertificationData() {
    // await this.employeeService
    //   .createAddressForEmployee(this.address)
    //   .subscribe({
    //     next: () => {
    //       // this.snackBar.open('Success', 'OK', { duration: 5000 });
    //     },
    //     error: (data: any) => {
    //       this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
    //     },
    //   });
  }
  public async onSubmitUnderGraduateData() {
    // await this.employeeService
    //   .createAddressForEmployee(this.address)
    //   .subscribe({
    //     next: () => {
    //       // this.snackBar.open('Success', 'OK', { duration: 5000 });
    //     },
    //     error: (data: any) => {
    //       this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
    //     },
    //   });
  }
  public async onSubmitPostGraduateData() {}
}
