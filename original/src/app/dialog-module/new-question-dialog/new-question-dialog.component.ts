import {Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Question} from "../../model/question.model";
import {QuestionService} from "../../services/question.service";
import {QuestionType, QuestionTypes} from "../../model/question.type";
import {ChartTypes} from "../../model/chart.type";
import {SurveyService} from "../../services/survey.service";
import {DialogService} from "../dialog.service";

@Component({
    selector: 'app-new-question-dialog',
    templateUrl: './new-question-dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class NewQuestionDialogComponent implements OnInit {
    question: Question;
    questionTypes: QuestionType[] = QuestionTypes.values;
    @Output() new: EventEmitter<Question> = new EventEmitter<Question>();

    constructor(private questionService: QuestionService,
                public surveyService: SurveyService,
                private dialogService: DialogService) {
    }

    ngOnInit() {
    }

    open(template) {
        this.question = this.questionService.getDefaultQuestion();
        this.dialogService.openDialog(template);
    }

    ok() {
        this.question.question = this.question.question.trim();

        // set bar chart as default chart type for MULTI_CHOICES questions
        if (this.question.type === QuestionTypes.MULTI_CHOICES.propName) {
          this.question.settings.chartType = ChartTypes.BAR_CHART.propName;
        }

        if (this.question.type === QuestionTypes.MULTI_CHOICES.propName ||
            this.question.type === QuestionTypes.WORD_CLOUD.propName) {
            this.question.settings.multiChoiceAllowed = false;
        }

        if (this.question.type === QuestionTypes.OPEN_ENDED.propName) {
            this.question.settings.maxChoices = 5;
            this.question.settings.maxChoicesEnable = false;
        }

        this.new.emit({...this.question});
        this.close();
    }

    close(){
        this.dialogService.closeDialog();
    }
}
