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
    private _voiceRecognitionService: VoiceRecognitionService
  ) { }

  ngOnInit(): void {
    this.formTraining = this._formBuilder.group({
      questions: this._formBuilder.array([]),
      answers: this._formBuilder.array([]),
    });
    this.addAnswer();
    this.addQuestion();
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
      patterns: answers.map((answer: { value: string }) => answer.value),
      responses: questions.map((question: { value: string }) => question.value),
    }
    this._neuralNetworkService
      .trainNeuralNetwork(formValue)
      .subscribe(
        {
          next: (response) => { console.log(response) },
          error: (error) => { console.log(error) },
        }
      )
  }

  get questions(): FormArray<FormGroup<{ value: FormControl<string | null> }>> {
    return this.formTraining.controls["questions"] as FormArray;
  }

  get answers(): FormArray<FormGroup<{ value: FormControl<string | null> }>> {
    return this.formTraining.controls["answers"] as FormArray;
  }
}
