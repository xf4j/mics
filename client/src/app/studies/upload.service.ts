import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerService } from '../_services/server.service';
import { AuthService } from '../users/auth.service';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  uploadProgress: number;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private serverService: ServerService,
    private alertService: AlertService
  ) { }

  uploadFiles(files: File[], patientId: string): Observable<boolean> {
    // true: upload successful
    // false: invalid DICOM file
    // error: upload failed
    this.uploadProgress = 0;
    let numOfSuccess: number = 0;
    let numOfInvalidDicom: number = 0;
    let numOfFailure: number = 0
    let self = this;
    return new Observable(observer => {
      self.authService.refreshAndGetHttpOptionsWithToken(false).subscribe(
        httpOptions => {
          for (let file of files) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('patient', patientId);
            self.http.post(self.serverService.filesBaseAPI() + 'upload-dicom/', formData, httpOptions).subscribe(
              (data) => {
                numOfSuccess++;
                this.uploadProgress = (numOfSuccess + numOfInvalidDicom + numOfFailure) / files.length * 100;
                if ((numOfSuccess + numOfInvalidDicom + numOfFailure) == files.length) {  // all files have been posted
                  if (numOfInvalidDicom === 0 && numOfFailure === 0) {  // all the studies succeed in importing
                    this.alertService.success("Uploaded " + numOfSuccess + " valid DICOM files.");  
                    observer.next(true);
                  } else if (numOfFailure === 0) {
                    this.alertService.caution("Uploaded " + numOfSuccess + " valid DICOM files. " + numOfInvalidDicom + " files were not valid DICOM files.");  
                    observer.next(false);
                  } else {
                    this.alertService.error("Uploaded " + numOfSuccess + " valid DICOM files. " + numOfInvalidDicom + " files were not valid DICOM files. Failed to upload " + numOfFailure + " files.");
                    observer.error('Error uploading files');
                  }
                }
                
              },
              (err:HttpErrorResponse) => {
                if (!self.parseErrorResponse(err)) {
                  numOfInvalidDicom++;
                } else {
                  numOfFailure++;
                }
                this.uploadProgress = (numOfSuccess + numOfInvalidDicom + numOfFailure) / files.length * 100;
                if ((numOfSuccess + numOfInvalidDicom + numOfFailure) == files.length) {  // all files have been posted
                  if (numOfInvalidDicom === 0 && numOfFailure === 0) {  // all the studies succeed in importing
                    this.alertService.success("Uploaded " + numOfSuccess + " valid DICOM files.");  
                    observer.next(true);
                  } else if (numOfFailure === 0) {
                    this.alertService.caution("Uploaded " + numOfSuccess + " valid DICOM files. " + numOfInvalidDicom + " files were not valid DICOM files.");  
                    observer.next(false);
                  } else {
                    this.alertService.error("Uploaded " + numOfSuccess + " valid DICOM files. " + numOfInvalidDicom + " files were not valid DICOM files. Failed to upload " + numOfFailure + " files.");
                    observer.error('Error uploading files.');
                  }
                }
              }
              
            );
          }
        }

      );
      
    });
  }

  getUploadProgress(): number {
    return this.uploadProgress;
  }

  // Return false if error message includes "Invalid DICOM file", else true
  private parseErrorResponse(err: HttpErrorResponse): boolean {
    const error: Object = err['error']
    if (error.hasOwnProperty('non_field_errors')) {
      for (let errMsg of error['non_field_errors']) {
        if (errMsg.includes('Invalid DICOM file')) return false;
      }
      return true;
    } else return true;
  }

}
