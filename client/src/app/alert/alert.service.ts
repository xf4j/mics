import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next();
        }
      }
    });
  }

  success(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'success', text: message });
  }

  error(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'error', text: message });
  }

  caution(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'caution', text: message });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  checkAndDisplayError(data): boolean {
    if (data.hasOwnProperty('error')) {
      console.error(data);
      if (typeof(data.error) == 'string') {
        this.error("Error connecting to server.");
        return false;
      }
      for (let error in data.error) {
        if (error != 'non_field_errors') {
          this.error(error + ': ' + data.error[error]);
        } else {
          this.error(data.error[error]);
        }
      }
      return false;
    } else if (data.hasOwnProperty('message')) {
      this.error(data['message']);
      return false;
    }
    return true;
  }

  displayErrors(errors) {
    if (errors.hasOwnProperty('non_field_errors')) {
      for (let error of errors.non_field_errors) {
        this.error(error);
      }
    } else {
      this.error('Internal server error');
    }
  }
}
