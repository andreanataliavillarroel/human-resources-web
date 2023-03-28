import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from 'src/app/interfaces/category.model';
import { Employee } from 'src/app/interfaces/employee.interface';
import { CategoryService } from 'src/app/services/category/category.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { StylePaginatorDirective } from '../directives/style-paginator.directive';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  public displayedColumns: string[] = [
    'firstName',
    'lastName',
    'birthdate',
    'category',
    'email',
    'city',
    'status',
    'actions',
  ];

  public target: any;
  public isToggleSelected: boolean = false;

  public dataSource!: MatTableDataSource<any>;

  public employees: any;
  public categories!: Category[];

  @ViewChild(MatSort, { static: false }) matSort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(StylePaginatorDirective) stylePaginator!: StylePaginatorDirective;

  ngOnInit() {
    this.getCategories();
    this.getEmployees();
    this.target = '';
  }

  constructor(
    private employeeService: EmployeeService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  public getEmployees() {
    this.employeeService.getEmployees().subscribe((response: any) => {
      this.employees = response.map((item: any) => {
        return {
          id: item.id,
          firstName: item.firstName,
          lastName: item.lastName,
          birthdate: item.birthdate,
          category: this.getCategory(item.category_id),
          email: item.email,
          city: item.city,
          status: item.status ? 'Activo' : 'Inactivo',
        };
      });
      this.getMatTable(this.employees);
    });
  }

  public getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (data: any) => {
        this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
      },
    });
  }

  public getCategory(id: number): string {
    let category = this.categories.find(item => item.id === id);
    return category ? category.name : 'Sin Categoria?';
  }

  public getMatTable(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.cdr.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;

    if (this.target !== '') {
      this.dataSource.filter = this.target.value;
    }
    if (!this.isToggleSelected) {
      this.stylePaginator?.switchPage(0);
      this.isToggleSelected = false;
    }
  }

  public getPaginatedData(data: any) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    return data.slice(startIndex, endIndex);
  }

  // public pageChangeEvent(event: PageEvent) {
  //   this.pageIndex = event.pageIndex;
  //   this.pageSize = event.pageSize;
  //   this.getMatTable(this.employees);
  // }

  public onSearchKeyUp($event: Event) {
    this.target = $event.target as HTMLInputElement;
    const focus = document.getElementById('focus');
    this.getMatTable(this.employees);
  }

  public openDetail(element: any) {
    console.log(element);
    this.router.navigate(['/employees', element.id]);
  }
  public openEditModal(element: any) {}
  public changeStatus(element: any, status: boolean) {}
}
