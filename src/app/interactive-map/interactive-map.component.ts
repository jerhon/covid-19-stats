import { Component, OnInit } from '@angular/core';
import { StateSelected, StateStyle } from '../us-map/us-map.component';
import { CovidService, LocationData, HistoricalLocationData } from '../covid.service';

@Component({
  selector: 'app-interactive-map',
  templateUrl: './interactive-map.component.html',
  styleUrls: ['./interactive-map.component.scss']
})
export class InteractiveMapComponent implements OnInit {

  public usData: LocationData;
  public usTestHistoricalData: any;
  public usOutcomeHistoricalData: any;

  public data: LocationData;
  public testHistoricalData: any;
  public outcomeHistoricalData: any;

  public stateStyles: StateStyle[] = [];

  colorScheme = {
    domain: ['#880000', '#00DD6C']
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
        this.usTestHistoricalData = this.testHistoricalData = this.getResultsHistoricalDataSet(data);
        this.usOutcomeHistoricalData = this.outcomeHistoricalData = this.getOutcomesHistoricalDataset(data, false);
      });
  }

  stateSelected(stateSelected: StateSelected) {
    // clear out current values.
    this.data = null;
    this.testHistoricalData = null;
    this.outcomeHistoricalData = null;

    // if a state is selected, get the data.
    if (stateSelected) {
      this.service.getStateData(stateSelected.stateAbbreviation).subscribe( 
        (stateData) => { 
            this.data = stateData;
        }
      );
        
      this.service.getStateHistoricalData(stateSelected.stateAbbreviation).subscribe(
        (data) => {
          this.testHistoricalData = this.getResultsHistoricalDataSet(data);
          this.outcomeHistoricalData = this.getOutcomesHistoricalDataset(data, true);
        }
      );
    } else {
      this.data = this.usData;
      this.testHistoricalData = this.usTestHistoricalData;
      this.outcomeHistoricalData = this.usOutcomeHistoricalData;
    }
  }

  formatDate(dateString: string) {
    let dateObj = new Date(Date.parse(dateString));
    return (dateObj.getMonth() + 1) + "/" + dateObj.getDate();
  }

  getResultsHistoricalDataSet(data: HistoricalLocationData[]) {
    let mapDataSet = data.map((d) => ({ name: this.formatDate(d.dateModified), series: [
      {
        name: "Positive",
        value: d.positiveIncrease ?? 0
      },
      {
        name: "Negative",
        value: d.negativeIncrease ?? 0
      }
    ]}));

    while (
        mapDataSet[mapDataSet.length - 1].series[0].value == 0 &&
        mapDataSet[mapDataSet.length - 1].series[1].value == 0
      ) {
        mapDataSet.pop();
      }

    let result = mapDataSet.slice(0, 21).reverse();
    return result;
  }

  getOutcomesHistoricalDataset(data: HistoricalLocationData[], includeHospitalizations: boolean) {
    let deathSeries = data.map((d) => ({
      name: this.formatDate(d.dateModified),
      value: d.death
    })).slice(0, 21).reverse();

    let ret = [
      {
        name: "Deaths",
        series: deathSeries
      }
    ];

    if (data.filter((x) => x.hospitalized).length == 0) {
      includeHospitalizations = false;
    }

    if (includeHospitalizations) {
      let hospitalizedSeries = data.map((d) => ({
        name: this.formatDate(d.dateModified),
        value: d.hospitalized
      })).slice(0, 21).reverse();
      ret.push({
        name: "Hospitalizations",
        series: hospitalizedSeries
      })
    }

    return ret;
  }
}
