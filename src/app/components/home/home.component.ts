import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  ngOnInit() {}

  constructor(private router: Router) {}

  public createNewEmployee() {
    //TODO: poner en un card
    this.router.navigate(['/personal-information-form']);
  }
}
