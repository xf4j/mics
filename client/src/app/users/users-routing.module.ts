import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { UserAddComponent } from './components/user-add/user-add.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent},
  {
    path: 'user-add',
    component: UserAddComponent,
    canActivate: [AuthGuard]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
