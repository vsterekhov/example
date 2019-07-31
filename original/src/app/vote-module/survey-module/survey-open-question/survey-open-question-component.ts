import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Question} from "../../../model/question.model";
import {VoteService} from "../../../services/vote.service";
import {ConnectableComponent} from "../../../common/connectable-component";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'survey-open-question',
    templateUrl: './survey-open-question.html',
    styleUrls: ['./survey-open-question.scss']
})
export class SurveyOpenQuestionComponent extends ConnectableComponent {
    private considerMaxChoicesValue: boolean;

    public showIntermediateMessage = false;
    public answer: string = null;

    constructor(router: Router, activatedRoute: ActivatedRoute, voteService: VoteService) {
        super(router, activatedRoute, voteService);
    }

    processQuestion(question: Question) {
        this.considerMaxChoicesValue = false;

        try {
            const jsonSettings = JSON.parse(question.settings);

            if (jsonSettings.maxChoicesEnable != null) {
                this.considerMaxChoicesValue = jsonSettings.maxChoicesEnable;
            }
        } catch (exception) {
            console.error(`Настройки вопроса не соответствуют формату JSON [${question.settings}].`);
        }

        this.question = question;
        this.newActiveQuestionId = this.question.id;

        if (!this.checkSurveyStateSubscription) {
            this.startCheckSurveyState(this.pollCode);
        }
    }

    initPropertiesByDefault() {
        this.question = undefined;
        this.showThanks = false;
        this.showIntermediateMessage = false;
        this.answer = undefined;
        this.alreadyAnswered = false;

        this.disableCheckSurveyState();
    }

    disableAnswerButton(): boolean {
        return !this.answer || this.answer.length === 0;
    }

    hideIntermediateMessage(): void {
        this.showIntermediateMessage = false;
        this.answer = undefined;
    }

    canAnswer() {
        return !this.showThanks && !this.alreadyAnswered && !this.showIntermediateMessage && !this.surveyPassed;
    }

    processVote(): void {
        const data: any = {label: this.answer};

        data.question = {
            id: this.questionID,
            survey: {code: this.pollCode}
        };

        this.voteService.addOpenAnswer(data).subscribe((voteRemain: number) => {
            if (this.considerMaxChoicesValue === true) {
                if (voteRemain === 0) {
                    this.showThanks = true;
                    this.checkLastQuestionAnswered();
                } else {
                    this.showIntermediateMessage = true;
                }
            } else {
                this.showIntermediateMessage = true;
            }
        }, (err: HttpErrorResponse) => {
            this.processFailedVoting(err);
        });
    }
}
