import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  serverAddress: string = 'api/';

  loginAPI(): string {
    return this.serverAddress + 'token-auth/';
  }

  refreshTokenAPI(): string {
    return this.serverAddress + 'token-refresh/';
  }

  patientsBaseAPI(): string {
    return this.serverAddress + 'patients/';
  }
  athletesBaseAPI(): string {
    return this.serverAddress + 'patients/';
  }

  studiesBaseAPI(): string {
    return this.serverAddress + 'studies/';
  }

  filesBaseAPI(): string {
    return this.serverAddress + 'files/';
  }

  usersBaseAPI(): string {
    return this.serverAddress + 'users/';
  }

  organizationsBaseAPI(): string {
    return this.serverAddress + 'organizations/';
  }

  viewerBaseAPI(): string {
    return this.serverAddress + 'viewer/';
  }

}
