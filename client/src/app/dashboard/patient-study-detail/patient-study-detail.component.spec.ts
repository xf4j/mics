import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientStudyDetailComponent } from './patient-study-detail.component';

describe('PatientStudyDetailComponent', () => {
  let component: PatientStudyDetailComponent;
  let fixture: ComponentFixture<PatientStudyDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientStudyDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientStudyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
