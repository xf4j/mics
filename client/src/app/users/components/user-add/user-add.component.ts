import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '@/core/services/auth.service';
import { UserService } from '@/users/services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  addForm: FormGroup;
  isStaff = new FormControl(false);
  isAdmin = new FormControl(false);
  submitted = false;
  orgList = {};

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    public userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      username: ['', Validators.required],
      password1: ['', Validators.required],
      password2: ['', [this.matchPassword('password1')]],
      email: ['', [Validators.required]],
      organization: [''],
    });
  }

  matchPassword( matchTo: string): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? null
        : {isMatch: false};
    };
  }

  get f() { return this.addForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.addForm.invalid) {return; }
    const userProfile = this.isStaff.value && this.auth.getStaff() ?
    null : {is_admin: this.isAdmin.value, organization: this.f.organization.value};
    const request = {
      username: this.f.username.value,
      password: this.f.password1.value,
      email: this.f.email.value,
      is_staff: this.isStaff.value,
    };
    if (!!userProfile) {
      request['profile'.toString()] = userProfile;
    }
    this.userService.addUser(request).subscribe(
      data => {
        this.router.navigate(['/']);
      });
  }

}
