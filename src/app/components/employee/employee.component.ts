import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { EnglishLevel } from 'src/app/enum/english-level.enum';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  public id!: any;
  public employee!: any;
  public documentation!: any;
  public academicProfile!: any;
  public academiaDigitalProfile!: any;
  public certifications!: any;
  public undergraduateStudies!: any;
  public postgraduateStudies!: any;

  ngOnInit() {
    this.getEmployees();
    this.getPersonalDocumentation();
    this.getAcademiaDigitalProfile();
    this.getAcademicProfile();
  }

  constructor(
    private employeeService: EmployeeService,
    private documentationService: DocumentationService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  public async getEmployees() {
    await this.employeeService
      .getEmployeeById(this.id)
      .subscribe((response: any) => {
        this.employee = response;
      });
  }

  public async getAcademicProfile() {
    await this.documentationService
      .getAcademicProfileByEmployeeId(this.id)
      .subscribe((response: any) => {
        this.academicProfile = response[0];
        if (this.academicProfile) {
          this.getCertifications(this.academicProfile.id);
          this.getUndergraduateStudies(this.academicProfile.id);
          this.getPostgraduateStudies(this.academicProfile.id);
        }
      });
  }

  public async getAcademiaDigitalProfile() {
    await this.documentationService
      .getAcademiaDigitalProfileByEmployeeId(this.id)
      .subscribe((response: any) => {
        this.academiaDigitalProfile = response[0];
      });
  }

  public async getCertifications(id: string) {
    await this.documentationService
      .getCertificationsByAcademicProfile(id)
      .subscribe((response: any) => {
        this.certifications = response.map((item: any) => {
          return {
            id: item.id,
            name: item.name,
            description: item.description,
            drive_id: item.drive_id ? item.drive_id.split(',') : [],
          };
        });
      });
  }

  public getLink(driveId: string): SafeResourceUrl {
    const url = `https://docs.google.com/viewer?srcid=${driveId}&pid=explorer&efh=false&a=v&chrome=false&embedded=true`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public async getUndergraduateStudies(id: string) {
    await this.documentationService
      .getUndergraduateStudiesByAcademicProfile(id)
      .subscribe((response: any) => {
        this.undergraduateStudies = response.map((item: any) => {
          return {
            id: item.id,
            status: item.status ? 'Activo' : 'Finalizado',
            career: item.career,
            university: item.university,
            drive_id: item.drive_id ? item.drive_id.split(',') : [],
          };
        });
      });
  }

  public async getPostgraduateStudies(id: string) {
    await this.documentationService
      .getPostgraduateStudiesByAcademicProfile(id)
      .subscribe((response: any) => {
        this.postgraduateStudies = response.map((item: any) => {
          return {
            id: item.id,
            status: item.status ? 'Activo' : 'Finalizado',
            name: item.name,
            area: item.area,
            speciality: item.speciality,
            drive_id: item.drive_id ? item.drive_id.split(',') : [],
          };
        });
      });
  }

  public async getPersonalDocumentation() {
    await this.documentationService
      .getPersonalDocumentationByEmployeeId(this.id)
      .subscribe((response: any) => {
        this.documentation = response.map((item: any) => {
          return {
            id: item.id,
            name: item.name,
            date: item.date,
            drive_id: item.drive_id ? item.drive_id.split(',') : [],
          };
        });
      });
  }
}
