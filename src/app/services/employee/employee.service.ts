import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createAddressDto } from 'src/app/dto/address.dto';
import { createChildDto } from 'src/app/dto/child.dto';
import { createEmployeeDto } from 'src/app/dto/employee.dto';
import { createFinantialInformationDto } from 'src/app/dto/finantial-information.dto';
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

  public getEmployees() {
    let header = new HttpHeaders().set('Type-content', 'application/json');
    return this.http.get(environment.employeeApiUrl.concat('/employee'), {
      headers: header,
    });
  }
  public createFinantialInformationForEmployee(
    finantialInformation: createFinantialInformationDto
  ) {
    return this.http.post(
      `${environment.employeeApiUrl}/finantial-information`,
      finantialInformation
    );
  }

  public createAddressForEmployee(addressDto: createAddressDto) {
    return this.http.post(`${environment.employeeApiUrl}/address`, addressDto);
  }

  public createChildrenForEmployee(childDto: createChildDto) {
    return this.http.post(`${environment.employeeApiUrl}/children`, childDto);
  }
}
