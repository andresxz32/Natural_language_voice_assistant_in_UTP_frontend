import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NeuralNetwork {
  patterns: string[];
  responses: string[];
}
@Injectable({
  providedIn: 'root'
})
export class NeuralNetworkService {

  constructor(private _http: HttpClient) { }


  trainNeuralNetwork(data: NeuralNetwork): Observable<string> {
    return this._http.post<string>('', data);
  }
}
