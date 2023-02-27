import { Component, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CreateUserDto } from 'src/app/dto/user.dto';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() inputSideNav!: MatSidenav;
  public user!: CreateUserDto;

  ngOnInit() {
    this.getUser();
  }

  constructor(
    private authenticationService: AuthenticationService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  public getUser() {
    this.authenticationService.getUser().subscribe({
      next: (data: any) => {
        this.user = data;
        this.snackBar.open('Success - Login', 'OK', { duration: 5000 });
      },
      error: (errorData: any) => {
        this.snackBar.open(errorData.error.message, 'OK', { duration: 5000 });
      },
    });
  }

  public goToProfile() {}

  public logout() {
    this.authenticationService.logout().subscribe({
      next: (data: any) => {
        this.user = new CreateUserDto();
        this.snackBar.open(data.message, 'OK', { duration: 5000 });
      },
      error: (errorData: any) => {
        this.snackBar.open(errorData.error.message, 'OK', { duration: 5000 });
      },
    });

    this.router.navigate(['/login']);
  }
}
