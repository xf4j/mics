import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

// Todo: error notice when login request is refused
@Component({
  selector: 'app-header-login',
  templateUrl: './header-login.component.html',
  styleUrls: ['./header-login.component.css']
})
export class HeaderLoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<HeaderLoginComponent>,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    // initialize form group
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // easy access to form attr
  get f() { return this.loginForm.controls; }

  login() {
    this.submitted = true;

    if (this.loginForm.invalid) {return; }
    // log in with authentication service
    this.loading = true;
    this.authService.login({
      username: this.f.username.value,
      password: this.f.password.value
    })
    .subscribe(status => {
      // successful login.
      this.loading = false;
      this.onClose();
    },
      // username and password do not match or user does not exist
      error => {
        console.log(error);
        this.loading = false;
        this.loginForm.reset({username: this.f.username.value, password: ''});
      });
  }
  // close the login dialog
  onClose() {
    this.dialogRef.close();
  }

}
