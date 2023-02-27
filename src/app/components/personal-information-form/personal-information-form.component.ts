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

  @ViewChild(EmployeeFormComponent) employee_form!: EmployeeFormComponent;
  @ViewChild(ContactFormComponent) contact_form!: ContactFormComponent;
  @ViewChild(AddressFormComponent) address_form!: AddressFormComponent;
  @ViewChild(FinantialInformationFormComponent)
  finantial_information_form!: FinantialInformationFormComponent;
  @ViewChild(ChildFormComponent) child_form!: ChildFormComponent;

  constructor(
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  public getEmployeeFormData() {
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
  }

  public getFinantialInformationFormData() {
    this.finantialInformation =
      this.finantial_information_form.buildFinantialInformationPayload();

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

  public async onSubmitEmployeeData() {
    await this.employeeService.createEmployee(this.employee).subscribe({
      next: (data: any) => {
        this.employeeId = data.id;
        this.address.employee_id = this.employeeId;
        this.snackBar.open('Success', 'OK', { duration: 5000 });
        this.onSubmitAddressData();
      },
      error: (data: any) => {
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
