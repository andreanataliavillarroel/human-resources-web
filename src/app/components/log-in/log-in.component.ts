import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserLogInDto } from 'src/app/dto/user-log-in.dto';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {
  logInForm!: FormGroup;

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

  private buildUserPayload(): UserLogInDto {
    let user = new UserLogInDto();
    user.user = this.logInForm.get('user')?.value;
    user.password = this.logInForm.get('password')?.value;
    return user;
  }

  public onSubmit() {
    this.authenticationService.login(this.buildUserPayload()).subscribe({
      next: (data: any) => {
        this.snackBar.open(data.message.toString(), 'OK', { duration: 5000 });
        this.logInForm.reset();
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
