import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  saveToken(token: string){
    localStorage.setItem('token', token);
  }

  loadToken(): string{
    return localStorage.getItem('token');
  }

  removeToken(): void{
    localStorage.removeItem('token');
  }

  saveCurrentUser(user){
    localStorage.setItem('CurrentUser', user);
  }

  loadCurrentUser(){
    return localStorage.getItem('CurrentUser');
  }

  removeCurrentUser(){
    localStorage.removeItem('CurrentUser');
  }

}
