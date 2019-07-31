import {Component, Input} from '@angular/core';
import {Question} from "../../../../../model/question.model";

@Component({
    selector: 'close-question',
    templateUrl: './close-question.html',
    styleUrls: ['./close-question.scss']
})
export class CloseQuestionComponent {
    @Input()
    chosenQuestion: Question;

    constructor() {
    }
}
