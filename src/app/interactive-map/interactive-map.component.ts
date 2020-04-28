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
  public state: string;

  public stateStyles: StateStyle[] = [];

  colorScheme = {
    domain: ['#880000', '#00DD6C']
  };
  
  constructor(private service: CovidService, private route: ActivatedRoute, private router: Router) { 
    route.paramMap.subscribe((params) => { 
      let region = params.get("region");
      this.state = region;
      this.refresh();
    });
  }

  refresh() {
    this.refreshMap();
    this.refreshData(this.state);
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

  refreshData(id: string) {

    // clear out current values.
    this.data = null;
    this.testHistoricalData = null;
    this.outcomeHistoricalData = null;

    if (id == 'us') {          

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
      
    } else {

      this.service.getStateData(id).subscribe( 
        (stateData) => { 
            this.data = stateData;
        }
      );
        
      this.service.getStateHistoricalData(id).subscribe(
        (data) => {
          this.testHistoricalData = this.getResultsHistoricalDataSet(data);
          this.outcomeHistoricalData = this.getOutcomesHistoricalDataset(data, true);
        }
      );

    }
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
    console.log(stateSelected);
    this.router.navigate(['../' + stateSelected.stateAbbreviation.toLowerCase()], { relativeTo: this.route })
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
