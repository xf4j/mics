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
    private studyService: StudyService,
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
    console.log("Already opened tabs",this.seriesService.alreadyOpenedTabs);
    console.log("TabsToOpen", this.seriesService.tabsToOpen);
    let n=Object.keys(this.seriesService.alreadyOpenedTabs).length;
    // no tabs have been opened
    if(n==0){
      console.log("No tabss opened")
      for (let study in this.seriesService.tabsToOpen ){
        console.log("study",study)
          for (let series of this.seriesService.tabsToOpen[study]){
            console.log("this.seriesService.tabsToOpen[study]",this.seriesService.tabsToOpen[study])
            console.log("series",series)
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
    // if already opened tabs remove from tabs to open
    else{
      console.log("tabss opened")
      for (let study in this.seriesService.tabsToOpen ){
        console.log("study",study)
        for (let series of this.seriesService.tabsToOpen[study]){
          console.log("this.seriesService.tabsToOpen[study]",this.seriesService.tabsToOpen[study])
          console.log("series",series)

          
          console.log("Yo this.seriesService.alreadyOpenedTabs.hasOwnProperty(series)",this.seriesService.alreadyOpenedTabs.hasOwnProperty(series))
          // console.log()
          if (this.seriesService.alreadyOpenedTabs.hasOwnProperty(series) && this.seriesService.alreadyOpenedTabs[series]==study){
              this.seriesService.tabsToOpen[study]=this.seriesService.tabsToOpen[study].filter(obj=> obj!==series);
              console.log("this.seriesService.tabsToOpen[study]",this.seriesService.tabsToOpen[study].length)
              
              if(this.seriesService.tabsToOpen[study].length==0){
                delete this.seriesService.tabsToOpen[study]
              }
              
              // console.log("this.seriesService.tabsToOpen[study]",this.seriesService.tabsToOpen[study].length)
          
            }
          else{
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
    }
    console.log("-------test series",this.seriesService.tabsToOpen);
    for (let study in this.seriesService.tabsToOpen ){
      console.log("T2 study",study)
      for (let series of this.seriesService.tabsToOpen[study]){
        console.log("T2 this.seriesService.tabsToOpen[study]",this.seriesService.tabsToOpen[study])
        console.log("T2 series",series)
        // this.alreadyOpenedTabs.push(tab);
        this.seriesService.alreadyOpenedTabs[series]=study;
        this.seriesService.addTab(series);
      }
    }
    
  
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
