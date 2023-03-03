import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from 'src/app/interfaces/category.model';
import { Employee } from 'src/app/interfaces/employee.interface';
import { CategoryService } from 'src/app/services/category/category.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';

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
  totalRecords = 0;
  pageSize = 10;
  pageIndex = 0;
  public target: any;

  public dataSource!: MatTableDataSource<any>;

  public employees: any;
  public categories!: Category[];

  clickedRows = new Set<Employee>();
  // @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(MatSort, { static: true }) matSort!: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  // @ViewChild('paginator', { static: true }) paginator!: MatPaginator;

  ngOnInit() {
    this.getCategories();
    this.getEmployees();
  }

  constructor(
    private employeeService: EmployeeService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router
  ) {}

  public getEmployees() {
    this.employeeService.getEmployees().subscribe((response: any) => {
      // this.employees = response;
      this.totalRecords = response?.length ? response[0].totalRecords : 0;

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
    this.dataSource.sort = this.matSort;
    this.dataSource.filter = this.target.value;
    this.dataSource.paginator = this.paginator;
    // this.getPaginatedData(data);

    // this.dataSource.filter = this.target.value;
    this.dataSource.paginator.length = data.length;
  }

  public getPaginatedData(data: any) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    return data.slice(startIndex, endIndex);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public pageChangeEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getMatTable(this.employees);
  }

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
