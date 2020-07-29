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
  studyDetails: IStudyDetailTest[]=[];
  studyList : IStudy[]=[];
  studyDetailList: IStudyDetail;
  imagingSeries: ISeries[];
  alreadyOpenedTabs: string[]=[];
  treeData: any;
  size: number;

  constructor(
    private patientService: PatientService,
    private studyService: StudyService,
    private authService: AuthService,
    public seriesService: SeriesService,
    
  ){}
   


   
  ngOnInit(): void {

    this.patientService.getSelectedPatient().subscribe(
      patient=>{
        this.selectedPatient=patient;
        this.loadStudies(this.selectedPatient);
        
      });
      this.seriesService.getNumberofStudiesSelected().subscribe(
        number=>{
          this.size=number;
          console.log("----------> size badla",this.size);
        }
      );
      
  }

  

  private setDataSource(studyDetails): void {
  
    this.treeData={};
    for (let study of studyDetails){
      let seriesList={}
      for (let series in study['seriesGroup']){
        console.log("test 1",series)
        let descList=[];
        for (let seriesDesc in study['seriesGroup'][series]['metaData']){
          descList.push(study['seriesGroup'][series]['metaData'][seriesDesc]['seriesDescription'])
        }
        seriesList[series]=descList
      }
      this.treeData[study['study']['studyID']]=seriesList;
    }
    console.log("Test--------->",this.treeData);
  }

  loadStudies(patient) {
    this.selectedPatient=patient;
        this.studyService.getStudies(this.selectedPatient).subscribe(
          (data: IStudy[])=>{
            this.studyList=data;
            for (let study of this.studyList){
              let dict={};
              let dict1={};
              dict1['Short axis cine']=[]
              dict1['Others']=[]

              dict['Short axis cine']={}
              dict['Others']={}
              
              dict['Short axis cine']['imagingData']=[];
              dict['Short axis cine']['metaData']=[];
              dict['Others']['imagingData']=[];
              dict['Others']['metaData']=[];
              // console.log("image_study_instance_uid= ",study['image_study_instance_uid'])
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
                        dict1['Short axis cine'].push(studyDetail['imagingSeries'][img]['seriesInstanceUID']);
                        dict['Short axis cine']['imagingData'].push(studyDetail['imagingSeries'][img]['seriesInstanceUID']);
                        dict['Short axis cine']['metaData'].push(tdict);
                      }
                      else{
                        dict1['Others'].push(studyDetail['imagingSeries'][img]['seriesInstanceUID']);
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
                  console.log("Study details", this.studyDetails)
                  // console.log("Study detail", this.studyDetailList)
                  this.setDataSource(this.studyDetails);
                  // change this lot of ttimes getting set
                  

                }
                
              );
              
            }
          }          
        );
       
 }
 loadSeries(){

  let n=Object.keys(this.seriesService.alreadyOpenedTabs).length;
  if(n==0){
    for (let study in this.seriesService.tabsToOpen ){
        for (let series of this.seriesService.tabsToOpen[study]){
          // console.log(series)
          // console.log("--------------sD",this.studyDetails)
          // console.log(this.studyDetails['seriesGroup'])
          // console.log(this.studyDetails['seriesGroup'][series])
          if (this.seriesService.tabUIDS.hasOwnProperty(series)){
            // flushing the values of already existing other studies' series with same name
            delete this.seriesService.tabUIDS[series];
            
          }
          for( let detail of this.studyDetails){
            if(detail['study']['studyID']==study){
                this.seriesService.tabUIDS[series]=detail['seriesGroup'][series]['imagingData']
                break;
              }
          }
          
        }
    }

  }
  console.log("-------test series",this.seriesService.tabsToOpen);
  for (let study in this.seriesService.tabsToOpen ){
    for (let series of this.seriesService.tabsToOpen[study]){
      // this.alreadyOpenedTabs.push(tab);
      this.seriesService.addTab(series);
    }
  }
  // for (let tab of tabsToOpen){
  //   console.log("tab=",tab)
  //   this.alreadyOpenedTabs.push(tab);
  //  this.seriesService.addTab(tab);
   
  // }  

 }

 
 xloadSeries(selectedSeries){
  
   let tabsToOpen=[];
   if (this.alreadyOpenedTabs.length!=0){
    for(let series of selectedSeries){
      if (! this.alreadyOpenedTabs.includes(series.value.key)){
        tabsToOpen.push(series.value.key);
        if (this.seriesService.tabUIDS.hasOwnProperty(series.value.key)){
            // flushing the values of already existing other studies' series with same name
            delete this.seriesService.tabUIDS[series.value.key];
            
        }
        this.seriesService.tabUIDS[series.value.key]=series.value.value;
      }
    }
   }
   else{
     console.log("No tabs opened");
      for(let series of selectedSeries){
        console.log(series.value.key)
        tabsToOpen.push(series.value.key);
        if (this.seriesService.tabUIDS.hasOwnProperty(series.value.key)){
          // flushing the values of already existing other studies' series with same name
          delete this.seriesService.tabUIDS[series.value.key];
          
      }
      this.seriesService.tabUIDS[series.value.key]=series.value.value;
      }
   }
   for (let tab of tabsToOpen){
     console.log("tab=",tab)
     this.alreadyOpenedTabs.push(tab);
    this.seriesService.addTab(tab);
    
   }
   
 }

 
 

  
}
