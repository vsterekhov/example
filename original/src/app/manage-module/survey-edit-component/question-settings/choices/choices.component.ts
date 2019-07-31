import {Component, Input, OnDestroy} from '@angular/core';
import {Question} from "../../../../model/question.model";
import {Choice} from "../../../../model/choice.model";
import {SurveyService} from "../../../../services/survey.service";
import {HasPosition} from "../../../../model/has-position.model";
import {DragulaService} from 'ng2-dragula';
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'app-choices',
    templateUrl: './choices.component.html',
    styleUrls: ['./choices.component.scss']
})
export class ChoicesComponent implements OnDestroy {
    @Input()
    question: Question;
    selectedChoice: Choice;
    dragulaSubscription = new Subscription();

    constructor(public surveyService: SurveyService, private readonly dragulaService: DragulaService) {
        this.dragulaSubscription.add(this.dragulaService.dropModel("choices").subscribe(({sourceModel}) => {
            sourceModel.forEach((model, index) => {
                model.position = index;
            });

            this.question.choices = sourceModel;
        }));
    }

    ngOnInit() {
        this.surveyService.deselectChoiceEvent.subscribe(() => {
            this.selectedChoice = undefined;
        });
    }

    onSelectChoice(choice: Choice) {
        for (const item of this.surveyService.order(this.question.choices)) {
            if (JSON.stringify(item) === JSON.stringify(choice)) {
                this.selectedChoice = item;
                break;
            }
        }
    }

    onDelete() {
        if (this.selectedChoice) {
            this.surveyService.deleteSelectedPositionedItem(this.question.choices, this.selectedChoice);
            this.selectedChoice = undefined;
        }
    }

    ngOnDestroy() {
        this.dragulaSubscription.unsubscribe();
    }

    onPositionUp(choice: HasPosition) {
        this.surveyService.positionUp(this.question.choices, choice);
    }

    onPositionDown(choice: HasPosition) {
        this.surveyService.positionDown(this.question.choices, choice);
    }
}
