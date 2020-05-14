import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@/material/material.module';


import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardAddOrganizationComponent } from './components/dashboard-add-organization/dashboard-add-organization.component';


@NgModule({
  declarations: [DashboardAddOrganizationComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class DashboardModule { }
