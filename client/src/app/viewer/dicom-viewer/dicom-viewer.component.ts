import * as cornerstone from 'cornerstone-core';

import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ViewerService, IDicomViewerDisplayData } from '../viewer.service';

declare var ResizeObserver;

@Component({
  selector: 'app-dicom-viewer',
  templateUrl: './dicom-viewer.component.html',
  styleUrls: ['./dicom-viewer.component.css']
})
export class DicomViewerComponent implements OnInit, OnDestroy {

  @Input() displayData: IDicomViewerDisplayData;
  @ViewChild('dicomViewer') dicomViewer: ElementRef;

  requestID: any;

  isFullScreen: boolean;
  dicomViewerResizeObserver;
  mouseDown: boolean = false;
  contourEditingMode: boolean = false;
  // contourEditingChange: Subject<boolean> = new Subject<boolean>();
  currentSlice: number;
  defaultWindowWidth: number;
  defaultWindowCenter: number;
  currentWindowWidth: number;
  currentWindowCenter: number;
  mouseUpBound: any;
  mouseDragBound: any;


  totalFrames : number;
  animationDuration : number = 1300;
  timePerFrame:number;
  timeWhenLastUpdate: any;
  timeFromLastUpdate: any;
  currentImageIndex = 0;




  constructor(
    public viewerService: ViewerService,
  ) { }

  
  ngOnInit() {
    this.viewerService.getSelectedPlayerAction().subscribe(
      action=>{
        if (action==true){
          this.start();
        }
        else{
          this.stop();
        }
      }
    );
    
  }

  ngAfterViewInit(){
    cornerstone.enable(this.dicomViewer.nativeElement); // prepare the element to display images
    this.dicomViewer.nativeElement.addEventListener('cornerstoneimagerendered', (event) => {
      this.drawContours(event);
    });
    
    this.setEvents();
    this.currentSlice = 0;
    this.totalFrames =this.displayData.numberOfImages;
    this.timePerFrame= this.animationDuration/ this.totalFrames;
      
    this.refreshDisplay();
    let viewport = cornerstone.getViewport(this.dicomViewer.nativeElement); // describes how the Image should be rendered
    // this.defaultWindowWidth = Math.round(viewport.voi.windowWidth);
    // this.defaultWindowCenter = Math.round(viewport.voi.windowCenter);
    // this.currentWindowWidth = Math.round(viewport.voi.windowWidth);
    // this.currentWindowCenter = Math.round(viewport.voi.windowCenter);
 
  }

  ngOnDestroy() {
    this.dicomViewerResizeObserver.unobserve(this.dicomViewer.nativeElement);
  }

  private refreshDisplay() {
    let viewport = cornerstone.getViewport(this.dicomViewer.nativeElement);
    cornerstone.displayImage(this.dicomViewer.nativeElement, this.displayData.allImages[this.currentSlice], viewport);
    
  }

  step=() =>{
    var startTime= performance.now()
    
    if(!this.timeWhenLastUpdate)
    { 
      this.timeWhenLastUpdate = startTime;}
    this.timeFromLastUpdate = startTime - this.timeWhenLastUpdate;
    
    if (this.timeFromLastUpdate > this.timePerFrame) {
        this.refreshDisplay();
        this.timeWhenLastUpdate = startTime;
        if (this.currentSlice >=this.displayData.numberOfImages-1) {
            this.currentSlice = 0;
        } else {
            this.currentSlice += 1;
            
        }     
    }
    this.requestID=requestAnimationFrame(this.step);
    
  }

  private drawContours(event) {
    const eventData = event.detail;

    let rows = this.displayData.allImages[this.currentSlice].data.uint16('x00280010');
    // this.currentPaths.length = 0;

    cornerstone.setToPixelCoordinateSystem(eventData.enabledElement, eventData.canvasContext);

    // NOTE: The coordinate system of the canvas is in image pixel space.  Drawing
    // to location 0,0 will be the top left of the image and rows,columns is the bottom
    // right.
    const context = eventData.canvasContext;
    context.beginPath();
    context.strokeStyle = 'white';
    context.lineWidth = 0.5 * rows / 256;
    // context.rect(90,90,500,1000);
    context.stroke();
    
    
    }
  

  

