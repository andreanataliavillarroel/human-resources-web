import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
})
export class MapsComponent implements OnInit {
  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 24,
    lng: 12,
  };
  zoom = 4;

  constructor() {}

  ngOnInit() {
    console.log('maps');
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng !== null) {
      this.center = event.latLng.toJSON();
    }
  }
}
