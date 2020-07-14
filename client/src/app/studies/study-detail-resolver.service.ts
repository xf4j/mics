import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { StudyService, IStudyDetail } from './study.service';

@Injectable({
  providedIn: 'root'
})

export class StudyDetailResolverService implements Resolve<IStudyDetail> {

  constructor(private ss: StudyService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IStudyDetail> | Observable<never> {
    let uid = route.paramMap.get('uid');
    return this.ss.getStudy(uid).pipe(
      take(1), // why this take 1 seems to be always necessary?
      catchError(err => {
        this.router.navigate(['/dashboard']);
        return EMPTY;
      })
    );
  }
}