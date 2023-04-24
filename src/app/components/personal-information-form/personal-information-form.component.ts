import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
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
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { PersonalAcademicFormComponent } from '../personal-academic-form/personal-academic-form.component';

@Component({
  selector: 'app-personal-information-form',
  templateUrl: './personal-information-form.component.html',
  styleUrls: ['./personal-information-form.component.scss'],
  providers: [TreeList],
})
export class PersonalInformationFormComponent {
  public employee!: createEmployeeDto;
  public address!: createAddressDto;
  public finantialInformation!: createFinantialInformationDto;

  public employeeId: string = '';
  public folderId: string = '';
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

  @ViewChild('academic', { static: true })
  academic_form!: PersonalAcademicFormComponent;

  public pipe = new DatePipe('en-US');
  public currentDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService,
    private documentationService: DocumentationService,
    private cdref: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    const childComponent = this.academic_form;
    if (this.employeeId !== '' && this.folderId !== '') {
      childComponent.employeeId = this.employeeId;
      childComponent.folderId = this.folderId;
    }
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  public getEmployeeId() {
    return this.employeeId;
  }

  public async getEmployeeFormData() {
    this.employee = this.employee_form.buildEmployeePayload();
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
    await this.createGoogleDriveFolder();
  }

  public async getFinantialInformationFormData() {
    this.finantialInformation =
      this.finantial_information_form.buildFinantialInformationPayload();
    this.finantialInformation.employee_id = this.employeeId;

    await this.onSubmitFinantialInformation();
  }

  public getChildrenFormData() {
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
      await this.documentation_form.onSubmitData(this.employeeId);

      this.isUploaded = true;
    } catch (error) {
      console.error(error);
    }
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
          console.log(data);
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
}
