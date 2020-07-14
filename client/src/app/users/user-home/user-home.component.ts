import { Component, OnInit, ViewChild } from '@angular/core';
import { UserTableComponent } from '../user-table/user-table.component';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  @ViewChild(UserTableComponent)
  private userTableComponent: UserTableComponent;

  constructor() { }

  ngOnInit(): void {
  }
  // Send the canDeactivate to the user table component
  // canDeactivate(): Observable<boolean> | boolean {
  //   return this.userTableComponent.canDeactivate();
  // }
}
