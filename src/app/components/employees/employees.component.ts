import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createEmployeeDto } from 'src/app/dto/employee.dto';
import { Employee } from 'src/app/interfaces/employee.interface';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'birthdate',
    'category',
    'email',
    'city',
    'status',
  ];
  data: any;

  // dataSource = data;
  clickedRows = new Set<Employee>();

  ngOnInit() {
    this.getEmployees();
  }

  constructor(
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {}

  public async getEmployees() {
    await this.employeeService.getEmployees().subscribe((response: any) => {
      this.data = response.map(function (item: any) {
        return {
          firstName: item.firstName,
          lastName: item.lastName,
          birthdate: item.birthdate,
          category: item.category_id,
          email: item.email,
          city: item.city,
          status: item.status,
        };
      });

      // this.getMatTable(this.data);
    });
  }

  public getMatTable() {}
}
