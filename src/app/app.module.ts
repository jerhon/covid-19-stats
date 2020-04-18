import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsMapComponent } from './us-map/us-map.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InteractiveMapComponent } from './interactive-map/interactive-map.component';
import { DatasheetComponent } from './datasheet/datasheet.component';


@NgModule({
  declarations: [
    AppComponent,
    UsMapComponent,
    InteractiveMapComponent,
    DatasheetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ClarityModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
