import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudiesRoutingModule } from './studies-routing.module';
import { StudyComponent } from './study/study.component';
import { StudyTableComponent } from './study-table/study-table.component';


@NgModule({
  declarations: [StudyComponent, StudyTableComponent],
  imports: [
    CommonModule,
    StudiesRoutingModule
  ]
})
export class StudiesModule { }
