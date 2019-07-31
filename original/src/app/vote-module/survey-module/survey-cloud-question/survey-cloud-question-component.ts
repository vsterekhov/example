import {Component, Pipe, PipeTransform} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Question} from "../../../model/question.model";
import {VoteService} from "../../../services/vote.service";
import {ConnectableComponent} from "../../../common/connectable-component";
import {HttpErrorResponse} from "@angular/common/http";

@Pipe({
    name: 'asArray'
})
export class AsArrayPipe implements PipeTransform {
    transform(value: number) {
        const result: number[] = new Array(value);

        for (let i = 0; i < value; i++) {
            result[i] = i;
        }

        return result;
    }
}

@Component({
    selector: 'survey-cloud-question',
    templateUrl: './survey-cloud-question.html',
    styleUrls: ['./survey-cloud-question.scss']
})
export class SurveyCloudQuestionComponent extends ConnectableComponent {
    public multiChoiceAllowed = false;
    public answersNumber: number;
    public answers: string[];

    constructor(router: Router,
                activatedRoute: ActivatedRoute,
                voteService: VoteService) {
        super(router, activatedRoute, voteService);
    }

    processQuestion(question: Question) {

        try {
            const jsonSettings = JSON.parse(question.settings);

            if (jsonSettings.multiChoiceAllowed) {
                this.multiChoiceAllowed = jsonSettings.multiChoiceAllowed;
            }
        } catch (exception) {
            console.error(`Настройки вопроса не соответствуют формату JSON [${question.settings}].`);
        }

        this.answers = [];
        this.answers.push("");
        this.question = question;
        this.newActiveQuestionId = this.question.id;

        if (!this.checkSurveyStateSubscription) {
            this.startCheckSurveyState(this.pollCode);
        }
    }

    initPropertiesByDefault() {
        this.question = undefined;
        this.multiChoiceAllowed = false;
        this.showThanks = false;
        this.answersNumber = 1;
        this.answers = [];
        this.alreadyAnswered = false;

        this.disableCheckSurveyState();
    }

    disableAnswerButton(): boolean {
        return this.answers.filter((answer) => answer && answer.length > 0).length <= 0;
    }

    addOneRow(): void {
        if (this.multiChoiceAllowed) {
            this.answersNumber++;
        }
    }

    processVote(): void {
        const data: any = [];

        this.answers.filter((answer) => answer && answer.length > 0).forEach((answer) => {
            const datum: any = {label: answer};

            datum.question = {
                id: this.questionID,
                survey: {code: this.pollCode}
            };

            data.push(datum);
        });

        this.voteService.addCloudAnswers(data).subscribe(() => {
                this.showThanks = true;
                this.checkLastQuestionAnswered();
            },
            (err: HttpErrorResponse) => {
                this.processFailedVoting(err);
            }
        );
    }
}
