import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule, MatButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenav, MatSidenavModule } from "@angular/material/sidenav";

import { NavigationRoutingModule } from './navigation-routing.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';


@NgModule({
  declarations: [SidenavComponent, HeaderComponent],
  imports: [
    CommonModule,
    NavigationRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule
  ],
  exports: [
    SidenavComponent
  ]
})
export class NavigationModule { }
