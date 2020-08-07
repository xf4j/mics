import { Component, OnInit, OnChanges, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';

import { PatientService, Patient } from '../patient.service';
import { StudyService, IStudy } from '../../studies/study.service';
import { UtilService } from '../../_services/util.service';
import { AuthService } from '../../users/auth.service';
import { UploadService } from '../../studies/upload.service';
import { SeriesService } from '../../dashboard/series.service';
import { AlertService } from '../../alert/alert.service';

import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-patient-study-table',
  templateUrl: './patient-study-table.component.html',
  styleUrls: ['./patient-study-table.component.css']
})
export class PatientStudyTableComponent implements OnInit {

  displayedColumns: string[] = ['select','study_id', 'study_date', 'created'];
  dataSource: MatTableDataSource<any>;
  studySelection = new SelectionModel<any>(true, []);
  patient : Patient;
  selectedPatient: any;
  studyList : IStudy[]=[];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // @Input() selectedPatient: any;
  // @Output() toggleUploadBox = new EventEmitter();
  // @Output() studyChange = new EventEmitter();

  constructor(
    private patientService: PatientService,
    private studyService: StudyService,
    // private reportService: ReportService,
    private deleteDialog: MatDialog,
    private authService: AuthService,
    private uploadService: UploadService,
    private seriesService: SeriesService,
    private alertService: AlertService,
    public utilService: UtilService,
    private router: Router
  ) { }


  ngOnInit(): void {
    // if (this.checkAdminStatus()) this.displayedColumns.unshift('select');
    this.patientService.getSelectedPatient().subscribe(
      patient=>{
        this.selectedPatient=patient;
        this.loadStudies(this.selectedPatient);
      });
    

  }

  

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.studySelection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.studySelection.clear() :
      this.dataSource.data.forEach(row => this.studySelection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.studySelection.isSelected(row) ? 'deselect' : 'select'} study ${row.studyID}`;
  }


  checkAdminStatus(): boolean {
    return this.authService.is_admin;
  }

  checkStaffStatus(): boolean {
    return this.authService.is_staff;
  }
  
  loadStudies(patient) {
    this.selectedPatient=patient;
        this.studyService.getStudies(this.selectedPatient).subscribe(
          (data: IStudy[])=>{
            this.studyList=data;
            this.setDataSource(this.studyList);
          }          
        );
  }

  private setDataSource(data): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  deleteStudies(studies: IStudy[]) {
    const dialogRef = this.deleteDialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        message: "Are you sure you want to delete these studies?",
        options: ["Delete", "Cancel"],
        detail: studies.map(study => 'Study ID: ' + study['image_study_id'])
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "Delete") {
        for (let study of studies) {
          this.studyService.deleteStudy(study,this.selectedPatient.id).subscribe(
            () => {
              this.studySelection.clear();
              this.loadStudies(this.selectedPatient);
              this.seriesService.setStudiesUpdateStatus(2);
                          
            }
          );
        }
      }
    });
  }


}
