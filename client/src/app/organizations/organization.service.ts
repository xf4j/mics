import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { AuthService } from '../users/auth.service';
import { ServerService } from '../_services/server.service';
import { AlertService } from '../alert/alert.service';

export interface Organization {
  id: number | string;
  name: string;
  address_line1: string;
  address_line2: string;
  address_city: string;
  address_state: string;
  address_zip: number;
  address_country: string;
  phone: number;
};

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  organizationList: any = {};
  private selectedOrganization= new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private serverService: ServerService,
    private alertService: AlertService
  ) { }

  getOrganizations(): void {
    this.authService.refreshAndGetHttpOptionsWithToken().subscribe(
      httpOptions => this.http.get(this.serverService.organizationsBaseAPI(), httpOptions).subscribe(
        (data: any[]) => {
          if (this.alertService.checkAndDisplayError(data)) {
            this.organizationList=data;
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
  }

  getOrganizationsList(): Observable<any> {
    console.trace();
    let self = this;
    return new Observable(observer => {
      self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
        httpOptions => self.http.get(self.serverService.organizationsBaseAPI(), httpOptions).subscribe(
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

  getOrganization(orgId: string): Observable<any> {
    let self = this;
    return new Observable(observer => {
      self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
        httpOptions => self.http.get(self.serverService.organizationsBaseAPI() + orgId + '/', httpOptions).subscribe(
          data => {
            if (self.alertService.checkAndDisplayError(data)) {
              observer.next(data);
            }
            else {
              self.alertService.error("Could not connect to server.");
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

  addOrganization(organizationForm): Observable<any> {
    let self = this;
    return new Observable(observer => {
      self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
        httpOptions => self.http.post(self.serverService.organizationsBaseAPI(), organizationForm, httpOptions).subscribe(
          data => {
            self.alertService.success("Successfully added organization " + data['name'] + ".");
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

  updateOrganization(organizationForm, selectedOrg: string | number): Observable<any> {
    let self = this;
    return new Observable(observer => {
      self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
        httpOptions => self.http.patch(self.serverService.organizationsBaseAPI() + selectedOrg + '/', organizationForm, httpOptions).subscribe(
          data => {
            self.alertService.success("Successfully updated.");
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

  deleteOrganization(orgId): Observable<boolean> {
    let self = this;
    return new Observable(observer => {
      self.authService.refreshAndGetHttpOptionsWithToken().subscribe(
        httpOptions => {
          self.http.delete(self.serverService.organizationsBaseAPI() + orgId + '/', httpOptions).subscribe(
            data => {
              self.alertService.success("Organization deleted.");
              observer.next(true);
            },
            err => {
              self.alertService.checkAndDisplayError(err);
              observer.error(err);
            }
          )
        }
      )
    })
  }

  setSelectedOrganization(organization): void {
        this.selectedOrganization.next(organization);
  }

  getSelectedOrganization(): Observable<any> {
    return this.selectedOrganization.asObservable();
  }

}
