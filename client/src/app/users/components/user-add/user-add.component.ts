import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@/core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ServerService } from '@/core/services/server.service';


@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  addForm: FormGroup;
  isStaff = false;

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private server: ServerService
  ) { }

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      username: ['', Validators.required],
      password1: ['', Validators.required],
      password2: ['', Validators.required],
      email: ['', Validators.required],
      is_staff: [false, Validators.required],
      is_admin: [false ],
      organization: [''],
    });
  }

  get f() { return this.addForm.controls; }

  onSubmit() {
    if (this.addForm.invalid) {return; }
    const userProfile = this.f.is_staff && this.auth.getStaff() ?
    null : {is_admin: this.f.is_admin.value, organization: this.f.organization.value};
    this.http.post(this.server.usersBaseAPI(), {
      username: this.f.username.value,
      password: this.f.password.value,
      email: this.f.password.value,
      is_staff: this.f.is_staff.value,
      profile: userProfile
    });
  }

}
