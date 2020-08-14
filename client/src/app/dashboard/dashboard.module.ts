import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule, MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule, MatList } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { PatientTableComponent } from './patient-table/patient-table.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { ViewPatientComponent } from './view-patient/view-patient.component';
import { PatientStudyUploadComponent } from './patient-study-upload/patient-study-upload.component';
import { PatientStudyTableComponent } from './patient-study-table/patient-study-table.component';
import { PatientStudyDetailComponent } from './patient-study-detail/patient-study-detail.component';
import { PatientStudyComponent } from './patient-study/patient-study.component';
import { SeriesTabsComponent } from './series-tabs/series-tabs.component';
import { ViewerModule } from '../viewer/viewer.module';
import { PatientStudyListComponent } from './patient-study-list/patient-study-list.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardHomeComponent,
    PatientDashboardComponent,
    PatientTableComponent,
    AddPatientComponent,
    ViewPatientComponent,
    PatientStudyUploadComponent,
    PatientStudyTableComponent,
    PatientStudyDetailComponent,
    PatientStudyComponent,
    SeriesTabsComponent,
    PatientStudyListComponent,
       
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    DashboardRoutingModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatListModule,
    MatTooltipModule,
    MatDividerModule,
    MatSelectModule,
    MatSidenavModule,
    MatCardModule,
    MatTreeModule,
    MatProgressBarModule,
    MatExpansionModule,
    ViewerModule
    
  ],
  
})
export class DashboardModule { }
