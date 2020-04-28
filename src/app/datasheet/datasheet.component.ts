import { Component, OnInit } from '@angular/core';
import { LocationData, CovidService } from '../covid.service';

@Component({
  selector: 'app-datasheet',
  templateUrl: './datasheet.component.html',
  styleUrls: ['./datasheet.component.scss']
})
export class DatasheetComponent implements OnInit {

  usData: LocationData;
  statesData: LocationData[];

  constructor(private service: CovidService) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.service.getUnitedStatesData().subscribe((usData) => this.usData = usData);
    this.service.getAllStateData().subscribe((stateData) => this.statesData = stateData.sort((a,b) => b.positive - a.positive));
  }
}
