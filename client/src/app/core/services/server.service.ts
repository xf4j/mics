import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private serverAPI = 'api/';

  usersBaseAPI(): string{
    return this.serverAPI + 'users/';
  }

  organizationsBaseAPI(): string{
    return this.serverAPI + 'organizations/';
  }

  loginAPI(): string{
    return this.serverAPI + 'token-auth/';
  }

  refreshTokenAPI(): string{
    return this.serverAPI + 'token-refresh/';
  }

  constructor() { }
}
