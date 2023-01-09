import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateUserDto } from 'src/app/dto/create-user.dto';
import { RoleType } from 'src/app/enum/role-type.enum';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;

  constructor(
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
      },
      error: (message) => {
        this.snackBar.open(message, 'OK', { duration: 5000 });
      },
    });
  }

  private buildSignUpForm() {
    this.signUpForm = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      mail: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
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
