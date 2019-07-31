import {Component, Input} from '@angular/core';
import {Question} from "../../../../../model/question.model";

@Component({
    selector: 'questions-and-comments',
    templateUrl: './questions-and-comments.html',
    styleUrls: ['./questions-and-comments.scss']
})
export class QuestionsAndCommentsComponent {
    @Input()
    chosenQuestion: Question;

    constructor() {
    }
}
