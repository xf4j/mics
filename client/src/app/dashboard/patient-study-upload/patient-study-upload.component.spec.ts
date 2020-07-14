import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientStudyUploadComponent } from './patient-study-upload.component';

describe('PatientStudyUploadComponent', () => {
  let component: PatientStudyUploadComponent;
  let fixture: ComponentFixture<PatientStudyUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientStudyUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientStudyUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
