import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface NeuralNetwork {
  patterns: string[];
  responses: string[];
  context: string[];
}
@Injectable({
  providedIn: 'root'
})
export class NeuralNetworkService {
  _routeAPI: string = environment.api_neural_network

  constructor(private _http: HttpClient) { }


  createIntent(data: NeuralNetwork): Observable<string> {
    return this._http.post<string>(`${this._routeAPI}/create_intent`, data);
  }

  callNeuralNetwork(text: string): Observable<string> {
    return this._http.post<string>(`${this._routeAPI}/call_neural_network`, { data: text })
    .pipe(map((response: any) => response.Message));
  }
}
