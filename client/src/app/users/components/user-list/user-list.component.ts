import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';

import { Subscription } from 'rxjs';



@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  public userList = {};
  public organizationList = {};
  subscription: Subscription;
  @Input() opened: boolean;

  constructor(
    private userService: UserService
  ) {
    this.subscription = this.userService.updateStatus.subscribe(
      data => {
        if (!!data) {
          this.updateUser();
        }});
  }

  ngOnInit(): void {
  }


  getUserList() {
    this.userService.getUserandOrganization().subscribe(() => {
      const {userList, organizationList} = { userList: {}, organizationList: [],
           ...this.userService.mergeUserAndOrganization()};
      this.userList = userList;
      this.organizationList = organizationList;
    });
  }

  updateUser() {
    // const {userList} = { userList: {}, ...this.userService.mergeUserAndOrganization()};
    const {userList, organizationList} = { userList: {}, organizationList: [],
           ...this.userService.mergeUserAndOrganization()};
    this.userList = userList;
    this.organizationList = organizationList;
  }

}
