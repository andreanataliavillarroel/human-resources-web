import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { createFinantialInformationDto } from 'src/app/dto/finantial-information.dto';
import { AccountType } from 'src/app/enum/account-type.enum';
import { AfpType } from 'src/app/enum/afp-type.enum';

@Component({
  selector: 'app-finantial-information-form',
  templateUrl: './finantial-information-form.component.html',
  styleUrls: ['../personal-information-form.component.scss'],
})
export class FinantialInformationFormComponent implements OnInit {
  public form!: FormGroup;
  public accountOptions = Object.values(AccountType);
  public afpOptions = Object.values(AfpType);

  ngOnInit() {
    this.buildForm();
  }

  constructor(private formBuilder: FormBuilder) {}

  private buildForm() {
    this.form = this.formBuilder.group({
      accountNumber: new FormControl('', [Validators.required]),
      accountType: new FormControl('', [Validators.required]),
      afpType: new FormControl('', [Validators.required]),
      afpNumber: new FormControl('', [Validators.required]), // --- NUA/CUA
    });
  }

  public buildFinantialInformationPayload(): createFinantialInformationDto {
    let newFinantialInformation = new createFinantialInformationDto();
    newFinantialInformation.account_number = parseInt(
      this.form.get('accountNumber')?.value
    );
    newFinantialInformation.account_type = this.form.get('accountType')?.value;
    newFinantialInformation.afp_number = parseInt(
      this.form.get('afpNumber')?.value
    );
    newFinantialInformation.afp_type = this.form.get('afpType')?.value;

    return newFinantialInformation;
  }
}
