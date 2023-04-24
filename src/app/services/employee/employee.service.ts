import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createAddressDto } from 'src/app/dto/address.dto';
import { createChildDto } from 'src/app/dto/child.dto';
import { createEmployeeSkillDto } from 'src/app/dto/employee-skill.dto';
import { createEmployeeDto } from 'src/app/dto/employee.dto';
import { createFinantialInformationDto } from 'src/app/dto/finantial-information.dto';
import { createSkillDto } from 'src/app/dto/skill.dto';
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
    return this.http.get(environment.employeeApiUrl.concat('/employee'), {});
  }

  public getSkills() {
    return this.http.get(environment.employeeApiUrl.concat('/skill'), {});
  }

  public createSkill(skillDto: createSkillDto) {
    return this.http.post(`${environment.employeeApiUrl}/skill`, skillDto);
  }

  public createEmployeeSkill(employeeSkillDto: createEmployeeSkillDto) {
    return this.http.post(
      `${environment.employeeApiUrl}/employee-skill`,
      employeeSkillDto
    );
  }

  public getEmployeeById(id: string) {
    return this.http.get(`${environment.employeeApiUrl}/employee/${id}`);
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

  public getAddresses() {
    let header = new HttpHeaders().set('Type-content', 'application/json');
    return this.http.get(environment.employeeApiUrl.concat('/address'), {
      headers: header,
    });
  }
}
