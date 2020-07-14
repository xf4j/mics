import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

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
   report_created : string;
   report_name : string;
   advanced_report :string;
  };
  
};
@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private selectedPatient= new BehaviorSubject<any>(null);
  private selectedOrganization= new BehaviorSubject<any>(null);
  patientsList: any = {};
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private serverService: ServerService,
    private alertService: AlertService
  ) { }

  // getPatients(): Observable<any> {
  //   let self = this;
  //   return new Observable(observer => {
  //     self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
  //       httpOptions => self.http.get(self.serverService.patientsBaseAPI(), httpOptions).subscribe(
  //         data => {
  //           if (self.alertService.checkAndDisplayError(data)) {
  //             observer.next(data);
  //           } else {
  //             observer.error();
  //           }
  //         },
  //         err => {
  //           self.alertService.checkAndDisplayError(err);
  //           observer.error(err);
  //         }
  //       )
  //     );
  //   });
  // }

  getPatients(selectedOrganization?: string): Observable<any> {
    return new Observable(observer => {
    this.authService.refreshAndGetHttpOptionsWithToken().subscribe(
      httpOptions => this.http.get(this.serverService.patientsBaseAPI(), httpOptions).subscribe(
        (data: any[]) => {
          if (this.alertService.checkAndDisplayError(data)) {
            if (!!selectedOrganization) {
              let selectedOrgPatients: Patient[]=[]
              for (let patient of data) {
                if(patient.organization == selectedOrganization['name'])
                { 
                selectedOrgPatients.push(patient);}
              }
              observer.next(selectedOrgPatients);
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
  // getPatients(selectedOrganization?: string): void {
  //   console.log("Test 100 getPatients");
  //   this.authService.refreshAndGetHttpOptionsWithToken().subscribe(
  //     httpOptions => this.http.get(this.serverService.patientsBaseAPI(), httpOptions).subscribe(
  //       (data: any[]) => {
  //         console.log("Test 101 data=",data);
  //         if (this.alertService.checkAndDisplayError(data)) {
  //           console.log("Test 102 selectedOrganization=",selectedOrganization);
  //           if (!!selectedOrganization) {
  //             console.log("Test 103 inside if of selected org");
  //             let selectedOrgPatients: Patient[]=[]
  //             for (let patient of data) {
  //               if(patient.organization == selectedOrganization['name'])
  //               { 
  //               selectedOrgPatients.push(patient);}
  //             }
  //             this.patientsList=selectedOrgPatients;
  //           }
  //           else
  //           {
  //             console.log("Test 104 inside else of selected org");
  //             this.patientsList=data;
  //           }
  //           console.log("Test 105 patientList : ", this.patientsList);
  //         }
  //         else {
  //           this.alertService.error("Could not connect to server.");
  //         }

  //       },
  //       err => {
  //         this.alertService.checkAndDisplayError(err);
  //       }
  //     )
  //   );
  // }

  updatePatient(patientId, patientForm): Observable<any>{
    let self = this;
    return new Observable(observer =>{
      self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
      httpOptions => self.http.patch(self.serverService.patientsBaseAPI() + patientId + '/', patientForm, httpOptions).subscribe(
        data=>{
          self.alertService.success("Updated patient " + data['name'] + ".");
          observer.next(data);
        },
        err => {
          self.alertService.checkAndDisplayError(err);
          observer.error(err);
        }
      ) 
      );
    }
    );

  }

  addPatient(patientForm): Observable<any> {
    let self = this;
    return new Observable(observer => {
      self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
        httpOptions => self.http.post(self.serverService.patientsBaseAPI(), patientForm, httpOptions).subscribe(
          data => {
            observer.next(data);
          },
          err => {
            self.alertService.checkAndDisplayError(err);
            observer.error(err);
          }
        )
      );
    });
  }

  deletePatient(patient: any): Observable<boolean> {
    let self = this;
    return new Observable(observer => {
      self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
        httpOptions => self.http.delete(self.serverService.patientsBaseAPI() + patient.id + '/', httpOptions).subscribe(
          data => {
            self.alertService.success(patient.name + ' deleted.');
            observer.next(true);
          },
          err => {
            self.alertService.checkAndDisplayError(err);
            observer.error(err);
          }
        )
      );
    });
  }

setSelectedPatient(patient): void {
    this.selectedPatient.next(patient);
}

getSelectedPatient(): Observable<any> {
return this.selectedPatient.asObservable();
}

}
