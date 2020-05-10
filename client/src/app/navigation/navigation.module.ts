import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



import { NavigationRoutingModule } from './navigation-routing.module';
import { MaterialModule } from '@/material/material.module';

import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';
import { HeaderLoginComponent } from './components/header-login/header-login.component';


@NgModule({
  declarations: [SidenavComponent, HeaderComponent, HeaderLoginComponent],
  imports: [
    CommonModule,
    NavigationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    SidenavComponent
  ]
})
export class NavigationModule { }
