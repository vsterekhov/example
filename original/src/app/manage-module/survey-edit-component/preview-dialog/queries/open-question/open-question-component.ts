import {Component, Input} from '@angular/core';
import {Question} from "../../../../../model/question.model";

@Component({
    selector: 'open-question',
    templateUrl: './open-question.html',
    styleUrls: ['./open-question.scss']
})
export class OpenQuestionComponent {
    @Input()
    chosenQuestion: Question;

    constructor() {
    }
}
