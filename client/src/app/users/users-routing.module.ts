import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { UserHomeComponent } from './user-home/user-home.component';

import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';
import { CanDeactivateGuard } from '../_services/can-deactivate.guard';

const userRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard, AdminGuard],
        children: [
          {
            path: '',
            component: UserHomeComponent,
            canDeactivate: [CanDeactivateGuard]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(userRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class UsersRoutingModule {}  