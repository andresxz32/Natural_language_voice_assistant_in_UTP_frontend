import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NeuralNetwork, NeuralNetworkService } from './services/neural-network.service';
import { VoiceRecognitionService } from './services/voice-recognition.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public formTraining!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _neuralNetworkService: NeuralNetworkService,
    public voiceRecognitionService: VoiceRecognitionService
  ) { }

  ngOnInit(): void {
    this.formTraining = this._formBuilder.group({
      questions: this._formBuilder.array([]),
      answers: this._formBuilder.array([]),
    });
    this.addAnswer();
    this.addQuestion();
    this.voiceRecognitionService.init();
  }

  startVoiceRecognition() {
    this.voiceRecognitionService.start();
  }

  stopVoiceRecognition() {
    this.voiceRecognitionService.stop();
  }

  addQuestion(): void {
    const questionsForm = this._formBuilder.group({
      value: ['', Validators.required],
    });
    this.questions.push(questionsForm);
  }

  addAnswer(): void {
    const answerForm = this._formBuilder.group({
      value: ['', Validators.required],
    });
    this.answers.push(answerForm);
  }

  deleteQuestion(questionIndex: number): void {
    this.questions.removeAt(questionIndex);
  }

  deleteAnswer(answerIndex: number): void {
    this.answers.removeAt(answerIndex);
  }

  save(): void {
    const { answers, questions } = this.formTraining.value;
    const formValue: NeuralNetwork = {
      patterns: questions.map((question: { value: string }) => question.value).filter((question: string) => question !== ''),
      responses: answers.map((answer: { value: string }) => answer.value).filter((answer: string) => answer !== ''),
      context: []
    }
    if (formValue.patterns.length == 0) return console.log('Form Invalid');
    if (formValue.responses.length == 0) return console.log('Form Invalid');;
    this._neuralNetworkService
      .createIntent(formValue)
      .subscribe({
        next: (response) => { 
          this.formTraining.reset();
          this.resetFormArrays();
          console.log(response)
         },
        error: (error) => { console.log(error) },
      })
  }

  resetFormArrays():void{
    while (this.questions.length !== 0) {
      this.questions.removeAt(0)
    }
    while (this.answers.length !== 0) {
      this.answers.removeAt(0)
    }
    this.addAnswer();
    this.addQuestion();
  }



  get questions(): FormArray<FormGroup<{ value: FormControl<string | null> }>> {
    return this.formTraining.controls["questions"] as FormArray;
  }

  get answers(): FormArray<FormGroup<{ value: FormControl<string | null> }>> {
    return this.formTraining.controls["answers"] as FormArray;
  }
}
