import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule} from '@core/core.module';
import { FormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    CoreModule,
    FormsModule
  ]
})
export class UsersModule { }
