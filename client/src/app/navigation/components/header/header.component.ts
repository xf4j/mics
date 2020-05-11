import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { AuthService } from '@core/services/auth.service';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HeaderLoginComponent } from '../header-login/header-login.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() private toggleOuter = new EventEmitter();
  toggle = true;

  isLoggedIn = false;
  username: string;
  password: string;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
  ) {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.username = this.authService.getCurrentUser();
    }
  }

  ngOnInit(): void {

  }

  onToggleClick(){
    this.toggleOuter.emit();
  }

  onLogin() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.panelClass = 'login-dialog';
    const dialogRef = this.dialog.open(HeaderLoginComponent, dialogConfig);

    // status update
    dialogRef.afterClosed().subscribe(result => {

      // successful login.
      if (this.authService.isLoggedIn()) {
        this.isLoggedIn = true;
        this.username = this.authService.getCurrentUser();
      }
    });

  }

  onLogout() {
    this.authService.logout();
    if (!this.authService.isLoggedIn()) {
      this.username = '';
      this.isLoggedIn = false;
    }
  }

}
