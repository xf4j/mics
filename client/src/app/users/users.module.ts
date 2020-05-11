import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './components/user-list/user-list.component';

import { MaterialModule } from "@/material/material.module";


@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule
  ],
  providers: [],
  exports: [UserListComponent]
})
export class UsersModule { }
