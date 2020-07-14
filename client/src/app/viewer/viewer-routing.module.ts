import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewerComponent } from './viewer/viewer.component';
import { AuthGuard } from '../users/auth.guard';
import { SeriesViewerComponent } from './series-viewer/series-viewer.component';
import { SeriesViewerResolverService } from './series-viewer-resolver.service';

const viewerRoutes: Routes = [
  { 
    path: 'viewer',
    component: ViewerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          {
            path: ':uid',
            component: SeriesViewerComponent,
            resolve: {
              seriesInstanceUidValid: SeriesViewerResolverService
            }
          }

            
          ]
        }
      ]
    }
  ];

  
@NgModule({
  imports: [RouterModule.forChild(viewerRoutes)],
  exports: [RouterModule]
})
export class ViewerRoutingModule { }
