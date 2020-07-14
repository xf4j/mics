import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import * as cornerstone from 'cornerstone-core'; // version 2.1.4 works; version 2.1.0, 2.2.3 and 3.0.0 do not work
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
// * [cornerstoneWADOImageLoader.js]()

import { ServerService } from '../_services/server.service';
import { AuthService } from '../users/auth.service';
import { AlertService } from '../alert/alert.service';
import { UtilService } from '../_services/util.service';

export interface IViewerSeriesDetail {
  patientName: string;
  patientID: string;
  patientBirthDate: Date;
  studyDate: Date;
  studyInstanceUID: string;
  seriesInstanceUID: string;
  seriesDescription: string;
  seriesDateTime: Date;
  modality: string;
  instanceUIDs: string[];
  
}
// this stores the data for dicom viewer to function correctly
export interface IDicomViewerDisplayData {
  
  allImages: any[]; // stores all image load objects
  numberOfImages: number;
  
}
@Injectable({
  providedIn: 'root'
})

export class ViewerService {

  allLoadSuccess: boolean;
  private selectedPlayerAction= new BehaviorSubject<any>(null);
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private alertService: AlertService,
    private serverService: ServerService,
    private utilService: UtilService
  ) { }

  checkSeriesInstanceUidValid(seriesInstanceUID: string): Observable<any> {
    let self = this;
    return new Observable<any>(observer => {
      self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
        httpOptions => {
          self.http.get(self.serverService.viewerBaseAPI() + seriesInstanceUID + '/valid/', httpOptions).subscribe(
            data => observer.next(data),
            (err: HttpErrorResponse) => {
              self.alertService.displayErrors(err['error']),
              observer.error(err);
            }
          );
        }
      );
    });
  }

  getViewerSeriesDetail(seriesInstanceUID: string): Observable<IViewerSeriesDetail> {
    let self = this;
    return new Observable(observer => {
      self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
        httpOptions => {
          let api = self.serverService.viewerBaseAPI() + seriesInstanceUID + '/';
          self.http.get(api, httpOptions).subscribe(
            data => {
                observer.next(self.parseViewerSeriesDetail(data));
            },
            err => {
              self.alertService.displayErrors(err['error']);
              observer.error(err['error']);
            }
          );
        }
      );
    });
  }

  loadDisplayData(uids: string[]): Observable<IDicomViewerDisplayData> {
    let self = this;
    return new Observable(observer => {
      self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
        httpOptions => {
          // configure the Cornerstone WADO Image Loader (https://github.com/cornerstonejs/cornerstoneWADOImageLoader/blob/master/docs/Configuration.md)
          let jwt = httpOptions['headers'].get('Authorization'); // httpHeaders should be assumed immutable with lazy parsing, therefore, should use get function to get the values
          cornerstoneWADOImageLoader.configure({
            // beforeSend - A callback that is executed before a network request. passes the XMLHttpRequest object
            beforeSend: function(xhr) {
              xhr.setRequestHeader('Authorization', jwt);
            }
          });

          // get images from server
          let numberOfImages = uids.length;
          let allImages = [];
          let loadCount: number = 0;
          self.allLoadSuccess = true;
          //let uri = 'http://weborthanc:weborthancPassword@localhost:8042/wado?objectUID=' + instanceUID + '&requestType=WADO'
          //let imageID = 'wadouri:' + uri;
          // for (let uid of uids) {
          for (let i = 0; i < uids.length; i++) {
            console.log("UIDS = ", uids[i]);
            let imageId = 'wadouri:' + self.serverService.viewerBaseAPI() + 'instances/' + uids[i] + '/';
            console.log("imageId = ", imageId);
            cornerstone.loadAndCacheImage(imageId).then(
              image => {
                allImages.push(image);
                loadCount++;
                // check if this is the last one, otherwise do nothing
                if (loadCount === numberOfImages && self.allLoadSuccess === true) {
                  // sort the images
                  allImages.sort(function(a, b) {
                    let aPosition = parseFloat(a.data.string('x00200032').split('\\')[2])
                    let bPosition = parseFloat(b.data.string('x00200032').split('\\')[2])
                    return bPosition - aPosition;
                  });
                  
                  let displayData = {
                    allImages: allImages,
                    numberOfImages: numberOfImages
                    
                  }
                  console.log("DD", displayData);
                  observer.next(displayData);
                } else if (loadCount === numberOfImages) {
                  self.alertService.error('Load image failed, please retry.');
                  observer.error('Load image failed.');
                }
              }, 
              err => {
                console.log(err);
                   loadCount++;
                self.allLoadSuccess = false;
                if (loadCount === numberOfImages) {
                  self.alertService.error('Load image failed, please retry.');
                  observer.error(err);
                }
              }
            );
          }
        }
      );
    });
  }


  private parseViewerSeriesDetail(data): IViewerSeriesDetail {
    let viewerSeriesDetail = {
      patientName: data.series.PatientName,
      patientID: data.series.PatientID,
      patientBirthDate: this.utilService.stringToDate(data.series.PatientBirthDate),
      studyDate: this.utilService.stringToDate(data.series.StudyDate),
      studyInstanceUID: data.series.StudyInstanceUID,
      seriesInstanceUID: data.series.SeriesInstanceUID,
      seriesDescription: data.series.SeriesDescription,
      seriesDateTime: this.utilService.stringToDate(data.series.SeriesDate, data.series.SeriesTime),
      modality: data.series.Modality,
      instanceUIDs: data.series.instance_uids.split(';'),
      
    };
    return viewerSeriesDetail;
  }

  setSelectedPlayerAction(action): void {
    this.selectedPlayerAction.next(action);
}

  getSelectedPlayerAction(): Observable<any> {
    return this.selectedPlayerAction.asObservable();
  }

}
