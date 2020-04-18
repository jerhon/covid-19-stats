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

@Injectable({
  providedIn: 'root'
})
export class CovidService {

  constructor(private client: HttpClient) { }

  getAllStateData(): Observable<StateData[]> {
    return this.client.get<StateData[]>("https://covidtracking.com/api/v1/states/current.json");
  }

  getUnitedStatesData(): Observable<NationData> {
    return this.client.get<NationData[]>('https://covidtracking.com/api/v1/us/current.json').pipe(map((d) => d[0]));
  }

  getStateData(state: string) {
    return this.getAllStateData()
      .pipe(
        map((sd) => {
          let matchingState = sd.filter((x) => x.state == state);
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
