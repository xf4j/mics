import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button';
import { OrganizationsRoutingModule } from './organizations-routing.module';
import { OrganizationsComponent } from './organizations/organizations.component';
import { OrganizationHomeComponent } from './organization-home/organization-home.component';
import { OrganizationTableComponent } from './organization-table/organization-table.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { OrganizationAddOrganizationComponent } from './organization-add-organization/organization-add-organization.component';
import { OrganizationEditOrganizationComponent } from './organization-edit-organization/organization-edit-organization.component';
@NgModule({
  declarations: [OrganizationsComponent, OrganizationHomeComponent, OrganizationTableComponent, OrganizationAddOrganizationComponent, OrganizationEditOrganizationComponent],
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    OrganizationsRoutingModule
    
  ]
})
export class OrganizationsModule { }
