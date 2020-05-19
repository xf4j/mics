import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ServerService } from '@/core/services/server.service';

@Component({
  selector: 'app-dashboard-add-organization',
  templateUrl: './dashboard-add-organization.component.html',
  styleUrls: ['./dashboard-add-organization.component.css']
})
export class DashboardAddOrganizationComponent implements OnInit {

  addForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private server: ServerService,
  ) { }

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      address_line1: ['', [Validators.required], ],
      address_line2: [''],
      address_city: ['', [Validators.required]],
      address_state: ['', [Validators.required]],
      address_zip: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      address_country: ['', [Validators.required]],
      phone: ['', [Validators.required]],
    }) ;
  }

  get f() { return this.addForm.controls; }
  public hasError = (controlName: string, errorName: string) => {
    return this.addForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    this.submitted = true;
    if (this.addForm.invalid) {return; }
    console.log('.');
    this.http.post(this.server.organizationsBaseAPI(), {
      name: this.f.name.value,
      address_line1: this.f.address_line1.value,
      address_line2: this.f.address_line2.value,
      address_city: this.f.address_city.value,
      address_state: this.f.address_state.value,
      address_zip: this.f.address_zip.value,
      address_country: this.f.address_country.value,
      phone: this.f.phone.value
    }).subscribe(data => {},
      error => {});
    return;
  }

}
