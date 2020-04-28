import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface NetworkError {
  status: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppAlertService {

  constructor() { }

  public networkError: Subject<NetworkError>  = new Subject<NetworkError>();

  pushNetworkError(error: NetworkError) {
    this.networkError.next(error);
  }
}
