import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { SeriesViewerComponent } from '../../viewer/series-viewer/series-viewer.component';
import { SeriesService } from '../series.service';
@Component({
  selector: 'app-series-tabs',
  templateUrl: './series-tabs.component.html',
  styleUrls: ['./series-tabs.component.css']
})
export class SeriesTabsComponent implements OnInit {
  @ViewChild(SeriesViewerComponent )
  private seriesViewerComponent: SeriesViewerComponent;
  uids: any;
  @Input() seriesUIDs: any;

  constructor(
    private router: Router,
    private seriesService : SeriesService
  ) { }
  

  ngOnInit(): void {
    
  }

  

}
