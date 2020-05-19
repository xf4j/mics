import { Component, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


import { AuthService } from '@core/services/auth.service';
import { Subscription } from 'rxjs';
import { UserListComponent } from '@/users/components/user-list/user-list.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnDestroy, AfterViewInit {
  @ViewChild(UserListComponent) child: UserListComponent;
  opened: boolean;
  isLoggedIn: boolean;
  subscription: Subscription;
  constructor(
    public auth: AuthService,
    private router: Router
  ) {
    // initialized sidenav open status
    this.opened = this.auth.isLoggedIn();
    this.isLoggedIn = this.auth.isLoggedIn();
    this.subscription = this.auth.loginStatus.subscribe( data => {
      this.isLoggedIn = (!!data);
      this.opened = this.isLoggedIn;
      if (this.isLoggedIn) {this.child.getUserList(); }
    });
  }

  ngAfterViewInit() {
    if (this.isLoggedIn) {
      this.child.getUserList();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getToggle(){
    this.opened = this.isLoggedIn ? (!this.opened) : false;
  }

  onAdd() {
    // this.router.navigate(['dashboard']);
  }

}
