import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { createAddressDto } from 'src/app/dto/address.dto';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['../personal-information-form.component.scss'],
})
export class AddressFormComponent implements OnInit {
  public form!: FormGroup;

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  public center!: google.maps.LatLngLiteral;
  public zoom = 13;
  public markerOptions!: google.maps.MarkerOptions;
  public markerPosition!: google.maps.LatLngLiteral;
  public linkGoogleMaps!: string;

  ngOnInit() {
    this.buildForm();
    this.initMap();
  }
  constructor(private formBuilder: FormBuilder) {}

  public initMap() {
    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.markerPosition = this.center;
      this.linkGoogleMaps = this.getGoogleMapsLink();
    });

    this.markerOptions = {
      draggable: true,
    };
  }

  public buildForm() {
    this.form = this.formBuilder.group({
      country: new FormControl('', [Validators.required]), // TODO: comment  --- Table: Address
      department: new FormControl('', [Validators.required]), // TODO: comment  --- Table: Address
      city: new FormControl('', [Validators.required]), // TODO: comment  --- Table: Address
      district: new FormControl('', [Validators.required]), // TODO: comment  --- Table: Address --- Distrito de lugar de trabajo
      address: new FormControl('', [Validators.required]), // TODO: comment  --- Table: Address
      zone: new FormControl('', [Validators.required]), // TODO: comment  --- Table: Address
      linkGoogleMaps: new FormControl('', []), // TODO: comment  --- Table: Address
    });
  }

  public builAddressPayload(): createAddressDto {
    let newAddress = new createAddressDto();
    newAddress.country = this.form.get('country')?.value;
    newAddress.department = this.form.get('department')?.value;
    newAddress.city = this.form.get('city')?.value;
    newAddress.workplace_district = this.form.get('district')?.value;
    newAddress.address = this.form.get('address')?.value;
    newAddress.zone = this.form.get('zone')?.value;
    newAddress.link_google_maps = this.getGoogleMapsLink(); //cambiar [position]

    return newAddress;
  }

  public addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.markerPosition = event.latLng.toJSON();
      this.linkGoogleMaps = this.getGoogleMapsLink();
    }
  }

  public getGoogleMapsLink() {
    return (
      'https://www.google.com/maps/search/?api=1&query=' +
      this.markerPosition.lat +
      ',' +
      this.markerPosition.lng
    );
  }

  // public openMarkerInfo(marker: MapMarker) {
  //   if (this.info) {
  //     this.info.open(marker);
  //   }
  // }
}
