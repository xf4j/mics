import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { MatDialog } from '@angular/material';
import { map } from 'rxjs/operators';

import { ISeries, IStudyDetail, StudyService } from '../../studies/study.service';
@Component({
  selector: 'app-patient-study-detail',
  templateUrl: './patient-study-detail.component.html',
  styleUrls: ['./patient-study-detail.component.css']
})
export class PatientStudyDetailComponent implements OnInit {

  studyDetail: IStudyDetail;
  imagingSeries: ISeries[];
  seriesX: ISeries;
  constructor(
    private route: ActivatedRoute,
    private studyService: StudyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.data.pipe(map((data: { studyDetail: IStudyDetail }) => data.studyDetail)).subscribe(
      (studyDetail) => {
        this.setStudyDetail(studyDetail);
        
      }
    );
  }


  openViewer(series: ISeries) {
    
    let url = '/viewer/' + series.seriesInstanceUID;
    window.open(url, '_blank');
  }

  private setStudyDetail(studyDetail) {
    this.studyDetail = studyDetail;
    this.imagingSeries = this.studyDetail.imagingSeries;
    
  }                 

}
