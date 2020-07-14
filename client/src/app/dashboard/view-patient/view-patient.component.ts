import { Component, OnInit , ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../patient.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../users/auth.service';
import { OrganizationService } from '../../organizations/organization.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { PatientStudyTableComponent } from '../patient-study-table/patient-study-table.component';
import { PatientStudyComponent } from '../patient-study/patient-study.component';
import { ViewerService } from '../../viewer/viewer.service';
import { SeriesTabsComponent } from '../series-tabs/series-tabs.component';
@Component({
  selector: 'app-view-patient',
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.css']
})


export class ViewPatientComponent implements OnInit {

  patientForm: FormGroup;
  patient: any;
  selectedPatient: any;
  showUploadBox: boolean = true; // temporary making it true for timebeing
  editMode: boolean = false;
  organizationList: any[] = [];
  disablesidenav : boolean =false;

  @ViewChild(PatientStudyComponent)
  private patientStudyComponent: PatientStudyComponent;

  
  @ViewChild(SeriesTabsComponent)
  private seriesTabsComponet : SeriesTabsComponent;
  //
  constructor(
    private patientService: PatientService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private organizationService: OrganizationService,
    private confirmDialog: MatDialog,
    private router: Router,
    private viewerService: ViewerService
  ) {
    this.patientForm = this.formBuilder.group({
      id: '',
      name: '',
      age: '',
      dob: '',
      sex: '',
      });
      this.authService.toggleSidenav(false);
      this.authService.disableSidenav(true);
   }

  ngOnInit(): void {
    // this.disablesidenav=true;
    // this.authService.toggleSidenav(true);
    this.patientService.getSelectedPatient().subscribe(
      patient => {
        if (!!patient) {
          
            this.patientForm.patchValue({
              id : patient['id'],
              name: patient['name'],
              age: patient['age'],
              sex: patient['sex'],
              dob: patient['dob']
            });
            this.selectedPatient = patient;
          // }
        }
      }
    );
  }

  enableEditMode(): void {
    this.editMode = true;
    this.patientForm.enable();  
    if (this.getStaffStatus() && !this.organizationList.length) {
      this.organizationService.getOrganizationsList().subscribe(
        (data: any[]) => {
          this.organizationList = data;
        }
      );
    } else if (!this.getStaffStatus()) {
      this.organizationList = [{
        id: this.authService.organizationId,
        name: this.authService.organization
      }];
    }
  }

  refreshPatient(): void {
    this.patientService.getPatients(this.selectedPatient.id);
    
  }

  saveEdits(): void {
    this.patientService.updatePatient(this.selectedPatient.id, this.patientForm.value).subscribe(
      () => {
        this.refreshPatient();
        this.editMode = false;
        this.patientForm.disable();
      }
    );
  }

  cancelChanges(): void {
    this.editMode = false;
    this.patientForm.disable();
    this.patientForm.patchValue({
      id : this.selectedPatient['id'],
      name: this.selectedPatient['name'],
      age: this.selectedPatient['age'],
      sex: this.selectedPatient['sex'],
      dob: this.selectedPatient['dob']
    });
  }

  deletePatient(): void {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      width: '350px',
      maxWidth: '85vw',
      data: {
        message: "Are you sure you want to delete this patient?",
        options: ["Delete", "Cancel"],
        detail: [this.selectedPatient['name']]
      }
    });

    dialogRef.afterClosed().subscribe(
      res => {
        if (res == "Delete") {
          this.patientService.deletePatient(this.selectedPatient).subscribe(
            () => {
              this.patientService.getPatients();
              this.patientService.setSelectedPatient(null);
              
              }
          );
        }
        this.router.navigate(['/dashboard']);
      }
    );
  }

  toggleShowUploadBox(): void {
    this.showUploadBox = !this.showUploadBox; // toggle the upload box
  }

  getAdminStatus(): boolean {
    return this.authService.is_admin;
  }

  getStaffStatus(): boolean {
    return this.authService.is_staff;
  }

  tabs = ['Upload'];
  selected = new FormControl(0);

  addTab() {
    this.tabs.push('New');

    // if (selectAfterAdding) {
      this.selected.setValue(this.tabs.length - 1);
    // }
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }

  setAction(action){
    this.viewerService.setSelectedPlayerAction(action);
  }
 
}
