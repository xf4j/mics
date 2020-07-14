import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationAddOrganizationComponent } from './organization-add-organization.component';

describe('OrganizationAddOrganizationComponent', () => {
  let component: OrganizationAddOrganizationComponent;
  let fixture: ComponentFixture<OrganizationAddOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationAddOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationAddOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
