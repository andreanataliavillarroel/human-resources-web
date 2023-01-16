import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
})
export class MapsComponent {
  // apiLoaded: Observable<boolean>;

  constructor(httpClient: HttpClient) {
    // this.apiLoaded = httpClient
    //   .jsonp(
    //     'https://maps.googleapis.com/maps/api/js?key=AIzaSyDIJE1GemZ63beL0kuctNAE2AaNW676qE0',
    //     'callback'
    //   )
    //   .pipe(
    //     map(() => true),
    //     catchError(() => of(false))
    //   );
  }
}
