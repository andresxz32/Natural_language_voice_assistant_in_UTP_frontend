import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import {  Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


export interface NeuralNetwork {
  patterns: string[];
  responses: string[];
  context: string[];
}

interface HttpOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  context?: HttpContext;
  observe?: 'body';
  params?: HttpParams | {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  };
  reportProgress?: boolean;
  responseType: 'arraybuffer';
  withCredentials?: boolean;
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

  callNeuralNetwork(text: string): Observable<any> {
    return this._http.request<any>('POST', `${this._routeAPI}/call_neural_network`,
      {
        body: { data: text },
        responseType: "arraybuffer" as "json"
      })
  }

  // generateAudio(buffer: any): any {
  //   const wav = new WaveFile();
  //   // Read a wav file from a buffer
  //   return wav.fromBuffer(buffer);
  // }
}
