import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';

import { AuthService } from '../users/auth.service';
import { ServerService } from '../_services/server.service';
import { AlertService } from '../alert/alert.service';
import { IStudy, ISeries, IStudyDetail, StudyService, IStudyDetailTest, StudyNode, StudyFlatNode } from '../studies/study.service';


@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  tabUIDS={};
  tabsToOpen={};
  alreadyOpenedTabs=[];
  currentStudy:any;
  selectedPatient: any;
  studyDetails: IStudyDetailTest[]=[];
  studyList : IStudy[]=[];
  studyDetailList: IStudyDetail;
  private selectedSeriesInstanceUID= new BehaviorSubject<any>(null);
  private numberofStudiesSelected = new BehaviorSubject<any>(null);

  private studiesUpdated =new BehaviorSubject<any>(false);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private serverService: ServerService,
    private alertService: AlertService,
    private studyService: StudyService,
    
  ) { }


  setNumberofStudiesSelected(n): void {
    this.numberofStudiesSelected.next(n);
}

  getNumberofStudiesSelected(): Observable<any> {
    return this.numberofStudiesSelected.asObservable();
}

setStudiesUpdateStatus(n): void {
  this.studiesUpdated.next(n);
}

getStudiesUpdateStatus(): Observable<any> {
  return this.studiesUpdated.asObservable();
}

setSelectedSeriesInstanceUID(uid): void {
  this.selectedSeriesInstanceUID.next(uid);
}

getSelectedSeriesInstanceUID(): Observable<any> {
  return this.selectedSeriesInstanceUID.asObservable();
}

tabs = ['Upload'];
selected = new FormControl(0);

addTab(tabName:string) {
  this.tabs.push(tabName);
  this.selected.setValue(this.tabs.length - 1);
  
}

removeTab(index: number) {
  let i= this.alreadyOpenedTabs.indexOf(this.tabs[index])
  this.alreadyOpenedTabs.splice(i,1);
  if(this.alreadyOpenedTabs.length==0){
      this.currentStudy=null
  }
   
  this.tabs.splice(index, 1);
  
}
loadStudies(patient) {
  return new Observable(observer => {
  this.selectedPatient=patient;
      this.studyService.getStudies(this.selectedPatient).subscribe(
        (data: IStudy[])=>{
          if (data.length==0){
            observer.next(data)
          }
          this.studyList=data;
          //flush older list
          this.studyDetails=[];
          for (let study of this.studyList){
            let dict={};
            let dict1={};
            
            dict['Short axis cine']={}
            dict['Others']={}
            
            dict['Short axis cine']['imagingData']=[];
            dict['Short axis cine']['metaData']=[];
            dict['Others']['imagingData']=[];
            dict['Others']['metaData']=[];
            this.studyService.getStudy(study['image_study_instance_uid']).subscribe(
              (studyDetail: IStudyDetail  )=>{ 
                this.studyDetailList=studyDetail;
                
                for (let img in studyDetail['imagingSeries']){

                  let tdict={
                    modality : studyDetail['imagingSeries'][img]['modality'],
                    seriesDateTime : studyDetail['imagingSeries'][img]['seriesDateTime'],
                    seriesDescription : studyDetail['imagingSeries'][img]['seriesDescription'],
                    studyInstanceUID : studyDetail['imagingSeries'][img]['studyInstanceUID']
                  }
                  
                  if (studyDetail['imagingSeries'][img]['seriesDescription'].includes('short_axis_cine')){
                      dict['Short axis cine']['imagingData'].push(studyDetail['imagingSeries'][img]['seriesInstanceUID']);
                      dict['Short axis cine']['metaData'].push(tdict);
                    }
                    else{
                      dict['Others']['imagingData'].push(studyDetail['imagingSeries'][img]['seriesInstanceUID']);
                      dict['Others']['metaData'].push(tdict);
                    }
                  }
                  let tempStudyDetail={
                    study: studyDetail['study'],
                    imagingSeriesDict:dict1,
                    state:false,
                    seriesGroup: dict
                  }
                this.studyDetails.push(tempStudyDetail)
                
                // change this lot of ttimes getting set
                observer.next(this.studyDetails);

              }
              
            );
            
          }
        });

      });
     
}

}
