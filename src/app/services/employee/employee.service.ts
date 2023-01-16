import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createEmployeeDto } from 'src/app/dto/create-employee.dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}
  public createEmployee(employeeDto: createEmployeeDto) {
    return this.http.post(
      `${environment.employeeApiUrl}/employee`,
      employeeDto
    );
  }
}
