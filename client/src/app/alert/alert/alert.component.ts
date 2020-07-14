import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AlertService } from '../alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: any;
  color: string;

  constructor(
    private alertService: AlertService,
    public snackBar: MatSnackBar,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    this.subscription = this.alertService.getMessage().subscribe(
      message => {
        this.message = message;
        if (message !== undefined) {
          if (message.type === 'success') {
            this.color = 'green-snackbar';
          }
          else if (message.type === 'error') {
            this.color = 'red-snackbar';
          }
          else if (message.type === 'caution') {
            this.color = 'yellow-snackbar';
          }
          // Add more colors in styles
          this.zone.run(() => {
            this.snackBar.open(this.message.text, 'X', { duration: 6000, panelClass: [this.color], verticalPosition: 'top' });
          });
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
