import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { StorageService } from './storage.service';
import { ServerService } from './server.service';
import { User, UserProfile } from '@/models/users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: string;
  CurrentUser: User = new User();
  tokenExpiredTime: Date;

  constructor(
    private storageService: StorageService,
    private http: HttpClient,
    private serverService: ServerService,
  ) {

  }

  // user login and save to local storage.
  login(user){
    this.http.post(this.serverService.loginAPI(), user).subscribe(
      data => {
        this.token = data['token'.toString()];
        // this.storageService.saveToken(this.token);
        this.updateAll();
        this.storageService.saveCurrentUser(this.CurrentUser);
      },
      err => {}
    );
  }
  private decodeToken(token: string){
    return JSON.parse(atob(token.split('.')[1]));
  }

  private updateAll(){
    const tokenDecoded = this.decodeToken(this.token);

    this.tokenExpiredTime = tokenDecoded.exp;
    this.updateUser(tokenDecoded);
  }

  private updateUser(tokenDecoded){
    let profile = null;
    if (!!this.CurrentUser.profile){profile = new UserProfile(tokenDecoded.is_admin, tokenDecoded.organization); }
    this.CurrentUser.update(tokenDecoded.username, tokenDecoded.email, tokenDecoded.user_id, this.token, profile, tokenDecoded.is_staff);
  }

  private resetUser(){
    this.token = null;
    this.CurrentUser.reset();
  }
}
