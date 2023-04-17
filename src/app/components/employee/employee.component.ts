import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
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
  public academicProfile!: any;
  public files!: any[];

  ngOnInit() {
    this.getEmployees();
    this.getAcademicProfile();
    this.getEmployeeDocumentation();
  }

  constructor(
    private employeeService: EmployeeService,
    private documentationService: DocumentationService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  public getEmployees() {
    this.employeeService.getEmployeeById(this.id).subscribe((response: any) => {
      this.employee = response;
      console.log(this.employee);
    });
  }

  public getEmployeeDocumentation() {
    this.documentationService
      .getFiles('1ZWzK8GHRvypkZLp-4wVzPbJ55_YQaNpR')
      .subscribe((response: any) => {
        this.files = response;
        console.log(this.files);
      });
  }
  public getAcademicProfile() {
    this.documentationService
      .getAcademicProfile()
      .subscribe((response: any) => {
        this.academicProfile = response[0];
        console.log(this.academicProfile);
      });
  }

  public getAcademiaDigitalProfile() {}
}
