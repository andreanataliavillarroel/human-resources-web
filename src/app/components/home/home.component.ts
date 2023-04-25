import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { ChartDataset, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router, private cdref: ChangeDetectorRef) {}

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  public createNewEmployee() {
    this.router.navigate(['/form']);
  }
}
