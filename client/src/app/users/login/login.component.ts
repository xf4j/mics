import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (this.authService.isLoggedIn()) {
      this.authService.toggleSidenav(true);
    }
  }

  ngOnInit(): void {

  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  login(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.authService.login({'username': this.f.username.value, 'password': this.f.password.value});
  }

  logout(): void {
    this.authService.logout();
  }

  refreshToken(): void {
    this.authService.refreshToken();
  }

}
