import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { createEmployeeDto } from 'src/app/dto/employee.dto';
import { EMAIL_REGULAR_EXPRESSION, PHONE_REGULAR_EXPRESSION } from 'src/regex';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['../personal-information-form.component.scss'],
})
export class ContactFormComponent implements OnInit {
  public form!: FormGroup;

  ngOnInit() {
    this.buildForm();
  }

  constructor(private formBuilder: FormBuilder) {}

  public buildForm() {
    this.form = this.formBuilder.group({
      mail: new FormControl('', [
        Validators.required,
        Validators.pattern(EMAIL_REGULAR_EXPRESSION),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(PHONE_REGULAR_EXPRESSION),
      ]), // TODO: suggestion other db --- Table Contact
      emergencyPhone: new FormControl('', [
        Validators.required,
        Validators.pattern(PHONE_REGULAR_EXPRESSION),
        this.validateEmergencyPhone(),
      ]), //TODO:  suggestion other db --- Table Contact
    });
  }

  private validateEmergencyPhone() {
    return (control: AbstractControl) => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.get('phone')?.value
        ? { errorMatching: true }
        : null;
    };
  }

  public buildContactPayload(): createEmployeeDto {
    //   contact Table
    let employeeContact = new createEmployeeDto();
    employeeContact.email = this.form.get('mail')?.value;
    employeeContact.phone = parseInt(this.form.get('phone')?.value);
    employeeContact.emergencyPhone = parseInt(
      this.form.get('emergencyPhone')?.value
    );
    return employeeContact;
  }
}