  private setEvents() {
    let self = this;

    // dicomViewer resize (for full screen)
    this.dicomViewerResizeObserver = new ResizeObserver(() => {
      cornerstone.resize(self.dicomViewer.nativeElement);
    });
    this.dicomViewerResizeObserver.observe(this.dicomViewer.nativeElement);

    // scroll events
    let wheelEvents = ['mousewheel', 'DOMMouseScroll'];
    wheelEvents.forEach((eventType) => {
      self.dicomViewer.nativeElement.addEventListener(eventType, (event) => {
        // Firefox e.detail > 0 scroll back, < 0 scroll forward
        // chrome/safari e.wheelDelta < 0 scroll back, > 0 scroll forward
        if (event.wheelDelta < 0 || event.detail > 0) {
          self.backwardOneSlice();
        } else {
          self.forwardOneSlice();
        }
        // Prevent page fom scrolling
        // e.stopPropagation();  // prevents the event from bubbling up the DOM, but does not stop the browsers default behaviour
        event.preventDefault();  // prevents the browsers default behavior, but does not stop the event from bubbling up the DOM
        // return false;  // in the context of jQuery, prevents the browsers default behaviour, prevents the event from bubbling up the DOM, and immediately returns from any callback
      });
    });

    // mouse move event for contour labels
    this.dicomViewer.nativeElement.addEventListener('mousemove', (event) => {
      if (!event.buttons) {
        // first: segmentationSeries, second: allImages stack, third: contours
        let context = event.target.getContext("2d");
        let dpi = window.devicePixelRatio;
        let style_height = +getComputedStyle(event.target).getPropertyValue("height").slice(0, -2);
        let style_width = +getComputedStyle(event.target).getPropertyValue("width").slice(0, -2);

        event.target.setAttribute('width', style_width * dpi);
        event.target.setAttribute('height', style_height * dpi);

        let mousePixel = this.canvasToPixel(event.clientX - event.target.getBoundingClientRect().left, event.clientY - event.target.getBoundingClientRect().top);


      }
    });

    
    // translation, scale
    this.dicomViewer.nativeElement.addEventListener('mousedown', (event) => {
      let lastX = event.pageX;
      let lastY = event.pageY;
      const mouseButton = event.which;

      function mouseMoveHandler(event) {
        const deltaX = event.pageX - lastX;
        const deltaY = event.pageY - lastY;
        lastX = event.pageX;
        lastY = event.pageY;

        if (mouseButton === 2) { // middle button
          self.updateViewport(deltaX, deltaY, 'translation');
        } else if (mouseButton === 3) { // right button
          self.updateViewport(deltaX, deltaY, 'scale');
        }
      }

      function mouseUpHandler() {
        document.removeEventListener('mouseup', mouseUpHandler);
        document.removeEventListener('mousemove', mouseMoveHandler);
      }

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    });
  }

  private forwardOneSlice() {
    if (this.currentSlice + 1 < this.displayData.numberOfImages) {
      this.currentSlice += 1
      this.refreshDisplay();
    }
  }

  private backwardOneSlice() {
    if (this.currentSlice - 1 >= 0) {
      this.currentSlice -= 1;
      this.refreshDisplay();
    }
  }

  private updateViewport(deltaX, deltaY, option) {
    let viewport = cornerstone.getViewport(this.dicomViewer.nativeElement);
    if (option == 'voi') {
      // The scaling factor may need to change based on the image range
      viewport.voi.windowWidth += deltaX / 5;
      viewport.voi.windowCenter += deltaY / 5;
      this.currentWindowWidth = Math.round(viewport.voi.windowWidth);
      this.currentWindowCenter = Math.round(viewport.voi.windowCenter);
    } else if (option == 'translation') {
      viewport.translation.x += (deltaX / viewport.scale);
      viewport.translation.y += (deltaY / viewport.scale);
    } else if (option == 'scale') {
      viewport.scale += (deltaY / 100);
    }
    cornerstone.setViewport(this.dicomViewer.nativeElement, viewport);
  }

