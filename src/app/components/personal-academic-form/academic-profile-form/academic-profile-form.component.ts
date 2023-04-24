import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { createAcademicProfileDto } from 'src/app/dto/academic.profile.dto';
import { EnglishLevel } from 'src/app/enum/english-level.enum';

@Component({
  selector: 'app-academic-profile-form',
  templateUrl: './academic-profile-form.component.html',
  styleUrls: ['../personal-academic-form.component.scss'],
})
export class AcademicProfileFormComponent implements OnInit {
  public form!: FormGroup;

  public englishOptions = Object.values(EnglishLevel);

  public hasAcademiaDigitalProfile: boolean = false;

  ngOnInit() {
    this.buildForm();
  }

  constructor(private formBuilder: FormBuilder) {}

  public radioChange(event: MatRadioChange) {
    this.hasAcademiaDigitalProfile = event.value;
    this.getIndex();
  }

  public getIndex() {
    return this.hasAcademiaDigitalProfile ? 1 : 2;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      occupation: new FormControl('', [Validators.required]),
      english_level: new FormControl('', [Validators.required]),
    });
  }

  public buildAcademicProfileFormPayload() {
    let academicProfile = new createAcademicProfileDto();
    academicProfile.occupation = this.form.get('occupation')?.value;
    academicProfile.english_level = this.form.get('english_level')?.value;
    // academicProfile.employee_id = this.employeeId;

    return academicProfile;
  }
}
