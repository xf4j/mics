import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AlertComponent } from './alert/alert.component';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule
  ],
  declarations: [
    AlertComponent
  ],
  exports: [
    AlertComponent
  ]
})
export class AlertModule { }
