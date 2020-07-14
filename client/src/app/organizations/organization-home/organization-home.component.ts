import { Component, OnInit, ViewChild } from '@angular/core';
import { OrganizationTableComponent} from '../organization-table/organization-table.component'
@Component({
  selector: 'app-organization-home',
  templateUrl: './organization-home.component.html',
  styleUrls: ['./organization-home.component.css']
})
export class OrganizationHomeComponent implements OnInit {

  @ViewChild(OrganizationTableComponent)
  private organizationTableComponent: OrganizationTableComponent;

  constructor() { }

  ngOnInit(): void {
  }

}
