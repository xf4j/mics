import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  saveToken(token) {
    localStorage.setItem('token', token);
  }

  loadToken(): string {
    return localStorage.getItem('token');
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  // saveUsername(username) {
  //   localStorage.setItem('username', username);
  // }

  // loadUsername(): string {
  //   return localStorage.getItem('username');
  // }

  // removeUsername() {
  //   localStorage.removeItem('username');
  // }
}
