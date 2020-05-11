import { Component, OnInit, OnDestroy, isDevMode } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {

  opened: boolean;
  isLoggedIn: boolean;
  subscription: Subscription;
  constructor(
    private auth: AuthService
  ) {
    // initialized sidenav open status
    this.opened = this.auth.isLoggedIn();
    this.isLoggedIn = this.auth.isLoggedIn();
    this.subscription = this.auth.loginStatus.subscribe( data => {
      this.isLoggedIn = (!!data);
      this.opened = this.isLoggedIn;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getToggle(){
    this.opened = this.isLoggedIn ? (!this.opened) : false;
    if (isDevMode()) {
      console.log(this.opened, this.isLoggedIn);
    }
  }

}
