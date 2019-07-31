import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {QuestionTypes} from "../../../model/question.type";
import {ChartTypes} from "../../../model/chart.type";
import {SurveyService} from "../../../services/survey.service";

@Component({
    selector: 'app-question-settings',
    templateUrl: './question-settings.component.html',
    styleUrls: ['./question-settings.component.scss']
})
export class QuestionSettingsComponent {
    @Input()
    question;
    questionTypes = QuestionTypes;
    chartTypes = ChartTypes;

    @ViewChild('maxChoicesInput')
    maxChoicesInput: ElementRef;

    constructor(public surveyService: SurveyService) {
    }

    showAdditionalSettings() {
        return this.question.type === this.questionTypes.MULTI_CHOICES.propName;
    }

    showChoiceSelectionTypeSetting() {
        return this.question.type === this.questionTypes.MULTI_CHOICES.propName &&
            this.question.settings &&
            this.question.settings.choiceSelection;
    }

    showMaxChoicesSetting() {
        return this.question.type === this.questionTypes.MULTI_CHOICES.propName &&
            this.question.settings &&
            this.question.settings.maxChoices;
    }

    onSelectChart(chartType: string) {
        this.question.settings = this.question.settings || {};
        this.question.settings.chartType = chartType;
    }

    isChartSelected(chartType: string) {
        return this.question.settings && this.question.settings.chartType === chartType;
    }

    onMaxChoicesChange(maxChoicesValue) {
        let maxChoices = +maxChoicesValue;
        if (Number.isNaN(maxChoices) || maxChoices < 0) {
            maxChoices = 0;
        }

        this.maxChoicesInput.nativeElement.value = maxChoices;
        this.question.settings.maxChoices = maxChoices;
    }

    toggleMultiChoiceAllowed() {
        this.question.settings.multiChoiceAllowed = !this.question.settings.multiChoiceAllowed;
    }

    toggleShowZeroAnswers() {
        this.question.settings.showzero = !this.question.settings.showzero;
    }

    deleteQuestion() {
        this.surveyService.deleteQuestionEvent.next(true);
    }

    toggleMaxChoicesEnable() {
        this.question.settings.maxChoicesEnable = !this.question.settings.maxChoicesEnable;
    }
}
