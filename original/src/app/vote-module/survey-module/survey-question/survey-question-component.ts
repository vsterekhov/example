import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Question} from "../../../model/question.model";
import {VoteService} from "../../../services/vote.service";
import {ConnectableComponent} from "../../../common/connectable-component";
import {Choice} from "../../../model/choice.model";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'survey-question',
    templateUrl: './survey-question.html',
    styleUrls: ['./survey-question.scss']
})
export class SurveyQuestionComponent extends ConnectableComponent {
    public multiChoiceAllowed = false;
    public choiceValue: number = undefined;
    public checkboxes: Array<boolean>;

    constructor(router: Router, activatedRoute: ActivatedRoute, voteService: VoteService) {
        super(router, activatedRoute, voteService);
    }

    processQuestion(question: Question) {
        try {
            const jsonSettings = JSON.parse(question.settings);

            if (jsonSettings.multiChoiceAllowed) {
                this.multiChoiceAllowed = jsonSettings.multiChoiceAllowed;
            }
        } catch (exception) {
            console.error(`Настройки вопроса не соответствуют формату JSON [${ question.settings }].`);
        }

        if (this.multiChoiceAllowed) {
            this.checkboxes = [];

            question.choices.forEach((choice) => {
                this.checkboxes[choice.id] = false;
            });
        }

        this.question = question;
        this.newActiveQuestionId = this.question.id;

        if (!this.checkSurveyStateSubscription) {
            this.startCheckSurveyState(this.pollCode);
        }
    }

    initPropertiesByDefault() {
        this.question = undefined;
        this.choiceValue = undefined;
        this.checkboxes = [];
        this.multiChoiceAllowed = false;
        this.showThanks = false;
        this.alreadyAnswered = false;

        this.disableCheckSurveyState();
    }

    disableAnswerButton(): boolean {
        if (this.multiChoiceAllowed) {
            if (this.checkboxes.find((item) => item === true) !== undefined) {
                return false;
            }
        } else {
            if (this.choiceValue !== undefined) {
                return false;
            }
        }

        return true;
    }

    processVote(): void {
        let data: any;

        if (this.multiChoiceAllowed) {
            data = [];

            this.checkboxes.forEach((item, index) => {
                if (item === true) {
                    const datum: any = this.getChoiceById(index);

                    datum.question = {
                        id: this.questionID,
                        survey: {code: this.pollCode}
                    };

                    data.push(datum);
                }
            });

            this.voteService.setVotingResults(data).subscribe(
                () => {
                    this.showThanks = true;
                    this.checkLastQuestionAnswered();
                },
                (err: HttpErrorResponse) => {
                    this.processFailedVoting(err);
                }
            );
        } else {
            data = this.question.choices[this.choiceValue];

            data.question = {
                id: this.questionID,
                survey: {code: this.pollCode}
            };

            this.voteService.setVotingResult(data).subscribe(
                () => {
                    this.showThanks = true;
                    this.checkLastQuestionAnswered();
                },
                (err: HttpErrorResponse) => {
                    this.processFailedVoting(err);
                }
            );
        }
    }

    private getChoiceById(id: number): Choice {
        return this.question.choices.find((item) => item.id === id);
    }

    selectChoice(choice: Choice) {
        if (this.multiChoiceAllowed) {
            this.checkboxes[choice.id] = !this.checkboxes[choice.id]
        } else {
            this.choiceValue = choice.position;
        }
    }
}
