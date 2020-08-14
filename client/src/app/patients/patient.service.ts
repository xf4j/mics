import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../users/auth.service';
import { ServerService } from '../_services/server.service';
import { AlertService } from '../alert/alert.service';


export interface Patient {
  id: number | string;
  name: string;
  age: number;
  dob: string;
  sex: string;
  organization: number | string;
  studies: {
   study_instance_uid: string;
   study_id : string;
   study_date : string;
   created : string;
   
  };
  
};
@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private serverService: ServerService,
    private alertService: AlertService
  ) { }

  getPatients(): Observable<any> {
    let self = this;
    return new Observable(observer => {
      self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
        httpOptions => self.http.get(self.serverService.patientsBaseAPI(), httpOptions).subscribe(
          data => {
            if (self.alertService.checkAndDisplayError(data)) {
              observer.next(data);
            } else {
              observer.error();
            }
          },
          err => {
            self.alertService.checkAndDisplayError(err);
            observer.error(err);
          }
        )
      );
    });
  }

  
}
