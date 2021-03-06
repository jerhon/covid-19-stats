import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InteractiveMapComponent } from './interactive-map/interactive-map.component';
import { DatasheetComponent } from './datasheet/datasheet.component';
import { AboutPageComponent } from './about-page/about-page.component';

const routes: Routes = [
  { path: '', pathMatch:'full', redirectTo: 'map/us' },
  { path: 'map', pathMatch:'full', redirectTo: 'map/us' },
  { path: 'map/:region', component: InteractiveMapComponent },
  { path: 'datasheet', component: DatasheetComponent },
  { path: 'about', component: AboutPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
