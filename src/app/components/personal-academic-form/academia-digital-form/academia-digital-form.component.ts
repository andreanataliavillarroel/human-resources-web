import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { createAcademiaDigitalProfileDto } from 'src/app/dto/academia-digital-profile.dto';
import { AcademiaDigitalType } from 'src/app/enum/academia-digital-type.enum';

@Component({
  selector: 'app-academia-digital-form',
  templateUrl: './academia-digital-form.component.html',
  styleUrls: ['../personal-academic-form.component.scss'],
})
export class AcademiaDigitalFormComponent implements OnInit {
  public form!: FormGroup;

  public pipe = new DatePipe('en-US');
  public currentDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');
  public minDate = new Date(2015, 1, 1);
  public maxDate = new Date();
  public status: boolean = false;

  public academiaDigitalOptions = Object.values(AcademiaDigitalType);

  ngOnInit() {
    this.buildForm();
  }

  constructor(private formBuilder: FormBuilder) {}

  public radioChange(event: MatRadioChange) {
    this.status = event.value;
    if (this.status) {
      this.form.patchValue({ end_date: null });
      this.form.get('end_date')?.disable();
      this.form.controls['end_date'].clearValidators();
      this.form.controls['end_date'].updateValueAndValidity();
    } else {
      this.form.get('end_date')?.enable();
      this.form.controls['end_date'].addValidators(Validators.required);
      this.form.controls['end_date'].updateValueAndValidity();
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      type: new FormControl('', [Validators.required]),
      start_date: new FormControl('', [Validators.required]),
      end_date: new FormControl('', [Validators.required]),
    });
  }

  public buildAcademiaDigitalProfilePayload() {
    let profile = new createAcademiaDigitalProfileDto();
    profile.status = this.status ? 1 : 0;
    profile.type = this.form.get('type')?.value;
    // academiaDigital.employee_id = this.employeeId;
    let start_date = this.pipe.transform(
      new Date(this.form.get('start_date')?.value),
      'yyyy-MM-dd'
    );
    profile.start_date = start_date ? start_date : '';

    if (!this.status) {
      let end_date = this.pipe.transform(
        new Date(this.form.get('end_date')?.value),
        'yyyy-MM-dd'
      );
      profile.end_date = end_date ? end_date : '';
    }
    return profile;
  }
}
