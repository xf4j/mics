import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule} from "@angular/material/input";
import { MatButtonModule} from "@angular/material/button";

import { SharedRoutingModule } from './shared-routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
  ],
})
export class SharedModule { }
