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

  @ViewChild(EmployeeFormComponent) employee_form!: EmployeeFormComponent;
  @ViewChild(ContactFormComponent) contact_form!: ContactFormComponent;
  @ViewChild(AddressFormComponent) address_form!: AddressFormComponent;
  @ViewChild(FinantialInformationFormComponent)
  finantial_information_form!: FinantialInformationFormComponent;
  @ViewChild('child') child_form!: ChildFormComponent;
  @ViewChild('documentation')
  documentation_form!: PersonalDocumentationComponent;
  await: any;

  constructor(
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService,
    private documentationService: DocumentationService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit() {}

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
    console.log(this.employeeId);
    this.finantialInformation.employee_id = this.employeeId;

    this.onSubmitFinantialInformation();
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
    this.documentation_form.setFolderId(this.folderId);
    this.documentation_form.onSubmitData();
    let ciDriveId = await this.documentation_form.getCIDriveId();
    let cvDriveId = await this.documentation_form.getCVDriveId();
    if (ciDriveId && cvDriveId) {
      let ciDocumentation = this.buildPersonalDocumentationPayload(
        'CI / DNI',
        ciDriveId
      );

      let cvDocumentation = this.buildPersonalDocumentationPayload(
        'CV',
        cvDriveId
      );

      console.log(this.documentation_form.getCIDriveId());
      console.log(this.documentation_form.getCVDriveId());
      this.onSubmitDocumentationData(ciDocumentation);
      this.onSubmitDocumentationData(cvDocumentation);
      this.isUploaded = true;
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
        next: (data: any) => {},
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
        this.snackBar.open('Employee-Address-Data was saved', 'OK', {
          duration: 5000,
        });
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
          this.snackBar.open('Success', 'OK', { duration: 5000 });
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
          this.snackBar.open('Success', 'OK', { duration: 5000 });
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
  }
}
