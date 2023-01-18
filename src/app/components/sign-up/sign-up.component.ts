import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CreateUserDto } from 'src/app/dto/create-user.dto';
import { RoleType } from 'src/app/enum/role-type.enum';
import { UserService } from 'src/app/services/user/user.service';
import {
  NAME_REGULAR_EXPRESSION,
  EMAIL_REGULAR_EXPRESSION,
  PASSWORD_REGULAR_EXPRESSION,
} from 'src/regex';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildSignUpForm();
  }

  public onSubmit() {
    const successfulMessage = 'Usuario Creado';
    this.userService.createUser(this.buildUserPayload()).subscribe({
      next: () => {
        this.snackBar.open(successfulMessage, 'OK', { duration: 5000 });
        this.signUpForm.reset();
        this.router.navigate(['/login']);
      },
      error: message => {
        this.snackBar.open(message, 'OK', { duration: 5000 });
      },
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

  private buildSignUpForm() {
    this.signUpForm = this.formBuilder.group({
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

  private buildUserPayload(): CreateUserDto {
    let newUser = new CreateUserDto();
    newUser.firstName = this.signUpForm.get('firstName')?.value;
    newUser.lastName = this.signUpForm.get('lastName')?.value;
    newUser.mail = this.signUpForm.get('mail')?.value;
    newUser.username = this.signUpForm.get('username')?.value;
    newUser.password = this.signUpForm.get('password')?.value;

    newUser.role = [RoleType.HUMAN_RESOURCES_USER];
    return newUser;
  }
}
