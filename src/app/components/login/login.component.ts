import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CreateUserDto } from 'src/app/dto/user.dto';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LogInComponent implements OnInit {
  logInForm!: FormGroup;
  public user!: CreateUserDto;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildLogInForm();
  }

  public get formControls() {
    return this.logInForm.controls;
  }

  public onSubmit() {
    this.authenticationService.login(this.logInForm.getRawValue()).subscribe({
      next: (data: any) => {
        this.snackBar.open(data.message.toString(), 'OK', { duration: 5000 });
        this.logInForm.reset();
        this.router.navigate(['/home']);
        this.getUser();
      },
      error: (data: any) => {
        this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
      },
    });
  }

  public getUser() {
    this.authenticationService.getUser().subscribe({
      next: (data: any) => {
        console.log(data);
        this.user = data;
      },
      error: (data: any) => {
        this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
      },
    });
  }

  private buildLogInForm() {
    this.logInForm = this.formBuilder.group({
      user: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
}
