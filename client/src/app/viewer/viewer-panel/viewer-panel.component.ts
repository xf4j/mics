import { Component, OnInit, Input, ViewChild } from '@angular/core';

import * as cornerstone from 'cornerstone-core';
import * as dicomParser from 'dicom-parser'; // WADO image loader depends on it
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

import { IViewerSeriesDetail, IDicomViewerDisplayData, ViewerService } from '../viewer.service';
import { AlertService } from '../../alert/alert.service';
@Component({
  selector: 'app-viewer-panel',
  templateUrl: './viewer-panel.component.html',
  styleUrls: ['./viewer-panel.component.css']
})
export class ViewerPanelComponent implements OnInit {

  @Input() seriesDetail: IViewerSeriesDetail;
  @ViewChild('axialDicomViewer') axialDicomViewer;
  @ViewChild('coronalDicomViewer') coronalDicomViewer;
  @ViewChild('sagittalDicomViewer') sagittalDicomViewer;

  isLoading: boolean;
  allLoadSuccess: boolean;

  private _displayData: IDicomViewerDisplayData = {
    allImages: [],
    numberOfImages: 0,
  };
  get displayData(): IDicomViewerDisplayData {
    return this._displayData;
  }

  private _fullScreenPanel: any;
  get fullScreenPanel(): any {
    const panels = [this.axialDicomViewer, this.coronalDicomViewer, this.sagittalDicomViewer];
    for (let panel of panels) {
      if (panel && panel.isFullScreen === true) {
        this._fullScreenPanel = panel;
        return this._fullScreenPanel;
      }
    }
    return;
  }
  constructor(
    private viewerService: ViewerService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.cornerstoneWADOImageLoaderInit();
    this.isLoading = true;
    this.viewerService.loadDisplayData(this.seriesDetail.instanceUIDs).subscribe(
      data => {
        this._displayData = {
          allImages: data.allImages,
          numberOfImages: data.numberOfImages,
          
        }
        this.isLoading = false;
        this.allLoadSuccess = this.viewerService.allLoadSuccess;
      },
      err => {
        this.isLoading = false;
        this.allLoadSuccess = this.viewerService.allLoadSuccess;
      }
    )
  }

  resetWindow() {
    this.axialDicomViewer.resetWindow();
    this.coronalDicomViewer.resetWindow();
    this.sagittalDicomViewer.resetWindow();
  }

  onMouseDown(event) {
    const startX = event.pageX; 
    const startY = event.pageY;

    let self = this;
    function mouseMoveHandler(event) {
      const deltaX = event.pageX - startX;
      const deltaY = event.pageY - startY;
      
      const mouseButton = event.which;
      if (mouseButton == 1) { // left button
        self.axialDicomViewer.updateViewport(deltaX, deltaY, 'voi');
        self.coronalDicomViewer.updateViewport(deltaX, deltaY, 'voi');
        self.sagittalDicomViewer.updateViewport(deltaX, deltaY, 'voi');
      }
    }

    function mouseUpHandler() {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    }

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }



  // Reference: 
  // https://github.com/cornerstonejs/cornerstoneWADOImageLoader
  // https://github.com/cornerstonejs/cornerstoneWADOImageLoader/blob/master/docs/WebWorkers.md
  private cornerstoneWADOImageLoaderInit() {
    try {
      // Using cornerstone web worker for CPU intensive tasks to better control the utilization of the available CPU cores
      const webWorkerConfig = {
        maxWebWorkers: navigator.hardwareConcurrency || 1, // some browsers will return the number of cores available via the navigator.hardwareConcurrency
        startWebWorkersOnDemand: true, // true if you want to create web workers only when needed, false if you want them all created on initialize (default)
        webWorkerPath: '/static/client/assets/cornerstone/cornerstoneWADOImageLoaderWebWorker.min.js',
        // webWorkerPath: '/assets/cornerstone/cornerstoneWADOImageLoaderWebWorker.min.js',
        taskConfiguration: {
          'decodeTask': {
            loadCodecsOnStartup: true,
            initialieCodecsOnStartup: false, // whether initialize the JPEG2000 or JPEG-LS decoders on startup
            codecsPath: '/static/client/assets/cornerstone/cornerstoneWADOImageLoaderCodecs.min.js',
            // codecsPath: '/assets/cornerstone/cornerstoneWADOImageLoaderCodecs.min.js',
            usePDFJS: false, // whether to use PDF.JS codec for decoding images, OpenJPEG based codec by default
            strict: true
          }
        }
      };
      cornerstoneWADOImageLoader.webWorkerManager.initialize(webWorkerConfig); // config web worker
      // specify the cornerstone instance you want to register the loader with
      cornerstoneWADOImageLoader.external.cornerstone = cornerstone; // inject Cornerstone instance into Cornerstone Tools when using a module system
      cornerstoneWADOImageLoader.external.dicomParser = dicomParser; // need to add this if using WADO Image Loader with a packaging system that uses modules
    }
    catch(e) {
      this.alertService.error(e);
    }
  }

}