  private canvasToPixel(x, y) {
    return cornerstone.canvasToPixel(this.dicomViewer.nativeElement, {x, y})
  }

  private pixelToCanvas(x, y) {
    return cornerstone.pixelToCanvas(this.dicomViewer.nativeElement, {x, y});
  }

  start(){
    this.requestID = this.step();
  }

  stop(){
    cancelAnimationFrame(this.requestID);
  }

  onResize(event) {
    cornerstone.resize(this.dicomViewer.nativeElement);
  }

  onMouseDown(event) {
    if (event.buttons == 1 && this.contourEditingMode) { // If left clicked
      // first: segmentationSeries, second: allImages stack, third: contours
      let context = event.target.getContext("2d");

      let dpi = window.devicePixelRatio;

      let style_height = +getComputedStyle(event.target).getPropertyValue("height").slice(0, -2);
      let style_width = +getComputedStyle(event.target).getPropertyValue("width").slice(0, -2);

      event.target.setAttribute('width', style_width * dpi);
      event.target.setAttribute('height', style_height * dpi);

      let mousePixel = this.canvasToPixel(event.clientX - event.target.getBoundingClientRect().left, event.clientY - event.target.getBoundingClientRect().top);

    }
  }

  private mouseDrag(mouseP, event) { // Drag event after clicking a contour point
    if (event.which == 1) { // If left clicked
      // first: segmentationSeries, second: allImages stack, third: contours
      let context = event.target.getContext('2d');

      let dpi = window.devicePixelRatio;

      let style_height = +getComputedStyle(event.target).getPropertyValue('height').slice(0, -2);
      let style_width = +getComputedStyle(event.target).getPropertyValue('width').slice(0, -2);

      event.target.setAttribute('width', style_width * dpi);
      event.target.setAttribute('height', style_height * dpi);

      let mousePixel = this.canvasToPixel(event.clientX - event.target.getBoundingClientRect().left, event.clientY - event.target.getBoundingClientRect().top);

      // this.contourService.selectedContour[mouseP].x = mousePixel.x;
      // this.contourService.selectedContour[mouseP].y = mousePixel.y;
      // if (this.contourEditingMode) {
      //   context.fillStyle = "#FF0000"; // red dot
      //   let contourPixel = this.pixelToCanvas(this.contourService.selectedContour[mouseP].x, this.contourService.selectedContour[mouseP].y);
      //   context.fillRect(contourPixel.x - 2.5, contourPixel.y - 2.5, 5, 5);
      // }
      this.refreshDisplay();
      return;

    }
  }

  private mouseUp(e) {
    this.mouseDown = false;
    document.removeEventListener('mouseup', this.mouseUpBound);
    document.removeEventListener('mousemove', this.mouseDragBound);
    this.refreshDisplay();
  }

  resetDisplay() {
    // reset the viewer display
    this.currentWindowWidth = this.defaultWindowWidth;
    this.currentWindowCenter = this.defaultWindowCenter;
    cornerstone.reset(this.dicomViewer.nativeElement);
    this.refreshDisplay();
  }

  resetWindow() {
    let viewport = cornerstone.getViewport(this.dicomViewer.nativeElement);
    viewport.voi.windowCenter = this.defaultWindowCenter;
    viewport.voi.windowWidth = this.defaultWindowWidth;
    cornerstone.setViewport(this.dicomViewer.nativeElement, viewport);
    this.currentWindowWidth = this.defaultWindowWidth;
    this.currentWindowCenter = this.defaultWindowCenter;
  }

  

}
