import { Component, OnInit } from '@angular/core';
import { StateStyle } from '../us-map/us-map.component';
import { StateData, NationData, CovidService } from '../covid.service';

@Component({
  selector: 'app-interactive-map',
  templateUrl: './interactive-map.component.html',
  styleUrls: ['./interactive-map.component.scss']
})
export class InteractiveMapComponent implements OnInit {

  public usData: NationData;
  public stateData: StateData;
  public stateStyles: StateStyle[];
  public data: { 
    name: string;
    positive: number;
    negative: number;
    death: number;
  }

  constructor(private service: CovidService) { }

  ngOnInit() {
    this.service
      .getUnitedStatesData()
      .subscribe((us) =>  {
        this.usData = us;
        this.data = { name: 'United States', ...us };
      });
  }

  stateSelected(state: string) {
    this.service.getStateData(state).subscribe( 
      (sd) => { 
        if (sd) {
          this.stateData = sd; 
          this.data = { name: this.service.getStateName(sd.state), ...sd };
        } else {
          this.data = { name: 'United States', ...this.usData }
        }
      }
    );
  }
}
