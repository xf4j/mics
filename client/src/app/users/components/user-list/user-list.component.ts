import { Component, OnInit } from '@angular/core';
import { AuthService } from "@core/services/auth.service";

import { User } from "@/models/users.model";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  private userList: {users: User}[];

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

}
