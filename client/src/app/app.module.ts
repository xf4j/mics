import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@core/core.module';
import { UsersModule } from '@/users/users.module';
import { AuthService } from '@core/services/auth.service';
import { HeaderComponent } from './share/components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    UsersModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
