import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";

import {Question} from "../../model/question.model";
import {ChartAction} from "../chart.types";
import {Choice} from "../../model/choice.model";

@Component({
    selector: 'socs-open-ended',
    templateUrl: './open-ended.component.html',
    styleUrls: ['./open-ended.component.scss']
})
export class OpenEndedComponent implements OnChanges {
    data: Array<Choice> = [];

    @Input() question: Question;
    @Input() action: ChartAction;

    ngOnChanges(changes: SimpleChanges) {
        this.draw();
    }

    draw() {
        this.data = [...this.question.choices];
    }
}
