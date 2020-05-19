import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { StorageService } from './storage.service';
import { ServerService } from './server.service';
import { LoginUser, UserProfile } from '@/models/users.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  // Current user instance
  private CurrentUser: LoginUser;
  public loginStatus = new Subject<boolean>();


  constructor(
    private storageService: StorageService,
    private http: HttpClient,
    private serverService: ServerService,
    private router: Router,
  ) {
    const token = this.storageService.loadToken();
    this.CurrentUser = new LoginUser();
    if (!!token) {
      this.updateUser(token);
      this.refreshToken();
      this.loginStatus.next(this.isLoggedIn());
    }
  }

  // login to get token from the server.
  login(user: { username: string; password: string; }){
    return this.http.post(this.serverService.loginAPI(), user, this.httpOptions)
    .pipe(map(data => {
      const token = data['token'.toString()];
      if (!!token) {
        this.updateUser(token);
        this.storageService.saveToken(token);
      }
      this.loginStatus.next(!!token);
    }));
  }

  // get refresh token
  refreshToken() {
    return this.http.post(this.serverService.refreshTokenAPI(), {token: this.CurrentUser.token}, this.httpOptions)
    .pipe(map( data => {
      // this.CurrentUser.token = data['token'.toString()];
      this.updateUser(data['token'.toString()]);
      this.storageService.saveToken(data['token'.toString()]);
      this.loginStatus.next(this.isLoggedIn());
      return data;
    },
    err => {
      this.resetUser();
      this.storageService.removeToken();
      this.loginStatus.next(false);
    }));
  }


  logout(): void{
    this.resetUser();
    this.storageService.removeToken();
    this.loginStatus.next(false);
    this.router.navigate(['/']);
  }

  private decodeToken(token: string){
    return JSON.parse(atob(token.split('.')[1]));
  }

  private updateUser(token: string): void{
    const tokenDecoded = this.decodeToken(token);
    const profile = (!!tokenDecoded.organization) ?
      new UserProfile({is_admin: tokenDecoded.is_admin, organization: tokenDecoded.organization_id}) : null;
    this.CurrentUser.updateLoginUser(
      {username: tokenDecoded.username,
      email: tokenDecoded.email,
      id: tokenDecoded.user_id,
      profile,
      token,
      exp: tokenDecoded.exp,
      is_staff: tokenDecoded.is_staff}
    );
    this.storageService.saveToken(token);
  }

  private resetUser(): void{
    this.CurrentUser = new LoginUser(); // .reset();
  }

  isLoggedIn(): boolean{
    return (!!this.CurrentUser.username) && this.CurrentUser.exp >= Date.now() / 1000;
  }

  getCurrentUser() {
    return this.CurrentUser.username;
  }

  getToken() {
    return this.CurrentUser.token;
  }

  getStaff(){
    return this.CurrentUser.is_staff || !this.CurrentUser.profile;
  }

  getAdmin() {
    const bool = (!!this.CurrentUser.profile) ? this.CurrentUser.profile.is_admin : null;
    return Boolean(this.getStaff() || bool);
  }
}
