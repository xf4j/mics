import { Component, OnInit, ViewChild } from '@angular/core';
import { OrganizationService, Organization } from '../organization.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../users/user.service';
import { AuthService } from '../../users/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-organization-table',
  templateUrl: './organization-table.component.html',
  styleUrls: ['./organization-table.component.css']
})
export class OrganizationTableComponent implements OnInit {

  displayedColumns: string[] = ['name', 'edit'];
  dataSource = new MatTableDataSource<Organization>();
  organizationList: Organization[]=[];
  selectedOrganization: any;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private organizationService: OrganizationService,
    private confirmDialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getOrganizationsList();
  }
  getOrganizationsList():void {
    this.organizationService.getOrganizationsList().subscribe(
      (data: Organization[])=>{
        this.organizationList=data;
        this.setDataSource(this.organizationList);
      }
    );
  }

  private setDataSource(data): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  
  setOrganization(organization){
    this.organizationService.setSelectedOrganization(organization);
    this.router.navigate(['organizations/edit-organization']);
  }

}
