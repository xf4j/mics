import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { AuthService } from './auth.service';
import { ServerService } from '../_services/server.service';
import { AlertService } from '../alert/alert.service';

export interface User {
  id: number | string;
  username: string;
  email: string;
  profile: {
    is_admin: boolean
    organization: number | string
  };
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private serverService: ServerService,
    private alertService: AlertService
  ) { }

  /* Get the users from the backend */
  getUsers(): Observable<any[]> {
    let self = this;
    return new Observable(observer => {
      self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
        httpOptions => self.http.get(self.serverService.usersBaseAPI(), httpOptions).subscribe(
          (data: any[]) => {
            if (self.alertService.checkAndDisplayError(data)) {
              observer.next(data);
            } else {
              observer.error();
            }
          },
          err => {
            self.alertService.checkAndDisplayError(err);
            observer.error(err);
          }
        )
      );
    });
  }

  /* Add a user to the backend */
  addUser(userForm): Observable<any> {
    let self = this;
    return new Observable(observer => {
      self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
        httpOptions => self.http.post(self.serverService.usersBaseAPI(), userForm, httpOptions).subscribe(
          data => {
            self.alertService.success("Successfully added " + (data['profile']['is_admin'] ? "admin " : "user ") + data['username'] + ".")
            observer.next(data);
          },
          err => {
            self.alertService.checkAndDisplayError(err);
            observer.error(err);
          }
        )
      );
    });
  }

  /* Add a staff user, staff only method */
  addStaff(userForm): Observable<any> {
    if (!this.authService.is_staff) return of(false);
    let self = this;
    return new Observable(observer => {
      self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
        httpOptions => self.http.post(self.serverService.usersBaseAPI() + 'create_staff/', userForm, httpOptions).subscribe(
          data => {
            self.alertService.success("Successfully added staff " + data['username'] + ".");
            observer.next(data);
          },
          err => {
            self.alertService.checkAndDisplayError(err);
            observer.error(err);
          }
        )
      );
    });
  }

  /* Update an existing user's info */
  updateUser(userForm, selectedUser: string | number): Observable<any> {
    let self = this;
    return new Observable(observer => {
      self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
        httpOptions => self.http.patch(self.serverService.usersBaseAPI() + selectedUser + '/', userForm, httpOptions).subscribe(
          data => {
            self.alertService.success("Successfully updated.");
            observer.next(data);
          },
          err => {
            self.alertService.checkAndDisplayError(err);
            observer.error(err);
          }
        )
      );
    });
  }

  /* Delete an existing user from the backend */
  deleteUser(user: any): Observable<boolean> {
    let self = this;
    return new Observable(observer => {
      self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
        httpOptions => {
          self.http.delete(self.serverService.usersBaseAPI() + user.id + '/', httpOptions).subscribe(
            data => {
              self.alertService.success(user.username + ' deleted.');
              observer.next(true);
            },
            err => {
              self.alertService.checkAndDisplayError(err);
              observer.error(err);
            }
          );
        }
      );
    });
  }
}
