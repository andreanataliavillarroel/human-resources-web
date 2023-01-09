import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user/user.service';

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
    private userService: UserService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildLogInForm();
  }

  public get formControls() {
    return this.logInForm.controls;
  }

  public onSubmit() {
    this.authenticationService
      .login(
        this.formControls['user']?.value,
        this.formControls['password']?.value
      )
      .then((response) => {
        alert(response);
      })
      .catch((error) => {
        this.snackBar.open(error, 'OK', { duration: 5000 });
      });
    this.logInForm.reset();
  }

  private buildLogInForm() {
    this.logInForm = this.formBuilder.group({
      user: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
}
