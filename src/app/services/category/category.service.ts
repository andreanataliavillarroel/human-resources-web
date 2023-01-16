import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createEmployeeDto } from 'src/app/dto/create-employee.dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}
  public getCategories() {
    return this.http.get(`${environment.categoryApiUrl}/category`);
  }
}
