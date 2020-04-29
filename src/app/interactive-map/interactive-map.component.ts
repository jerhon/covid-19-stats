import { Component, OnInit } from '@angular/core';
import { StateSelected, StateStyle } from '../us-map/us-map.component';
import { CovidService, LocationData, HistoricalLocationData } from '../covid.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RefreshablePage } from '../app.component';

@Component({
  selector: 'app-interactive-map',
  templateUrl: './interactive-map.component.html',
  styleUrls: ['./interactive-map.component.scss']
})
export class InteractiveMapComponent implements OnInit, RefreshablePage {

  public data: LocationData;
  public testHistoricalData: any;
  public outcomeHistoricalData: any;
  public states: string[];

  public stateStyles: StateStyle[] = [];

  colorScheme = {
    domain: ['#880000', '#00DD6C']
  };
  
  constructor(private service: CovidService, private route: ActivatedRoute, private router: Router) { 
    route.paramMap.subscribe((params) => { 
      let region = params.get("region");
      if (service.getStateName(region)) {
        this.states = [ region ];
      } else {
        this.states = [ ];
        if (region != 'us') {
          this.router.navigate(['../us'], { relativeTo: this.route })
        }
      }
      this.refresh();
    });
  }

  refresh() {
    this.refreshMap();
    if (this.states.length) {
      this.refreshStateData(this.states[0]);
    } else {
      this.refreshUsData();
    }
  }

  refreshMap() {
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

  refreshUsData() {
    // clear out current values.
    this.data = null;
    this.testHistoricalData = null;
    this.outcomeHistoricalData = null;

    this.service
      .getUnitedStatesData()
      .subscribe((us) =>  {
        this.data = us;
      });
    
    this.service
      .getUnitedStatesHistoricalData()
      .subscribe((data) => {
        this.testHistoricalData = this.getResultsHistoricalDataSet(data);
        this.outcomeHistoricalData = this.getOutcomesHistoricalDataset(data, false);
      });
  }

  refreshStateData(state: string) {

    // clear out current values.
    this.data = null;
    this.testHistoricalData = null;
    this.outcomeHistoricalData = null;

    this.service.getStateData(state).subscribe( 
      (stateData) => { 
          this.data = stateData;
      }
    );
      
    this.service.getStateHistoricalData(state).subscribe(
      (data) => {
        this.testHistoricalData = this.getResultsHistoricalDataSet(data);
        this.outcomeHistoricalData = this.getOutcomesHistoricalDataset(data, true);
      }
    );
  }

  howTheHeckDoIScaleTheData(positive: number, total: number) {
    // combine a logarithmic scale + linear scale
    return (Math.log(positive) / Math.log(total) * .65) + (positive / total * 0.35);
  }
  
  ngOnInit() {
  }

  formatDate(dateString: string) {
    let dateObj = new Date(Date.parse(dateString));
    return (dateObj.getMonth() + 1) + "/" + dateObj.getDate();
  }

  stateSelected(stateSelected: StateSelected) {
    let state = stateSelected.stateAbbreviation.toLowerCase();
    if (this.states.find((x) => x == state)) {
      this.router.navigate(['../us'], {relativeTo: this.route});      
    } else {
      this.router.navigate(['../' + state], { relativeTo: this.route });
    }
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
