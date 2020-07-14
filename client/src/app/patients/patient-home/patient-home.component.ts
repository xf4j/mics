import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientTableComponent } from '../patient-table/patient-table.component'

@Component({
  selector: 'app-patient-home',
  templateUrl: './patient-home.component.html',
  styleUrls: ['./patient-home.component.css']
})
export class PatientHomeComponent implements OnInit {

  @ViewChild(PatientTableComponent)
  private patientTableComponent: PatientTableComponent;

  constructor() { }

  ngOnInit(): void {
  }

}
