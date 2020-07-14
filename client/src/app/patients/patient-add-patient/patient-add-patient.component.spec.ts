import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAddPatientComponent } from './patient-add-patient.component';

describe('PatientAddPatientComponent', () => {
  let component: PatientAddPatientComponent;
  let fixture: ComponentFixture<PatientAddPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientAddPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAddPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
