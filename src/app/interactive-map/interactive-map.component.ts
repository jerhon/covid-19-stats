import { Component, OnInit } from '@angular/core';
import { StateSelected, StateStyle } from '../us-map/us-map.component';
import { CovidService, LocationData, HistoricalLocationData } from '../covid.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-interactive-map',
  templateUrl: './interactive-map.component.html',
  styleUrls: ['./interactive-map.component.scss']
})
export class InteractiveMapComponent implements OnInit {

  public usData: LocationData;
  public data: LocationData;
  public testHistoricalData: any;
  public outcomeHistoricalData: any;

  public stateStyles: StateStyle[] = [];

  multi: any[];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Test Results';
  animations: boolean = true;

  colorScheme = {
    domain: ['#880000', '#00FF8C']
  };


  
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

    this.service
      .getUnitedStatesHistoricalData()
      .subscribe((data) => {
        this.testHistoricalData = this.getResultsHistoricalDataSet(data);
        this.outcomeHistoricalData = this.getOutcomesHistoricalDataSet(data, false);
      });

  }

  stateSelected(stateSelected: StateSelected) {
    if (stateSelected) {
      this.service.getStateData(stateSelected.stateAbbreviation).subscribe( 
        (stateData) => { 
            this.data = stateData;
        }
      );
        
      this.service.getStateHistoricalData(stateSelected.stateAbbreviation).subscribe(
        (data) => {
          this.testHistoricalData = this.getResultsHistoricalDataSet(data);
          this.outcomeHistoricalData = this.getOutcomesHistoricalDataSet(data, true);
        }
      )
    } else {
      this.data = this.usData;
    }
  }

  formatDate(dateString: string) {
    let dateObj = new Date(Date.parse(dateString));
    return (dateObj.getMonth() + 1) + "/" + dateObj.getDate();
  }

  getResultsHistoricalDataSet(data: HistoricalLocationData[]) {
    let mapDataSet = data.map((d) => ({ name: this.formatDate(d.dateModified), series: [
      {
        name: "positive",
        value: d.positiveIncrease ?? 0
      },
      {
        name: "negative",
        value: d.negativeIncrease ?? 0
      }
    ]}));

    while (
        mapDataSet[mapDataSet.length - 1].series[0].value == 0 &&
        mapDataSet[mapDataSet.length - 1].series[1].value == 0
      ) {
        mapDataSet.pop();
      }

    return mapDataSet.slice(0, 21);
  }

  getOutcomesHistoricalDataSet(data: HistoricalLocationData[], showHospitalized: boolean) {
    let mapDataSet = data.map((d) => {
      
      let series = [{
        name: "deaths",
        value: d.deathIncrease ?? 0
      }];

      if (showHospitalized) {
        series.push({
          name: "hospitalized",
          value: d.hospitalizedIncrease ?? 0
        });
      }

      return { 
        name: this.formatDate(d.dateModified), 
        series 
      }
    });

    while (
        mapDataSet[mapDataSet.length - 1].series[0].value == 0 &&
        (mapDataSet[mapDataSet.length - 1].series.length == 1 || mapDataSet[mapDataSet.length - 1].series[1].value == 0)
      ) {
        mapDataSet.pop();
      }

    return mapDataSet.slice(0, 21);
  }

}
