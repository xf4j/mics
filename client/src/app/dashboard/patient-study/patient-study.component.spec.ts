import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientStudyComponent } from './patient-study.component';

describe('PatientStudyComponent', () => {
  let component: PatientStudyComponent;
  let fixture: ComponentFixture<PatientStudyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientStudyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
