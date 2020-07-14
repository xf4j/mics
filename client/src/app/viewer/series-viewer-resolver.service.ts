import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { catchError, take, retry } from 'rxjs/operators';

import { ViewerService } from './viewer.service';

@Injectable({
  providedIn: 'root'
})
export class SeriesViewerResolverService {

  constructor(
    private viewerService: ViewerService, 
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<never> {
    let seriesInstanceUid = route.paramMap.get('uid');
    console.log(" Logging uid=",seriesInstanceUid)
    console.log("Resolve of Series Viewer")
    return this.viewerService.checkSeriesInstanceUidValid(seriesInstanceUid).pipe(
      take(1),
      // catchError(err => {
      //   retry(3),
      //   // this.router.navigate(['/viewers']);
      //   // return EMPTY;
      // })
    );
  }
}
