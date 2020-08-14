import { Component, OnInit, OnChanges, ViewChild, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { PatientService, Patient } from '../patient.service';
import { IStudy, ISeries, IStudyDetail, StudyService, IStudyDetailTest, StudyNode, StudyFlatNode } from '../../studies/study.service';
import { UtilService } from '../../_services/util.service';
import { AuthService } from '../../users/auth.service';
import { UploadService } from '../../studies/upload.service';
import { AlertService } from '../../alert/alert.service';
import { PatientStudyListComponent } from '../patient-study-list/patient-study-list.component';
import { SeriesService } from '../series.service';

@Component({
  selector: 'app-patient-study',
  templateUrl: './patient-study.component.html',
  styleUrls: ['./patient-study.component.css']
})

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */


export class PatientStudyComponent implements OnInit {

  @ViewChild(PatientStudyListComponent) patientStudyListComponent;

  selectedPatient: any;
  studyDetails: any;
  // studyList : IStudy[]=[];   
  // studyDetailList: IStudyDetail;
  imagingSeries: ISeries[];
  alreadyOpenedTabs: string[]=[];
  treeData: any;
  size: number;

  constructor(
    private patientService: PatientService,
    private alertService: AlertService,
    private authService: AuthService,
    public seriesService: SeriesService,
    
  ){}
   


   
  ngOnInit(): void {

    this.patientService.getSelectedPatient().subscribe(
      patient=>{
        this.selectedPatient=patient;
        
        this.seriesService.loadStudies(this.selectedPatient).subscribe(allStudyDetails =>{
          this.studyDetails=allStudyDetails;
          this.setDataSource(allStudyDetails);
        });
        
        
      });
      this.seriesService.getNumberofStudiesSelected().subscribe(
        number=>{
          this.size=number;
          
        }
      );

      this.seriesService.getStudiesUpdateStatus().subscribe(
        ()=>{
          this.seriesService.loadStudies(this.selectedPatient).subscribe(allStudyDetails =>{
                this.setDataSource(allStudyDetails);
              });
              
              
        
        }
      )
      
  }
  

  

  private setDataSource(studyDetails): void {
  
    this.treeData={};
    for (let study of studyDetails){
      let seriesList={}
      for (let series in study['seriesGroup']){
        
        let descList=[];
        for (let seriesDesc in study['seriesGroup'][series]['metaData']){
          descList.push(study['seriesGroup'][series]['metaData'][seriesDesc]['seriesDescription'])
        }
        seriesList[series]=descList
      }
      this.treeData[study['study']['studyID']]=seriesList;
    }
    
  }
  loadSeries(){
     
    for (let study in this.seriesService.tabsToOpen ){
      if (this.seriesService.currentStudy && this.seriesService.currentStudy!=study){
          console.log("Case when user opens different study");
          this.alertService.error('Close already opened study before opening new study');
          break;
      }
      else{
        this.seriesService.currentStudy=study;
        for (let series of this.seriesService.tabsToOpen[study]){
          
          if(this.seriesService.alreadyOpenedTabs.includes(series)){
            console.log("User trying to open already opened series");

          }
          else{

            console.log("User is opening new Series");
            
            this.seriesService.alreadyOpenedTabs.push(series);
            for( let detail of this.studyDetails){
              if(detail['study']['studyID']==study){
                  this.seriesService.tabUIDS[series]=detail['seriesGroup'][series]['imagingData']
                  break;
                }
            }
            
            this.seriesService.addTab(series);
          }
        }
      }
    }
    console.log(this.seriesService.alreadyOpenedTabs);
    this.seriesService.tabsToOpen={}
  }

  
  
}
