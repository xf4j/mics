import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@/material/material.module';


import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardAddOrganizationComponent } from './components/dashboard-add-organization/dashboard-add-organization.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManageOrganizationComponent } from './components/manage-organization/manage-organization.component';


@NgModule({
  declarations: [DashboardAddOrganizationComponent, ManageUserComponent, DashboardComponent, ManageOrganizationComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class DashboardModule { }
