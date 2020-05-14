import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';

import { User, Organization } from '@/models/users.model';
import { merge } from 'rxjs';



@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  public userList;
  public organizationList = {};
  @Input() opened: boolean;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }


  getUserList() {
    const merged = merge(this.userService.getUser(), this.userService.getOrganization());
    merged.subscribe(
      data => {
      },
      null,
      // complete subscription
      () => {
        this.userList = this.mergeUserAndOrganization(this.userService.userList, this.userService.orgList);
       }
    );
  }

  mergeUserAndOrganization(userList: User[], orgList: Organization[]) {
    let array = {};
    for (const user of userList) {
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
        this.organizationList[0] = 'staff';
      }
    }
    for (const org of orgList) {
      this.organizationList[org.id] = org.name;
    }
    return array;
  }

}
