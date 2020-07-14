import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientStudyTableComponent } from './patient-study-table.component';

describe('PatientStudyTableComponent', () => {
  let component: PatientStudyTableComponent;
  let fixture: ComponentFixture<PatientStudyTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientStudyTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientStudyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
