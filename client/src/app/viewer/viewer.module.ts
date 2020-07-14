import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';


import { ViewerRoutingModule } from './viewer-routing.module';
import { SeriesViewerComponent } from './series-viewer/series-viewer.component';
import { ViewerComponent } from './viewer/viewer.component';
import { ViewerPanelComponent } from './viewer-panel/viewer-panel.component';
import { DicomViewerComponent } from './dicom-viewer/dicom-viewer.component';


@NgModule({
  declarations: [SeriesViewerComponent, ViewerComponent, ViewerPanelComponent, DicomViewerComponent],
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSelectModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ViewerRoutingModule
  ],
  exports:[SeriesViewerComponent, ViewerComponent, ViewerPanelComponent, DicomViewerComponent]
})
export class ViewerModule { }
