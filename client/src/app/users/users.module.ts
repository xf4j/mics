import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './components/user-list/user-list.component';




@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,

  ],
  providers: [],
  exports: []
})
export class UsersModule { }
