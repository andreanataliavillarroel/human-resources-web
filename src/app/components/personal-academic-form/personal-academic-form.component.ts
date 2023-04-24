import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createAcademiaDigitalProfileDto } from 'src/app/dto/academia-digital-profile.dto';
import { createAcademicProfileDto } from 'src/app/dto/academic.profile.dto';
import { createCertificationDto } from 'src/app/dto/certification.dto';
import { createPostgraduateStudiesDto } from 'src/app/dto/postgraduate-studies.dto';
import { createUndergraduateStudiesDto } from 'src/app/dto/undergraduate-studies.dto';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
import { AcademiaDigitalFormComponent } from './academia-digital-form/academia-digital-form.component';
import { AcademicProfileFormComponent } from './academic-profile-form/academic-profile-form.component';
import { CertificationFormComponent } from './certification-form/certification-form.component';
import { PostgraduateStudiesFormComponent } from './postgraduate-studies-form/postgraduate-studies-form.component';
import { UndergraduateStudiesFormComponent } from './undergraduate-studies-form/undergraduate-studies-form.component';
import { MatStepper } from '@angular/material/stepper';
import { SkillsFormComponent } from './skills-form/skills-form.component';
import { EmployeeService } from 'src/app/services/employee/employee.service';
@Component({
  selector: 'app-personal-academic-form',
  templateUrl: './personal-academic-form.component.html',
  styleUrls: ['./personal-academic-form.component.scss'],
})
export class PersonalAcademicFormComponent implements OnInit {
  public pipe = new DatePipe('en-US');
  public currentDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');

  @Input() employeeId!: string;
  @Input() folderId!: string;
  public academicProfileId = '';

  @ViewChild('stepper') stepper!: MatStepper;

  @ViewChild(AcademiaDigitalFormComponent)
  academia_digital_form!: AcademiaDigitalFormComponent;

  @ViewChild(AcademicProfileFormComponent)
  academic_profile_form!: AcademicProfileFormComponent;

  @ViewChild(CertificationFormComponent)
  certification_form!: CertificationFormComponent;

  @ViewChild(UndergraduateStudiesFormComponent)
  undergraduate_studies_form!: UndergraduateStudiesFormComponent;

  @ViewChild(PostgraduateStudiesFormComponent)
  postgraduate_studies_form!: PostgraduateStudiesFormComponent;

  @ViewChild(SkillsFormComponent)
  skills_form!: SkillsFormComponent;

  constructor(
    private snackBar: MatSnackBar,
    private documentationService: DocumentationService,
    private cdref: ChangeDetectorRef
  ) {}

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.folderId !== '') {
      this.certification_form.folderId = this.folderId;
      this.undergraduate_studies_form.folderId = this.folderId;
      this.postgraduate_studies_form.folderId = this.folderId;
    }

    if (this.employeeId !== '') {
      this.skills_form.employeeId = this.employeeId;
    }
  }

  public async getAcademiaDigitalFormData() {
    let academiaDigitalProfile =
      this.academia_digital_form.buildAcademiaDigitalProfilePayload();
    academiaDigitalProfile.employee_id = this.employeeId;

    await this.onSubmitAcademiaDigitalData(academiaDigitalProfile);
  }

  public async getAcademicProfileFormData() {
    let academicProfile =
      this.academic_profile_form.buildAcademicProfileFormPayload();
    academicProfile.employee_id = this.employeeId;

    await this.onSubmitAcademicProfile(academicProfile);
    this.goToStep(this.academic_profile_form.getIndex());
  }

  public async getCertificationFormData() {
    let certification =
      await this.certification_form.buildCertificationFormPayload();
    certification.academic_profile_id = this.academicProfileId;

    await this.onSubmitCertificationData(certification);
  }

  public async getUndergraduateStudiesFormData() {
    let studies =
      await this.undergraduate_studies_form.buildUnderGraduateStudiesFormPayload();
    studies.academic_profile_id = this.academicProfileId;

    await this.onSubmitUnderGraduateData(studies);
  }

  public async getPostgraduateStudiesFormData() {
    let studies =
      await this.postgraduate_studies_form.buildPostGraduateStudiesFormPayload();
    studies.academic_profile_id = this.academicProfileId;

    await this.onSubmitPostGraduateData(studies);
  }

  public async onSubmitEmployeeSkills() {
    await this.skills_form.onSubmitEmployeeSkills();
  }

  public async onSubmitAcademicProfile(profile: createAcademicProfileDto) {
    await this.documentationService.createAcademicProfile(profile).subscribe({
      next: (data: any) => {
        this.snackBar.open('Success', 'OK', { duration: 5000 });
        this.academicProfileId = data.id;
      },
      error: (data: any) => {
        this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
      },
    });
  }

  public async onSubmitAcademiaDigitalData(
    profile: createAcademiaDigitalProfileDto
  ) {
    await this.documentationService
      .createAcademiaDigitalProfile(profile)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.snackBar.open('Success', 'OK', { duration: 5000 });
        },
        error: (data: any) => {
          this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
        },
      });
  }

  public async onSubmitCertificationData(
    certification: createCertificationDto
  ) {
    await this.documentationService
      .createCertification(certification)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.snackBar.open('Success', 'OK', { duration: 5000 });
        },
        error: (data: any) => {
          this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
        },
      });
  }
  public async onSubmitUnderGraduateData(
    studies: createUndergraduateStudiesDto
  ) {
    await this.documentationService
      .createUnderGraduateStudies(studies)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.snackBar.open('Success', 'OK', { duration: 5000 });
        },
        error: (data: any) => {
          this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
        },
      });
  }
  public async onSubmitPostGraduateData(studies: createPostgraduateStudiesDto) {
    await this.documentationService
      .createPostGraduateStudies(studies)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.snackBar.open('Success', 'OK', { duration: 5000 });
        },
        error: (data: any) => {
          console.log(data);
          this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
        },
      });
    this.snackBar.open('Success', 'OK', { duration: 5000 });
  }

  public goToStep(index: number) {
    this.stepper.selectedIndex = index;
  }
}
