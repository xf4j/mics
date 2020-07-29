import { Component, OnInit, OnChanges, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';

// import { AthleteService } from '../athlete.service';
// import { StudyService } from '../../studies/study.service';
// import { ReportService } from '../../studies/report.service';
import { UtilService } from '../../_services/util.service';
import { AuthService } from '../../users/auth.service';
// import { UploadService } from '../../studies/upload.service';
// import { DownloadService } from '../../studies/download.service';
import { AlertService } from '../../alert/alert.service';

import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard-table',
  templateUrl: './dashboard-table.component.html',
  styleUrls: ['./dashboard-table.component.css']
})
export class DashboardTableComponent implements OnInit, OnChanges {

  displayedColumns: string[] = ['study_id', 'study_date', 'created', 'report'];
  dataSource: MatTableDataSource<any>;
  studySelection = new SelectionModel<any>(true, []);

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input() selectedAthlete: any;
  @Output() toggleUploadBox = new EventEmitter();
  @Output() studyChange = new EventEmitter();

  constructor(
    // private athleteService: AthleteService,
    // private studyService: StudyService,
    // private reportService: ReportService,
    private confirmDialog: MatDialog,
    private authService: AuthService,
    // private uploadService: UploadService,
    // private downloadService: DownloadService,
    private alertService: AlertService,
    public utilService: UtilService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.checkAdminStatus()) this.displayedColumns.unshift('select');
  }

  ngOnChanges(): void {
    this.setDataSource(this.selectedAthlete);
  }

  uploadReport(file: File, studyId): void {
    // this.uploadService.uploadReport(file, studyId).subscribe(
    //   res => {
    //     this.alertService.success("Uploaded " + file.name + ".");
    //     this.studyChange.emit();
    //   },
    //   err => {
    //     this.alertService.checkAndDisplayError(err);
    //   }
    // );
  }

  uploadMseg(file: File, studyId): void {
    // this.uploadService.uploadMseg(file, studyId).subscribe(
    //   res => {
    //     this.alertService.success("Uploaded MSEG file " + file.name + ".");
    //     this.studyChange.emit();
    //   },
    //   err => {
    //     this.alertService.checkAndDisplayError(err);
    //   }
    // );
  }

  exportStudies(): void {
    // this.downloadService.downloadStudies(this.studySelection.selected, this.selectedAthlete.id);
  }

  deleteStudies(): void {
    let studies = this.studySelection.selected;
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      width: '350px',
      maxWidth: '85vw',
      data: {
        message: "Are you sure you want to delete these studies?",
        options: ["Delete", "Cancel"],
        detail: studies.map(study => 'Study ID: ' + study.study_id)
      }
    });

    dialogRef.afterClosed().subscribe(
      // res => {
      //   if (res == "Delete") {
      //     for (let study of studies) {
      //       this.studyService.deleteStudy(study).subscribe(
      //         () => this.athleteService.getAthlete(this.selectedAthlete.id).subscribe(
      //           athleteDetail => this.studyChange.emit()
      //         )
      //       );
      //     }
      //   }
      // }
    );
  }

  navigateTo(row): void {
    // // if (row['report'] != null) window.open(row.report, '_blank');
    // if (row['report_name'] != null) {
    //   // let pwa = window.open("about:blank", "newwin");
    //   this.reportService.getReport(row.id).subscribe(
    //     res => {
    //       let a = window.open(res, "_blank");
    //       a.focus();
    //     }
    //   );
    // }
  }

  goToAdvancedReport(row): void {
    if (row['advanced_report']) this.router.navigate(['studies/' + row.id + '/report']);
  }


  checkAdminStatus(): boolean {
    return this.authService.is_admin;
  }

  checkStaffStatus(): boolean {
    return this.authService.is_staff;
  }

  getIsDownloading(): boolean {
    // return this.downloadService.isDownloading;
    return true;//remve this
  }

  private setDataSource(athlete): void {
    this.studySelection.clear();
    if (athlete.hasOwnProperty('studies')) {
      this.dataSource = new MatTableDataSource(athlete.studies);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
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
}