import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { StorageService } from './storage.service';
import { ServerService } from './server.service';
import { LoginUser, UserProfile } from '@/models/users.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  // Current user instance
  private CurrentUser: LoginUser;

  constructor(
    private storageService: StorageService,
    private http: HttpClient,
    private serverService: ServerService,
  ) {
    const obj = JSON.parse(this.storageService.loadCurrentUser());
    this.CurrentUser = obj ? Object.assign(new LoginUser(), obj) : new LoginUser();
  }

  // login to get token from the server.
  login(user: { username: string; password: string; }){
    return this.http.post(this.serverService.loginAPI(), user, this.httpOptions)
    .pipe(map(data => {
      const token = data['token'.toString()];
      if (!!token) {
        this.updateUser(token);
        this.storageService.saveCurrentUser(JSON.stringify(this.CurrentUser));
      }
    }));
  }


  logout(): void{
    this.resetUser();
    this.storageService.removeCurrentUser();
  }

  private decodeToken(token: string){
    return JSON.parse(atob(token.split('.')[1]));
  }

  private updateUser(token: string): void{
    const tokenDecoded = this.decodeToken(token);

    const profile = (!!this.CurrentUser.profile) ? new UserProfile(tokenDecoded.is_admin, tokenDecoded.organization) : null;
    this.CurrentUser.updateLoginUser(
      tokenDecoded.username,
      tokenDecoded.email,
      tokenDecoded.user_id,
      token, profile,
      tokenDecoded.is_staff,
      tokenDecoded.exp
      );

    this.storageService.saveCurrentUser(this.CurrentUser);
  }

  private resetUser(): void{
    this.CurrentUser.reset();
  }

  isLoggedIn(): boolean{
    return (!!this.CurrentUser.username) && this.CurrentUser.exp > Date.now() / 1000;
  }
}
