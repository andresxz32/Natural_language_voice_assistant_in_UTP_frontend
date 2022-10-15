import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NeuralNetworkService } from './neural-network.service';

declare let webkitSpeechRecognition: any;
@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {
  private recognition = new webkitSpeechRecognition();
  private isStoppedSpeechRecog: boolean = false;
  private temporalWords: string = '';
  public text: string = '';
  public historyOfConversation: string = '<h4>Seguimiento de llamada:</h4>';

  constructor(
    private _neuralNetworkService: NeuralNetworkService
  ) { }

  init() {
    this.recognition.interimResults = true;
    this.recognition.lang = 'es-Es';

    this.recognition.addEventListener('result', (e: { results: Iterable<unknown> | ArrayLike<unknown>; }) => {
      // console.log('e',e);
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.temporalWords = transcript;
      // console.log('TRANSCRIPT:', transcript);
    });
  }

  start() {
    console.log('Speech recognition started');
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    this.recognition.addEventListener('end', async (condition: any) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
      } else {
        this.wordConcat();
        console.log(this.text);
        if (this.text !== " ." && this.text.split("").filter(str => str === ".").length === 1) {
          this.historyOfConversation = this.historyOfConversation + `<p><strong>User:</strong>${this.text}</p><br>`
          const result$ = this._neuralNetworkService.callNeuralNetwork(this.text)
          const result = await lastValueFrom(result$);
          this.historyOfConversation = this.historyOfConversation +  `<p><strong>Pipe Bot UTP:</strong>${result}</p><br>`
          this.text = '';

        }
        this.text = '';
        this.recognition.start();
      }
    });
  }
  stop() {
    this.isStoppedSpeechRecog = true;
    this.wordConcat();
    this.recognition.stop();
    this.text = '';
    this.historyOfConversation = '<h4>Seguimiento de llamada:</h4>'
    console.log('End speech recognition');
  }

  wordConcat() {
    this.text = this.text + ' ' + this.temporalWords + '.';
    this.temporalWords = '';
  }
}
