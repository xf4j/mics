import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { PatientStudyDetailComponent } from './patient-study-detail/patient-study-detail.component';
import { AuthGuard } from '../users/auth.guard';
import { AdminGuard } from '../users/admin.guard';
import { StaffGuard } from '../users/staff.guard';
import { ViewPatientComponent} from './view-patient/view-patient.component';
import { CanDeactivateGuard } from '../_services/can-deactivate.guard';
import{ StudyDetailResolverService} from '../studies/study-detail-resolver.service';

const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          {
            path: 'add-patient',
            canActivate: [AdminGuard],
            canDeactivate: [CanDeactivateGuard],
            component: AddPatientComponent,
          },
          {
            path: 'patient/:pid',
            component: ViewPatientComponent,
            canActivate: [StaffGuard],
            canDeactivate: [CanDeactivateGuard]
            
          },
          {
            path: ':uid',
            component: PatientStudyDetailComponent,
            resolve: {
              studyDetail: StudyDetailResolverService
            }
          },
          {
            path: '',
            component: DashboardHomeComponent,
            // PatientDashboardComponent, 
            canDeactivate: [CanDeactivateGuard]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(dashboardRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutingModule { }
