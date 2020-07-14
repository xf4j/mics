import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../users/user.service';
import { AuthService } from '../../users/auth.service';
import { PatientService, Patient} from '../patient.service';
import { OrganizationService, Organization} from '../../organizations/organization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css']
})
export class PatientTableComponent implements OnInit {

  displayedColumns: string[] = ['id','name', 'age','dob', 'sex', 'view'];
  dataSource = new MatTableDataSource<Patient>();
  organization : Organization;
  selectedOrganization: any;
  patientList : Patient[]=[];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private organizationService : OrganizationService,
    private patientService: PatientService,
    private confirmDialog: MatDialog,
    private router: Router,
    
  ) { }

  ngOnInit(): void {
    this.organizationService.getSelectedOrganization().subscribe(
      organization => {
        // if (!!organization) {
         this.selectedOrganization=organization;
         this.patientService.getPatients(organization).subscribe(
           (data : Patient[])=>{
            this.patientList =data;
            this.setDataSource(this.patientList);
           }
          );
        });
  }
  

  private setDataSource(data): void {
    
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  setPatient(patient){
    this.patientService.setSelectedPatient(patient);
    this.router.navigate(['dashboard/view-patient']);
  }
  

}
