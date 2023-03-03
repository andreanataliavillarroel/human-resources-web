import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CreateUserDto } from 'src/app/dto/user.dto';
import { RoleType } from 'src/app/enum/role-type.enum';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import {
  NAME_REGULAR_EXPRESSION,
  EMAIL_REGULAR_EXPRESSION,
  PASSWORD_REGULAR_EXPRESSION,
} from 'src/regex';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public user!: CreateUserDto;
  form!: FormGroup;

  ngOnInit() {
    this.getUser();
    this.buildUserForm();
  }

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {}

  public getUser() {
    this.authenticationService.getUser().subscribe({
      next: (data: any) => {
        this.user = data;
        console.log(this.user);
      },
      error: (errorData: any) => {
        this.snackBar.open(errorData.error.message, 'OK', { duration: 5000 });
      },
    });
  }

  private buildUserForm() {
    this.form = this.formBuilder.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGULAR_EXPRESSION),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGULAR_EXPRESSION),
      ]),
      mail: new FormControl('', [
        Validators.required,
        Validators.pattern(EMAIL_REGULAR_EXPRESSION),
      ]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(PASSWORD_REGULAR_EXPRESSION),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(PASSWORD_REGULAR_EXPRESSION),
        this.validateConfirmPassword(),
      ]),
    });
  }

  private validateConfirmPassword() {
    return (control: AbstractControl) => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value !== control.parent.get('password')?.value
        ? { errorMatching: true }
        : null;
    };
  }

  public onSubmit() {
    const successfulMessage = 'Usuario Creado';
    this.userService.createUser(this.buildUserPayload()).subscribe({
      next: () => {
        this.snackBar.open(successfulMessage, 'OK', { duration: 5000 });
        this.form.reset();
      },
      error: message => {
        this.snackBar.open(message, 'OK', { duration: 5000 });
      },
    });
  }

  private buildUserPayload(): CreateUserDto {
    let newUser = new CreateUserDto();
    newUser.firstName = this.form.get('firstName')?.value;
    newUser.lastName = this.form.get('lastName')?.value;
    newUser.mail = this.form.get('mail')?.value;
    newUser.username = this.form.get('username')?.value;
    newUser.password = this.form.get('password')?.value;

    newUser.role = [RoleType.HUMAN_RESOURCES_USER];
    return newUser;
  }
}
