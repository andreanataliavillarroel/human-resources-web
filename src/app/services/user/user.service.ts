import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateUserDto } from '../../dto/create-user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  static updateUser(
    id: string,
    userInjected: {
      id: string;
      username: string;
      password: string;
      firstName: string;
      lastName: string;
      // token: string;
      status: number;
      role: string;
      createdAt: string;
      mail: string;
    }
  ) {
    throw new Error('Method not implemented');
  }

  constructor(private http: HttpClient) {}
  public createUser(UserDto: CreateUserDto) {
    return this.http.post(`${environment.userApiUrl}/users`, UserDto);
  }
}
