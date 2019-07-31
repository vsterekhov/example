import {Component, Input} from "@angular/core";
import {ChartAction} from "./chart.types";
import {Question} from "../model/question.model";
import {QuestionTypes} from "../model/question.type";

@Component({
    selector: 'socs-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
    @Input() question: Question;
    @Input() action: ChartAction;

    isMultiChoices() {
        return QuestionTypes.isMultiChoices(this.question.type);
    }

    isWordCloud() {
        return QuestionTypes.isWordCloud(this.question.type);
    }

    isOpenEnded() {
        return QuestionTypes.isOpenEnded(this.question.type);
    }
}
