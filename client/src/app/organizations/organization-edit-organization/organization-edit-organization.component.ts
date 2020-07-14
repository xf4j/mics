import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrganizationService } from '../../organizations/organization.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { PatientService } from '../../patients/patient.service';

@Component({
  selector: 'app-organization-edit-organization',
  templateUrl: './organization-edit-organization.component.html',
  styleUrls: ['./organization-edit-organization.component.css']
})
export class OrganizationEditOrganizationComponent implements OnInit {
  organizationForm: FormGroup;
  organization: any;
  selectedOrganization: any;
  editMode: boolean = false;
  
  constructor(
    private organizationService: OrganizationService,
    private formBuilder: FormBuilder,
    private confirmDialog: MatDialog,
    private router: Router,
    private patientService: PatientService
    
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
   }

  ngOnInit(): void {
    this.organizationService.getSelectedOrganization().subscribe(
      organization => {
        if (!!organization) {
          // if (this.athleteForm.dirty) {
          //   const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
          //     data: {
          //       message: "Do you want to discard your changes?",
          //       options: ["Discard", "Cancel"]
          //     }
          //   });

          //   dialogRef.afterClosed().subscribe(result => {
          //     if (result == "Discard") {
          //       this.selectedAthlete = athlete;
          //       this.cancelChanges();
          //     }
          //   });
          // }
          // else {
            
            this.organizationForm.patchValue({
              name: organization['name'],
              address_line1: organization['address_line1'],
              address_line2: organization['address_line2'],
              address_city: organization['address_city'],
              address_state: organization['address_state'],
              address_zip: organization['address_zip'],
              address_country: organization['address_country'],
              phone: organization['phone']
            });
            this.selectedOrganization = organization;
          // }
        }
      }
    );
  }

  enableEditMode(): void {
    this.editMode = true;
    this.organizationForm.enable();
  }

  cancelChanges(): void {
    this.editMode = false;
    this.organizationForm.disable();
    this.organizationForm.patchValue({
      name: this.selectedOrganization['name'],
      address_line1: this.selectedOrganization['address_line1'],
      address_line2: this.selectedOrganization['address_line2'],
      address_city: this.selectedOrganization['address_city'],
      address_state: this.selectedOrganization['address_state'],
      address_zip: this.selectedOrganization['address_zip'],
      address_country: this.selectedOrganization['address_country'],
      phone: this.selectedOrganization['phone']
    });
  }

  deleteOrganization() : void {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      width: '350px',
      maxWidth: '85vw',
      data: {
        message: "Are you sure you want to delete this athlete?",
        options: ["Delete", "Cancel"],
        detail: [this.selectedOrganization['name']]
      }
    });

    dialogRef.afterClosed().subscribe(
      res => {
        if (res == "Delete") {
          this.organizationService.deleteOrganization(this.selectedOrganization['id']).subscribe(
            () => {
              this.organizationService.getOrganizations();
              this.organizationService.setSelectedOrganization(null);
            }
          );
        }
        this.router.navigate(['/organizations']);
      }
    );
  }


  refreshOrg(): void {
    this.organizationService.getOrganizations();
    this.organizationService.getOrganization(this.selectedOrganization['id']);
    this.router.navigate(['/organizations'])
  }

  saveEdits():void{
    this.organizationService.updateOrganization(this.organizationForm.value, this.selectedOrganization['id']).subscribe(
      () => {
        this.refreshOrg();
        this.editMode = false;
        this.organizationForm.disable();
      }
    );
  }


}



