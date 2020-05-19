import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardAddOrganizationComponent } from '@/dashboard/components/dashboard-add-organization/dashboard-add-organization.component';
import { AuthGuard } from '@/core/guards/auth.guard';
import { AdminGuard } from '@/core/guards/admin.guard';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManageOrganizationComponent } from './components/manage-organization/manage-organization.component';




const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'user',
            component: ManageUserComponent
          },
          {
            path: 'add-organization',
            component: DashboardAddOrganizationComponent
          },
          {
            path: 'organization',
            component: ManageOrganizationComponent,
            canActivate: [AdminGuard]
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
export class DashboardRoutingModule { }
