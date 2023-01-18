import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLogInDto } from 'src/app/dto/user-log-in.dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  public login(UserDto: UserLogInDto) {
    return this.http.post(`${environment.userApiUrl}/auth/login`, UserDto, {
      withCredentials: true,
    });
  }

  public getUser() {
    return this.http.get(`${environment.userApiUrl}/auth/user`, {
      withCredentials: true,
    });
  }
}
