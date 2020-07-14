import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { ServerService } from '../_services/server.service';
import { AlertService } from '../alert/alert.service';
import { StorageService } from '../_services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // http options for making API calls
  private httpOptions: any;

  // if network is communicating
  isLoading = false;

  // the actual JWT token
  token: string;

  // token expiration data
  token_expires: Date;

  // logged in user's username
  username: string;

  // store the URL for redirecting
  redirectUrl: string;

  // if the sidenav panel is open
  panelOpened = new BehaviorSubject<boolean>(false);
  navDisabled = new BehaviorSubject<boolean>(true);

  // if the user is an admin
  is_admin: boolean = false;

  // if the user is staff
  is_staff: boolean = false;

  // organization name if non staff
  organization: string;

  // organization id if non staff
  organizationId: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private serverService: ServerService,
    private alertService: AlertService,
    private storageService: StorageService
  ) { 
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let token: string = this.storageService.loadToken();
    if (token) {
      this.updateData(token);
    }
  }

  private updateData(token) {
    this.token = token;

    // decode the token to read the username and expiration timestamp
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));

    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
    this.is_admin = token_decoded.is_admin;
    this.is_staff = token_decoded.is_staff;
    this.organization = token_decoded.organization;
    this.organizationId = token_decoded.organization_id;
  }

  login(user) {
    this.isLoading = true;
    this.http.post(this.serverService.loginAPI(), JSON.stringify(user), this.httpOptions).subscribe(
      data => {
        this.updateData(data['token']);
        this.storageService.saveToken(data['token']);

        // Get the redirect url from authService or default to none
        let redirect = this.redirectUrl ? this.redirectUrl : '';
        // Redirect the user
        this.router.navigate([redirect]);

        this.isLoading = false;
      },
      err => {
        this.alertService.checkAndDisplayError(err);
        this.isLoading = false;
      }
    );
  }

  logout() {
    this.resetData();
    this.toggleSidenav(false);
    this.router.navigate(['/login']);
  }

  refreshToken() {
    this.isLoading = true;
    this.http.post(this.serverService.refreshTokenAPI(), JSON.stringify({token: this.token}), this.httpOptions).subscribe(
      data => {
        this.updateData(data['token']);
        this.storageService.saveToken(data['token']);
        this.isLoading = false;
        this.alertService.success("Refresh token successful.");
      },
      err => {
        this.alertService.checkAndDisplayError(err);
        this.resetData();
        this.toggleSidenav(false);
        this.router.navigate(['/login']);
        this.isLoading = false;
      }
    );
  }

  refreshAndGetHttpOptionsWithToken(withContentType = true) {
    let self = this; // observable does not accept this, must use 'self' instead
    return new Observable(observer => {
      self.http.post(self.serverService.refreshTokenAPI(), JSON.stringify({token: self.token}), self.httpOptions).subscribe(
        data => {
          self.updateData(data['token']);
          self.storageService.saveToken(data['token']);

          let options;
          if (withContentType) {
            options = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + self.token
              })
            };
          } else {
            options = {
              headers: new HttpHeaders({
                'Authorization': 'JWT ' + self.token
              })
            };
          }
          observer.next(options);
        },
        err => {
          this.alertService.checkAndDisplayError(err);
          self.resetData();
          // redirect user to login
          self.toggleSidenav(false);
          self.router.navigate(['/login']);
          observer.error(err);
        }
      );
    });
  }

  toggleSidenav(state?: boolean): void {
    if (state != undefined) {
      this.panelOpened.next(state);
      
      return;
    }
    this.panelOpened.next(this.panelOpened.value);
    // this.navDisabled.next(this.navDisabled.value);
  }

  disableSidenav(state?:boolean): void{
    if (state != undefined) {
      this.navDisabled.next(!state);
      return;
    }
    this.navDisabled.next(this.navDisabled.value);
  }


  redirectHome(): void {
    this.router.navigate(['/dashboard']);
  }

  isLoggedIn(): boolean {
    return Boolean(this.token);
  }

  private resetData() {
    this.token = null;
    this.token_expires = null;
    this.username = null;
    this.is_admin = false;
    this.is_staff = false;
    this.organization = null;
    this.organizationId = null;
    this.storageService.removeToken();
  }

}
