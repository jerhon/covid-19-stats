import { Component, OnInit } from '@angular/core';
import { StateSelected, StateStyle } from '../us-map/us-map.component';
import { CovidService, LocationData } from '../covid.service';

@Component({
  selector: 'app-interactive-map',
  templateUrl: './interactive-map.component.html',
  styleUrls: ['./interactive-map.component.scss']
})
export class InteractiveMapComponent implements OnInit {

  public usData: LocationData;
  public data: LocationData;
  public stateStyles: StateStyle[] = [];
  
  constructor(private service: CovidService) { }

  howTheHeckDoIScaleTheData(positive: number, total: number) {
    // combine a logarithmic scale + linear scale
    return (Math.log(positive) / Math.log(total) * .65) + (positive / total * 0.35);
  }
  
  ngOnInit() {
    this.service
      .getUnitedStatesData()
      .subscribe((us) =>  {
        this.usData = us;
        this.data = us;
      });

    this.service
      .getAllStateData()
      .subscribe((ld) => {
        let total = ld.reduce((pv, cv) => pv.positive > cv.positive ? pv : cv, ld[0]).positive;
        this.stateStyles = ld.map((ld) => ({ 
          stateAbbreviation: ld.abbreviation, 
          fillColor: '#' + Math.ceil(255 - this.howTheHeckDoIScaleTheData(ld.positive, total) * 255).toString(16) + '0000'
        }));
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
