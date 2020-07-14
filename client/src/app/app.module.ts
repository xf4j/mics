import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AlertModule } from './alert/alert.module';
import { SidenavModule } from './sidenav/sidenav.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { DashboardModule } from './dashboard/dashboard.module';
// import { StudiesModule } from './studies/studies.module';
import { UsersModule } from './users/users.module';
import { ViewerModule } from './viewer/viewer.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    ConfirmDialogComponent,
    
    
  ],
  entryComponents: [
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    AlertModule,
    OrganizationsModule,
    DashboardModule,
    // StudiesModule,
    UsersModule,
    SidenavModule,
    ViewerModule,
    
    // PatientsModule,
    // AthletesModule ,
    AppRoutingModule,
    
    
    // this needs to be imported last for the wildcard page-not-found
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
