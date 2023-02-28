import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Address } from 'src/app/models/address.model';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee/employee.service';

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
  public dataSource!: MatTableDataSource<any>;

  public employees!: Employee[];
  public addresses!: Address[];

  clickedRows = new Set<Address>();
  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow) info!: MapInfoWindow;

  public center!: google.maps.LatLngLiteral;
  public zoom = 13;
  public markerOptions!: google.maps.MarkerOptions;
  public markerPosition!: google.maps.LatLngLiteral;

  ngOnInit() {
    this.getEmployees();
    this.getAddresses();
  }

  constructor(private employeeService: EmployeeService) {}

  public initMap() {
    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      // this.markerPosition = this.center;
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
      this.addresses = response;
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
    let employee = this.employees.find(item => item.id === id);
    return employee ? employee.firstName + ' ' + employee.lastName : 'Error!';
  }

  public getMatTable(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.matSort;
    this.dataSource.paginator = this.paginator;
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
