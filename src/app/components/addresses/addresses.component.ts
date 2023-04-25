import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Address } from 'src/app/models/address.model';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { StylePaginatorDirective } from '../directives/style-paginator.directive';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
})
export class AddressesComponent implements OnInit {
  public displayedColumns: string[] = [
    'employee_name',
    'country',
    'department',
    'city',
    'district',
    'address',
    'zone',
    'link',
  ];
  public target: any;
  public isToggleSelected: boolean = false;
  public dataSource!: MatTableDataSource<any>;

  public employees!: Employee[];
  public addresses!: Address[];

  clickedRows = new Set<Address>();

  @ViewChild(MatSort, { static: false }) matSort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(StylePaginatorDirective) stylePaginator!: StylePaginatorDirective;

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow) info!: MapInfoWindow;

  public center!: google.maps.LatLngLiteral;
  public zoom = 13;
  public markerOptions!: google.maps.MarkerOptions;
  public markerPosition!: google.maps.LatLngLiteral;

  ngOnInit() {
    this.getEmployees();
    this.getAddresses();
    this.target = '';
  }

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {}

  public initMap() {
    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.markerPosition = this.center;
    });

    this.markerOptions = {
      draggable: false,
    };
  }

  public getEmployees() {
    this.employeeService.getEmployees().subscribe((response: any) => {
      this.employees = response;
    });
  }

  public getAddresses() {
    this.employeeService.getAddresses().subscribe((response: any) => {
      this.addresses = response.map((item: any) => {
        return {
          id: item.id,
          employee: this.getEmployee(item.employee_id),
          country: item.country,
          department: item.department,
          city: item.city,
          workplace_district: item.workplace_district,
          address: item.address,
          zone: item.zone,
          link_google_maps: item.link_google_maps,
        };
      });
      this.getMatTable(this.addresses);
    });
  }

  public getEmployee(id: string): string {
    let employee = this.employees
      ? this.employees.find(item => item.id === id)
      : null;

    return employee
      ? employee.firstName + ' ' + employee.lastName
      : 'Sin Employee?';
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

  public moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng !== null) {
      this.center = event.latLng.toJSON();
    }
  }

  public openMarkerInfo(marker: MapMarker) {
    if (this.info) {
      this.info.open(marker);
    }
  }

  public getDirection() {
    return this.clickedRows.values().next().value;
  }
}
