import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../users/auth.service';
import { OrganizationService } from '../../organizations/organization.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { PatientService } from '../patient.service';
import { SeriesService } from '../series.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {

  patientForm: FormGroup;
  submitted : boolean = false;
  organizationList: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private organizationService: OrganizationService,
    private router: Router,
    private confirmDialog: MatDialog,
    private patientService:PatientService,
    private seriesService: SeriesService
  ) { 

    this.patientForm = this.formBuilder.group({
      name: '',
      age: '',
      sex: '',
      dob: '',
      organization_id: ['', Validators.required]
    });
    this.authService.toggleSidenav(true);
  }

  ngOnInit(): void {
    
    if (this.authService.is_staff) {
      this.organizationService.getOrganizationsList().subscribe(
        data => {
          this.organizationList = data;
          this.f.organization_id.setValue(this.organizationList[0]);
        }
      );
    }
    else if (this.authService.is_admin){
      this.f.organization_id.setValue(this.authService.organizationId);
      this.organizationList = [{
        id: this.authService.organizationId,
        name: this.authService.organization
      }];
    }
  }

  get f() {
    return this.patientForm.controls;
  }

  submit(): void {
    this.submitted = true;
    if (this.patientForm.invalid) return;
    this.patientService.addPatient(this.patientForm.value).subscribe(
      res => {
        this.patientService.getPatients(res['id']);
        this.patientForm.reset();
        this.router.navigate(['/dashboard']);
      }
    );
  }

}
