import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  stringToDate(dateString, timeString = ""): Date {
    let date: Date;
    let year = parseInt(dateString.slice(0, 4));
    let month = parseInt(dateString.slice(4, 6));
    let day = parseInt(dateString.slice(6, 8));
    if (timeString.length > 0) {
      let hh = parseInt(timeString.slice(0, 2));
      let mm = parseInt(timeString.slice(2, 4));
      let ss = parseInt(timeString.slice(4, 6));
      date = new Date(year, month - 1, day, hh, mm, ss); // month is 0-11
    } else {
      date = new Date(year, month - 1, day);
    }
    if (!isNaN(date.getTime())) {
      return date;
    } else {
      return null;
    }
  }
}
