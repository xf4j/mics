import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ViewerService, IViewerSeriesDetail} from '../viewer.service';
import { AlertService } from '../../alert/alert.service';
import { SeriesService } from '../../dashboard/series.service';
@Component({
  selector: 'app-series-viewer',
  templateUrl: './series-viewer.component.html',
  styleUrls: ['./series-viewer.component.css']
})
export class SeriesViewerComponent implements OnInit {

  seriesDetail: IViewerSeriesDetail;
  isLoading: boolean = true;
  widthx: any;
  @ViewChild('viewerPanel') viewerPanel;
  @Input() seriesInstanceUid: any;
  @Input() lengthOfSeries: any;
  
  constructor(
    private route: ActivatedRoute,
    private viewerService: ViewerService,
    private alertService: AlertService,
    private seriesService: SeriesService
  ) { }

  ngOnInit(): void {
    // console.log("Inside Series Viewer")
    // const seriesInstanceUid = '1.3.12.2.1107.5.2.30.25360.30000014042912245843700000449';
        this.widthx=Math.sqrt(this.lengthOfSeries);
        this.widthx=Math.ceil(this.widthx)
        this.viewerService.checkSeriesInstanceUidValid(this.seriesInstanceUid).subscribe(
          (res)=>{
            this.viewerService.getViewerSeriesDetail(this.seriesInstanceUid).subscribe(
              (seriesDetail: IViewerSeriesDetail) => {
                this.seriesDetail = seriesDetail;
                this.isLoading = false;
              },
              (err: HttpErrorResponse) => {
                this.alertService.displayErrors(err['error']);
                this.isLoading = false;
              }
            );
          },
        );
      }
    

   
  }

  // ngOnInit(): void {
  //   const seriesInstanceUid = this.route.snapshot.paramMap.get('uid');
  //   this.viewerService.getViewerSeriesDetail(seriesInstanceUid).subscribe(
  //     (seriesDetail: IViewerSeriesDetail) => {
  //       this.seriesDetail = seriesDetail;
  //       this.isLoading = false;
  //     },
  //     (err: HttpErrorResponse) => {
  //       this.alertService.displayErrors(err['error']);
  //       this.isLoading = false;
  //     }
  //   );
  // }


