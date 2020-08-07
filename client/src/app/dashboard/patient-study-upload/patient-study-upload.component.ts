import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';

import { SeriesService } from '../series.service';
import { PatientStudyComponent} from '../patient-study/patient-study.component';
import { PatientStudyTableComponent } from '../patient-study-table/patient-study-table.component';
import  {AlertService } from '../../alert/alert.service';
import { UploadService } from '../../studies/upload.service';

@Component({
  selector: 'app-patient-study-upload',
  templateUrl: './patient-study-upload.component.html',
  styleUrls: ['./patient-study-upload.component.css']
})
export class PatientStudyUploadComponent implements OnInit {

  numberOfFilesToBeUploaded: number = 0;
  numberOfDirsToBeUploaded: number = 0;
  isParsing: boolean = false;
  isUploading: boolean = false;
  uploadProgress: number = 0;
  selectedFiles: File[];
  draggingFile: boolean = false;

  @Input() selectedPatient: any;

  @ViewChild(PatientStudyTableComponent)
  private studyTableComponent: PatientStudyTableComponent;
  constructor(
    private changeDetectorRef: ChangeDetectorRef, 
    public uploadService: UploadService,
    private seriesService: SeriesService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }

  upload() {
    this.isUploading = true;
    this.uploadService.uploadFiles(this.selectedFiles, this.selectedPatient.id).subscribe(
      data => {
        this.isUploading = false;
        this.selectedFiles = null;
        this.studyTableComponent.loadStudies(this.selectedPatient);
        this.seriesService.setStudiesUpdateStatus(1);
        // this.patientStudyComponent.loadStudies(this.selectedPatient);
      },
      err => {
        this.isUploading = false;
        this.selectedFiles = null;
        this.seriesService.setStudiesUpdateStatus(1);
      }
    );
  }

  onDrop($event) {
    this.selectedFiles = [];
    const items = $event.dataTransfer.items;
    this.isParsing = true;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry.isFile) {
          this.parseFileEntry(entry);
        } else if (entry.isDirectory) {
          this.parseDirectoryEntry(entry);
        }
        this.draggingFile = false;
      }
    }
  }

  private parseFileEntry(fileEntry) {
    this.numberOfFilesToBeUploaded += 1;
    return new Promise((resolve, reject) => {
      fileEntry.file(
        file => {
          this.selectedFiles.push(file);
          this.numberOfFilesToBeUploaded -= 1;
          if (this.numberOfFilesToBeUploaded === 0 && this.numberOfDirsToBeUploaded === 0) {
            this.isParsing = false;
            this.changeDetectorRef.detectChanges();
          }
          resolve(file);
        },
        err => {
          this.alertService.error('Error in parsing files.');
          if (this.numberOfFilesToBeUploaded === 0 && this.numberOfDirsToBeUploaded === 0) {
            this.isParsing = false;
            this.changeDetectorRef.detectChanges();
          }
          reject(err);
        }
      );
    });
  }

  private parseDirectoryEntry(directoryEntry) {
    this.numberOfDirsToBeUploaded += 1;
    const directoryReader = directoryEntry.createReader();
    return new Promise((resolve, reject) => {
      directoryReader.readEntries(
        entries => {
          for (let entry of entries) {
            if (entry.isFile) {
              this.parseFileEntry(entry);
            } else if (entry.isDirectory) {
              this.parseDirectoryEntry(entry);
            }
          }
          this.numberOfDirsToBeUploaded -= 1;
          resolve();
        },
        err => {
          this.alertService.error('Error in parsing directories.');
          reject(err);
        }
      );
    });
  }

}
