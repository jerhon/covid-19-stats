import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsMapComponent } from './us-map/us-map.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InteractiveMapComponent } from './interactive-map/interactive-map.component';
import { DatasheetComponent } from './datasheet/datasheet.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AboutPageComponent } from './about-page/about-page.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ApiErrorInterceptor } from './api-error.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    UsMapComponent,
    InteractiveMapComponent,
    DatasheetComponent,
    AboutPageComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ClarityModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: ApiErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
