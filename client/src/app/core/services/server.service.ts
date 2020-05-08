import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private domain = 'http://127.0.0.1:8000/api/';

  usersBaseAPI(): string{
    return this.domain + 'users/';
  }

  organizationsBaseAPI(): string{
    return this.domain + 'organizations/';
  }

  loginAPI(): string{
    return this.domain + 'token-auth/';
  }

  constructor() { }
}
