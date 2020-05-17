import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { ServerService } from '@core/services/server.service';
import { HttpClient } from '@angular/common/http';
import { User, IGetUser, Organization, IOrgList, IPostUser } from '@/models/users.model';
import { Subject, forkJoin, Observable, concat } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  updateStatus = new Subject<boolean>();
  initialized = false;
  public userList: User[] = [];
  public orgList = {};
  constructor(
    private server: ServerService,
    private http: HttpClient
  ) { }

  getUser(url: string= '') {
    url = this.server.usersBaseAPI() + url;
    return this.http.get(url).pipe(map(
      (data: IGetUser[]) => {
        this.userList = [];
        for (const user of data) {
          this.userList.push(new User(user));
        }
        // when initialized, boardcast ready status to all components subscribing updateStatus()
        if (!this.initialized) {
          this.initialized = true;
          this.updateStatus.next(true);
        }
        return this.userList;
    }));
  }

  addUser(user: IPostUser) {
    return concat(this.http.post(this.server.usersBaseAPI(), user),
    this.getUser()).pipe(map(
      data => {
        this.updateStatus.next(true);
        return data;
    }));
  }

  deleteUser(userPk: number) {
    return concat(this.http.delete(this.server.usersBaseAPI() + userPk.toString() + '/'),
      this.getUser()).pipe(map( data => {
        this.updateStatus.next(true);
        return data;
      }));
}

  getOrganization() {
    return this.http.get(this.server.organizationsBaseAPI()).pipe(map(
      (data: IOrgList[]) => {
        this.orgList = {};
        for (const organization of data) {
          this.orgList[organization.id] = organization.name;
        }
        return data;
      }
    ));
  }

  getUserandOrganization() {
    return forkJoin([this.getUser(), this.getOrganization()]).pipe(map(
      ([userList, organizationList]) => {
        return [userList, organizationList];
      }
    ));
  }

  mergeUserAndOrganization() {
    const array = {};
    const organizationList = {...this.orgList};
    for (const user of this.userList) {
      if ((!!user.profile) && array.hasOwnProperty(user.profile.organization)) {
        array[user.profile.organization].push(user);
      }
      else if ((!!user.profile) && !array.hasOwnProperty(user.profile.organization)) {
        array[user.profile.organization] = [user];
      }
      else if (!user.profile && array.hasOwnProperty(0)) {
        array[0].push(user);
      }
      else if (!user.profile && !array.hasOwnProperty(0)) {
        array[0] = [user];
        organizationList[0] = 'staff';
      }
    }
    return {userList: array, organizationList};
  }

  getUserList() {
    return this.userList;
  }

  getOrganizationList() {
    return this.orgList;
  }

}
