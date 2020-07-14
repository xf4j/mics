import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientService, Patient } from '../patient.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../users/user.service';
import { AuthService } from '../../users/auth.service';

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css']
})
export class PatientTableComponent implements OnInit {

  displayedColumns: string[] = ['id','name', 'age','dob', 'sex', 'view', 'edit', 'delete'];
  dataSource = new MatTableDataSource<Patient>();
  patientList: Patient[]=[];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private patientService: PatientService,
    private confirmDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getPatients();
  }
  getPatients():void {
    this.patientService.getPatients().subscribe(
      (data: Patient[])=>{
        this.patientList=data;
        this.setDataSource(this.patientList);
      }
    );
  }

  private setDataSource(data): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}
