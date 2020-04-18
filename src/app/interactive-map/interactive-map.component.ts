import { Component, OnInit } from '@angular/core';
import { StateSelected } from '../us-map/us-map.component';
import { CovidService, LocationData } from '../covid.service';

@Component({
  selector: 'app-interactive-map',
  templateUrl: './interactive-map.component.html',
  styleUrls: ['./interactive-map.component.scss']
})
export class InteractiveMapComponent implements OnInit {

  public usData: LocationData;
  public data: LocationData;
  
  constructor(private service: CovidService) { }

  ngOnInit() {
    this.service
      .getUnitedStatesData()
      .subscribe((us) =>  {
        this.usData = us;
        this.data = us;
      });
  }

  stateSelected(stateSelected: StateSelected) {
    if (stateSelected) {
      this.service.getStateData(stateSelected.stateAbbreviation).subscribe( 
        (stateData) => { 
            this.data = stateData;
        }
      );
    } else {
      this.data = this.usData;
    }
  }
}
