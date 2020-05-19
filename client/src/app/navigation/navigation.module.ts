import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



import { NavigationRoutingModule } from './navigation-routing.module';
import { UsersModule } from '@/users/users.module';
import { DashboardModule } from '@/dashboard/dashboard.module';
import { MaterialModule } from '@/material/material.module';

import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';



@NgModule({
  declarations: [SidenavComponent, HeaderComponent],
  imports: [
    CommonModule,
    NavigationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    UsersModule,
    DashboardModule
  ],
  exports: [
    SidenavComponent
  ]
})
export class NavigationModule { }
