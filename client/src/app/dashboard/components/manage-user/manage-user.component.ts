import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';

import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatSort } from '@angular/material/sort';


import { User } from '@/models/users.model';
import { UserService } from '@/users/services/user.service';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ServerService } from '@/core/services/server.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '@/core/services/auth.service';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class ManageUserComponent implements AfterViewInit, OnDestroy{
  displayedColumns: string[] = ['id', 'username', 'email', 'authority', 'organization', 'actions'];
  data: TableRow [];
  subscription: Subscription;
  server: ServerService;
  isLoadingResult = true;
  expandedElement: TableRow | null;

  editForm: FormGroup;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public userService: UserService,
    private formBuilder: FormBuilder,
    public auth: AuthService,
  ) {
    this.updateTable();
    this.subscription = this.userService.updateStatus.subscribe(
      data => {
        if (!!data) {
          this.updateTable();
        }
      });

    this.editForm = this.formBuilder.group({
      emailFormControl: ['', Validators.required],
      authorityFormControl: ['', Validators.required],
      organizationFormControl: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.sort.sortChange.pipe(
      switchMap(() => {
        this.isLoadingResult = true;
        return this.getClient(this.sort.active, this.sort.direction);
      }),
      map( data => {
        this.isLoadingResult = false;
        return data.map(user => new TableRow(user));
      }),
      catchError(() => {
        this.isLoadingResult = false;
        return of([]);
      })
      ).subscribe(
        data => this.data = data);
  }

  get f() { return this.editForm.controls; }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  updateTable() {
    this.data =  this.userService.getUserList().map(user => new TableRow(user));
    return this.data;
  }

  onDelete(userPk: number) {
    console.log(userPk);
    this.userService.deleteUser(userPk).subscribe();
  }

  onEdit(element) {
    if (element.username === this.auth.getCurrentUser()  || this.auth.getAdmin()) {
      this.f.emailFormControl.setValue(element.email);
      this.f.authorityFormControl.setValue(element.authority);
      this.f.organizationFormControl.setValue(`${element.organization}`);
      this.expandedElement = this.expandedElement === element ? null : element;
    }
  }

  onSubmit(element) {
    const profile = this.f.authorityFormControl.value === 'staff' ? null :
                    {is_admin: this.f.authorityFormControl.value === 'admin' ? true : false,
                    organization: this.f.organizationFormControl.value};
    const request = {
      email : this.f.emailFormControl.value,
      profile};
    this.userService.patchUser(element.id, request).subscribe(data => {
      this.expandedElement = null;
    });
  }


  getClient(sort: string, order: string): Observable<User []> {
    const direction = order === 'asc' ? '' : '-';
    const requestUrl = `?ordering=${direction}${sort}`;
    console.log(requestUrl);
    return this.userService.getUser(requestUrl);
  }

}

export class TableRow {
  id: number;
  username: string;
  email: string;
  authority: string;
  organization: number | null;

  constructor(user: User) {
    this.id = user.userId;
    this.username = user.username;
    this.email = user.email;
    this.authority = user.is_staff || !user.profile ? 'staff' : user.profile.is_admin ? 'admin' : 'user';
    this.organization = user.is_staff || !user.profile ? null : user.profile.organization;
  }
}

