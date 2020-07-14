import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { PatientService } from '../patient.service';
import { AuthService } from '../../users/auth.service';
import { OrganizationService } from '../../organizations/organization.service';

import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-patient-add-patient',
  templateUrl: './patient-add-patient.component.html',
  styleUrls: ['./patient-add-patient.component.css']
})
export class PatientAddPatientComponent implements OnInit {

  patientForm: FormGroup;
  submitted: boolean = false;
  organizationList: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private authService: AuthService,
    private organizationService: OrganizationService,
    private router: Router,
    private confirmDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.patientForm = this.formBuilder.group({
      name: ['', Validators.required],
      age: [''],
      sex: [''],
      dob:[''],
      
      organization_id: ['', Validators.required]
  });
}

}
