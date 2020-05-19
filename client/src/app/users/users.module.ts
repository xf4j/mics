import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './components/user-list/user-list.component';

import { MaterialModule } from '@/material/material.module';
import { LoginComponent } from './components/login/login.component';
import { UserAddComponent } from './components/user-add/user-add.component';


@NgModule({
  declarations: [UserListComponent, LoginComponent, UserAddComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  exports: [UserListComponent, LoginComponent]
})
export class UsersModule { }
