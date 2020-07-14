import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationsComponent } from './organizations/organizations.component';
import { OrganizationHomeComponent } from './organization-home/organization-home.component';
import { OrganizationEditOrganizationComponent } from './organization-edit-organization/organization-edit-organization.component';
import { AuthGuard } from '../users/auth.guard';
import { StaffGuard } from '../users/staff.guard';
import { CanDeactivateGuard } from '../_services/can-deactivate.guard';
import { OrganizationAddOrganizationComponent } from './organization-add-organization/organization-add-organization.component'

const routes: Routes = [
  {
    path: 'organizations',
    component: OrganizationsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          {
            path: 'add-organization',
            canActivate: [StaffGuard],
            canDeactivate: [CanDeactivateGuard],
            component: OrganizationAddOrganizationComponent,
          },
          {
            path: '',
            component: OrganizationHomeComponent,
            canActivate: [StaffGuard],
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'edit-organization',
            component: OrganizationEditOrganizationComponent,
            canActivate: [StaffGuard],
            canDeactivate: [CanDeactivateGuard]
            
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationsRoutingModule { }
