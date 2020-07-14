import { Component, OnInit } from '@angular/core';
import { PatientTableComponent } from '../patient-table/patient-table.component';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  private patientTableComponent: PatientTableComponent;
  constructor() { }

  ngOnInit(): void {
  }

}
