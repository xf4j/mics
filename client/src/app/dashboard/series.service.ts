import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { AuthService } from '../users/auth.service';
import { ServerService } from '../_services/server.service';
import { AlertService } from '../alert/alert.service';


@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  private selectedSeriesInstanceUID= new BehaviorSubject<any>(null);
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private serverService: ServerService,
    private alertService: AlertService
  ) { }


  setSelectedSeriesInstanceUID(uid): void {
    this.selectedSeriesInstanceUID.next(uid);
}

  getSelectedSeriesInstanceUID(): Observable<any> {
    return this.selectedSeriesInstanceUID.asObservable();
}
}
