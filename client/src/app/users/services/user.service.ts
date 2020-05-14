import { Injectable } from '@angular/core';
import { map, flatMap } from 'rxjs/operators';

import { ServerService } from "@core/services/server.service";
import { HttpClient } from "@angular/common/http";
import { User, IUser, Organization, IOrgList } from '@/models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userList: User[] = [];
  public orgList: Organization[] = [];
  constructor(
    private server: ServerService,
    private http: HttpClient
  ) { }

  getUser() {
    return this.http.get(this.server.usersBaseAPI()).pipe(map(
      (data: IUser[]) => {
        this.userList = [];
        for (const user of data) {
          this.userList.push(new User(user));
        }
        return this.userList;
    }));
  }

  addUser(user) {
    return this.http.post(this.server.usersBaseAPI(), user);
  }

  getOrganization() {
    return this.http.get(this.server.organizationsBaseAPI()).pipe(map(
      (data: IOrgList[]) => {
        this.orgList = [];
        for (const organization of data) {
          this.orgList.push(new Organization(organization));
        }
        return this.orgList;
      }
    ));
  }

}
