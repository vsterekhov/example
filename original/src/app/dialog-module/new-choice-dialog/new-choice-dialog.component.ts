import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {DialogService} from "../dialog.service";
import {Choice} from "../../model/choice.model";
import {QuestionService} from "../../services/question.service";
import {SurveyService} from "../../services/survey.service";

@Component({
    selector: 'app-new-choice-dialog',
    templateUrl: './new-choice-dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class NewChoiceDialogComponent implements OnInit {
    @Input() choices: Choice[];
    @Output() select: EventEmitter<Choice> = new EventEmitter<Choice>();
    choice: Choice;

    constructor(public surveyService: SurveyService,
                public questionService: QuestionService,
                private dialogService: DialogService) {
    }

    ngOnInit() {
    }

    open(template) {
        this.choice = this.questionService.getDefaultChoice();
        this.dialogService.openDialog(template);
    }

    ok() {
        this.choice.label = this.choice.label.trim();
        this.choice.position = this.choices.length;
        this.choices.push(this.choice);
        this.close();
        this.select.emit({...this.choice});
    }

    close() {
        this.dialogService.closeDialog();
    }

    get isMaxChoicesReached(): boolean {
        return this.choices.length > 9;
    }

    get title(): string {
        return this.isMaxChoicesReached ? 'Достигнуто максимальное количество вариантов' : 'Добавить ответ';
    }
}
