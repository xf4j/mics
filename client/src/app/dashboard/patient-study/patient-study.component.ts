import { Component, OnInit, OnChanges, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';

import { PatientService, Patient } from '../patient.service';
import { IStudy, ISeries, IStudyDetail, StudyService, IStudyDetailTest } from '../../studies/study.service';
import { UtilService } from '../../_services/util.service';
import { AuthService } from '../../users/auth.service';
import { UploadService } from '../../studies/upload.service';
import { AlertService } from '../../alert/alert.service';
import { ViewPatientComponent } from '../view-patient/view-patient.component';
import { SeriesService } from '../series.service';

@Component({
  selector: 'app-patient-study',
  templateUrl: './patient-study.component.html',
  styleUrls: ['./patient-study.component.css']
})


export class PatientStudyComponent implements OnInit {

  // @ViewChild(ViewPatientComponent) viewPatientComponent;

  selectedPatient: any;
  studyDetails: IStudyDetailTest[]=[];
  studyList : IStudy[]=[];
  studyDetail: IStudyDetail;
  imagingSeries: ISeries[];
  constructor(
    private patientService: PatientService,
    private studyService: StudyService,
    private authService: AuthService,
    private seriesService: SeriesService
  ) { }

  ngOnInit(): void {

    this.patientService.getSelectedPatient().subscribe(
      patient=>{
        this.selectedPatient=patient;
        this.loadStudies(this.selectedPatient);
        
      });
      

  }

  loadStudies(patient) {
    this.selectedPatient=patient;
        this.studyService.getStudies(this.selectedPatient).subscribe(
          (data: IStudy[])=>{
            this.studyList=data;
            for (let study of this.studyList){
              let dict={};
              dict['Short axis cine']=[]
              dict['Others']=[]
              // console.log("image_study_instance_uid= ",study['image_study_instance_uid'])
              this.studyService.getStudy(study['image_study_instance_uid']).subscribe(
                (studyDetail: IStudyDetail  )=>{ 
                  this.studyDetail=studyDetail;
                  console.log("Study Detail", studyDetail)
                  
                    for (let img in studyDetail['imagingSeries']){
                      if (studyDetail['imagingSeries'][img]['seriesDescription']=='short_axis_cine'){
                        dict['Short axis cine'].push(studyDetail['imagingSeries'][img]['seriesInstanceUID'])
                      }
                      else{
                        dict['Others'].push(studyDetail['imagingSeries'][img]['seriesInstanceUID'])
                      }
                    }
                    let tempStudyDetail={
                      study: studyDetail['study'],
                      imagingSeriesDict:dict
                    }
                  console.log("New data structure: ", tempStudyDetail)
                  
                  this.studyDetails.push(tempStudyDetail)
                }
              );
            }
          }          
        );
       
 }

 setSeries(uids){
      console.log(uids)
      this.seriesService.setSelectedSeriesInstanceUID(uids);
 }

  
}
