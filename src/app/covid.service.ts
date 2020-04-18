import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators'
import { abbreviations } from '../states.json';

export interface StateData {
  state: string;
  positive:number;
  posativeScore: number;
  negativeScore: number;
  negativeRegularScore: number;
  commercialScore: number
  grade: string;
  score: number;
  negative: number;
  pending?: number;
  hospitalizedCurrently?: number;
  hospitalizedCumulative?:number;
  inIcuCurrently?: number;
  inIcuCumulative?:number;
  onVentilatorCurrently?: number;
  onVentilatorCumulative?: number;
  recovered: number;
  lastUpdateEt: string;
  checkTimeEt: string;
  death:number;
  hospitalized:number;
  total:number;
  totalTestResults:number;
  posNeg:number;
  fips: string;
  dateModified: string;
  dateChecked:string;
  notes: string;
  hash: string;
}

export interface NationData {
  positive:number;
  negative:number;
  death: number;
}

export interface LocationData { 
  name: string;
  positive: number;
  negative: number;
  death: number;
}

@Injectable({
  providedIn: 'root'
})
export class CovidService {

  constructor(private client: HttpClient) { }

  getAllStateData(): Observable<LocationData[]> {
    return this.client.get<StateData[]>("https://covidtracking.com/api/v1/states/current.json")
      .pipe(map((d) => d.map((x) => ({ 
        name: this.getStateName(x.state), 
        positive: x.positive, 
        negative: x.negative, 
        death: x.death
      }))));
  }

  getUnitedStatesData(): Observable<LocationData> {
    return this.client.get<NationData[]>('https://covidtracking.com/api/v1/us/current.json')
      .pipe(map((d) => 
      ({
        name: 'United States',
        positive: d[0].positive,
        negative: d[0].negative,
        death: d[0].death
      })));
  }

  getStateData(stateAbbreviation: string) {

    let state = stateAbbreviation.length == 2 ? this.getStateName(stateAbbreviation) : stateAbbreviation;

    return this.getAllStateData()
      .pipe(
        map((sd) => {
          let matchingState = sd.filter((x) => x.name == state);
          if (matchingState.length > 0) {
            return matchingState[0];
          }
          return null;
        })
      );
  }

  getStateName(abbr: string) {
    console.log(abbreviations);
    return abbreviations[abbr];
  }
}
