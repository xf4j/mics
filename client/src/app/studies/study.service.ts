import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ServerService } from '../_services/server.service';
import { AuthService } from '../users/auth.service';
import { AlertService } from '../alert/alert.service';
import { UtilService } from '../_services/util.service';

export interface IStudy {
  studyID: string;
  studyInstanceUID: string;
  patient : {
    patientId: number | string;
    patientName: number | string;
  }
  studyDate: Date; 
  created: string
}

export interface IStudyDetailTest {
  study: IStudy;
  imagingSeriesDict: {}

}

export interface IStudyDetail {
  study: IStudy;
  imagingSeries: ISeries[];

}

export interface ISeries {
  studyInstanceUID: string;
  seriesInstanceUID: string;
  seriesDescription: string;
  modality: string;
  isImaging: boolean;
  seriesDateTime: Date;
  associatedStructureSeries?: ISeries[];
  isGeneratedInHouse?: boolean;
  inHouseSoftwareVersion?: string;
  selectedIncrementalLearningStructureSeries?: ISeries;
}

@Injectable({
  providedIn: 'root'
})
export class StudyService {

  studyList : any=[];
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private alertService: AlertService,
    private serverService: ServerService,
    private utilService: UtilService
  ) {
  }
  inHouseIdentifier: string = 'Auto Segmentation by CarinaAI';

  

  getStudies(selectedPatient?: string):Observable<any> {
    return new Observable(observer => {
    this.authService.refreshAndGetHttpOptionsWithToken().subscribe(
      httpOptions => this.http.get(this.serverService.studiesBaseAPI(), httpOptions).subscribe(
        (data: any[]) => {
          if (this.alertService.checkAndDisplayError(data)) {
            if (!!selectedPatient) {
              let selectedPatientStudies: IStudy[]=[]
              for (let study of data) {
                if(study.patient == selectedPatient['id'])
                { 
                  selectedPatientStudies.push(study);}
              }
              observer.next(selectedPatientStudies);
            }
            else
            {
              observer.next(data);
            }
          }
          else {
            this.alertService.error("Could not connect to server.");
          }

        },
        err => {
          this.alertService.checkAndDisplayError(err);
        }
      )
    );
  });
  }

  getStudy(studyInstanceUID: string): Observable<IStudyDetail> {
    let self = this;
    return new Observable(observer => {
      self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
        httpOptions => {
          let api = self.serverService.studiesBaseAPI() + studyInstanceUID + '/';
          self.http.get(api, httpOptions).subscribe(
            data => {
              if (self.alertService.checkAndDisplayError(data)) {
                observer.next(self.parseSeriesList(data, studyInstanceUID));
              } else {
                // to make sure the resolver gets something
                observer.error();
              }
            },
            err => {
              self.alertService.displayErrors(err['error']);
              observer.error(err['error']);
            }
          );
        }
      )
    });
  }

  private parseSeriesList(seriesList, studyInstanceUID: string): IStudyDetail {
    let studyDetail: IStudyDetail = {
      study: {
        studyID: '',
        studyInstanceUID: '',
        patient: {
          patientId:'',
          patientName: ''
        },
        studyDate: new Date(1970, 0, 1),
        created:''
      },
      imagingSeries: []
    };
    // Get study info from the series info of the first series
    if (seriesList.length > 0) {
      studyDetail.study = {
        studyID: seriesList[0].info.StudyID,
        studyInstanceUID: seriesList[0].info.StudyInstanceUID,
        patient:{
          patientId:seriesList[0].info.PatientID,
          patientName: seriesList[0].info.PatientName
        },
        created:'',   
        studyDate: this.utilService.stringToDate(seriesList[0].info.StudyDate)
      };
    }

    // get imaging series
    for (let s of seriesList) {
      if (s.info.ReferencedSeriesInstanceUID == '') {
        let series = {
          studyInstanceUID: studyInstanceUID,
          seriesInstanceUID: s.info.SeriesInstanceUID,
          seriesDescription: s.info.SeriesDescription,
          modality: s.info.Modality,
          seriesDateTime: this.utilService.stringToDate(s.info.SeriesDate, s.info.SeriesTime),
          isImaging: true,
          associatedStructureSeries: []
        };
        studyDetail.imagingSeries.push(series);
      }
    }
    // get structure series
    for (let s of seriesList) {
      if (s.info.ReferencedSeriesInstanceUID != '') {
        for (let imgSeries of studyDetail.imagingSeries) {
          if (s.info.ReferencedSeriesInstanceUID == imgSeries.seriesInstanceUID) {
            let series = {
              studyInstanceUID: studyInstanceUID,
              seriesInstanceUID: s.info.SeriesInstanceUID,
              seriesDescription: s.info.SeriesDescription,
              modality: s.info.Modality,
              seriesDateTime: this.utilService.stringToDate(s.info.SeriesDate, s.info.SeriesTime),
              isImaging: false,
              isGeneratedInHouse: s.info.SeriesDescription.includes(this.inHouseIdentifier)
            };
            imgSeries.associatedStructureSeries.push(series);
          }
        }
      }
    }
    return studyDetail;
  }

   
}
