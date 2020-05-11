import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";

import { User } from "@/models/users.model";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  public userList: User[] = [];
  private organizationList: [];

  constructor(
    private userService: UserService

  ) { }

  ngOnInit(): void {
  }

  onButton() {
    // this.userService.getUser().subscribe(
    //   data => {
    //     this.getUserList();
    //   }
    // );
    this.userService.getOrganization().subscribe();
  }

  getUserList() {
    this.userList = this.userService.userList;
  }

}
