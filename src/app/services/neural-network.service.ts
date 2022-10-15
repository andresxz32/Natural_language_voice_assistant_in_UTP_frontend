import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

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

  callNeuralNetwork(text:string):Observable<any>{
    return of('Call to Neural Network')
    return this._http.get<string>('');
  }
}
