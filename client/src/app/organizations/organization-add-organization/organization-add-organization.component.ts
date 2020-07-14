import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';


import { AuthService } from '../../users/auth.service';
import { OrganizationService } from '../../organizations/organization.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-organization-add-organization',
  templateUrl: './organization-add-organization.component.html',
  styleUrls: ['./organization-add-organization.component.css']
})
export class OrganizationAddOrganizationComponent implements OnInit {

  organizationForm: FormGroup;
  submitted: boolean = false;
  organizationList: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private organizationService: OrganizationService,
    private router: Router,
    private confirmDialog: MatDialog
  ) {
    this.organizationForm = this.formBuilder.group({
      name: '',
      address_line1: '',
      address_line2: '',
      address_city: '',
      address_state: '',
      address_zip: '',
      address_country: '',
      phone: ''
    });
    this.authService.toggleSidenav(true);
   }

  ngOnInit(): void {
    if (this.authService.is_staff) this.getOrganizationsList();
  }

  get f() {
    return this.organizationForm.controls;
  }
  getOrganizationsList(): void {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        this.organizationList = data;
      }
    );
  }

  addOrganization(): void {
    this.organizationService.addOrganization(this.organizationForm.value).subscribe(
      res => {
        this.getOrganizationsList();
        // this.athleteService.getAthletes();
        // this.newOrgOpen = false;
        // this.selectedOrganization = null;
        this.organizationForm.reset();
        this.router.navigate(['/organizations']);
        // "/organizations"
      }
    );
  }



}
