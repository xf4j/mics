import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardAddOrganizationComponent } from '@/dashboard/components/dashboard-add-organization/dashboard-add-organization.component';
import { AuthGuard } from '@/core/guards/auth.guard';




const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardAddOrganizationComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
