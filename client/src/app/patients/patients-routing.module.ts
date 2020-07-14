// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';
// import { PatientsComponent } from './patients/patients.component';
// import { PatientHomeComponent } from './patient-home/patient-home.component';

// import { AuthGuard } from '../users/auth.guard';
// import { StaffGuard } from '../users/staff.guard';
// import { CanDeactivateGuard } from '../_services/can-deactivate.guard';
// import { PatientAddPatientComponent } from './patient-add-patient/patient-add-patient.component';

// const routes: Routes = [
//   {
//     path: 'patients',
//     component: PatientsComponent,
//     canActivate: [AuthGuard],
//     children: [
//       {
//         path: '',
//         canActivateChild: [AuthGuard],
//         children: [
//           {
//             path: 'add-patient',
//             canActivate: [StaffGuard],
//             canDeactivate: [CanDeactivateGuard],
//             component: PatientAddPatientComponent,
//           },
//           {
//             path: '',
//             component: PatientHomeComponent,
//             canActivate: [AuthGuard],
//             canDeactivate: [CanDeactivateGuard]
//           }
//         ]
//       }
//     ]
//   }
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class PatientsRoutingModule { }
