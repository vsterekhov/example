import {OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";

import {VoteService} from "../services/vote.service";
import {Survey} from "../model/survey.model";
import {Subscription} from "rxjs/Subscription";
import {Question} from "../model/question.model";
import {HttpErrorResponse} from "@angular/common/http";

export abstract class ConnectableComponent implements OnInit, OnDestroy {
    protected router: Router;
    protected activatedRoute: ActivatedRoute;
    protected voteService: VoteService;

    protected pollCode: number;
    protected questionID: number;
    public question: Question;
    currentSurveyInfo: Survey;

    newActiveQuestionId: number;
    checkSurveyStateSubscription: Subscription;

    checkSurveyStateInterval;

    voting: { finished?: boolean, success?: boolean, errorMessage?: string } = {};
    showThanks = false;
    alreadyAnswered = false;
    surveyPassed = false;

    constructor(router: Router, activatedRoute: ActivatedRoute, voteService: VoteService) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.voteService = voteService;
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.pollCode = +params.surveyCode;
            this.questionID = +params.questionID;

            this.initPropertiesByDefault();

            this.checkParticipation()
                .subscribe((entered) => {
                    if (!entered) {
                        this.leaveVoting();
                    } else {
                        this.voteService.getQuestion(this.questionID).subscribe((question: Question) => {
                            this.currentSurveyInfo = question.survey;

                            this.checkQuestionAnswered()
                                .subscribe((answered) => {
                                    this.alreadyAnswered = answered;
                                    this.processQuestion(question);

                                    if (answered) {
                                        this.checkLastQuestionAnswered();
                                    }
                                });

                        });

                    }
                });

        });
    }

    abstract initPropertiesByDefault();

    abstract processQuestion(question: Question);

    private navigateToTheNextQuestion() {
        this.initPropertiesByDefault();
        this.voteService.navigateToActiveQuestion(this.newActiveQuestionId, this.pollCode, this.router);
    }

    leaveVoting() {
        this.router.navigate(['vote']);
    }

    startCheckSurveyState(pollCode: number) {
        this.checkSurveyStateInterval = setInterval(() => {
            this.checkSurveyStateSubscription = this.voteService.getSurveyInfo(pollCode).subscribe((survey: Survey) => {
                if (this.newActiveQuestionId !== survey.activeQuestionId) {
                    this.newActiveQuestionId = survey.activeQuestionId;
                    this.navigateToTheNextQuestion();
                }

                this.processFinishedVoting(survey.voting);
            });
        }, 5000);
    }

    private processFinishedVoting(voting: boolean) {
        if (!voting) {
            this.disableCheckSurveyState();
        }

        this.voting = {
            finished: !voting,
            success: true
        };
    }

    processFailedVoting(err: HttpErrorResponse) {
        this.voting = {
            finished: true,
            success: true,
            errorMessage: err.error
        };
    }

    disableCheckSurveyState() {
        clearInterval(this.checkSurveyStateInterval);
        this.checkSurveyStateInterval = undefined;

        if (this.checkSurveyStateSubscription) {
            this.checkSurveyStateSubscription.unsubscribe();
            this.checkSurveyStateSubscription = undefined;
        }
    }

    private checkQuestionAnswered() {
        return this.voteService.checkQuestionAnswered(this.questionID);
    }

    private checkParticipation() {
        return this.voteService.checkParticipation(this.pollCode);
    }

    checkLastQuestionAnswered() {
        if (this.question.position === this.currentSurveyInfo.questionsNumber - 1) {
            this.surveyPassed = true;
            this.disableCheckSurveyState();
        }
    }

    canAnswer() {
        return !this.showThanks && !this.alreadyAnswered && !this.surveyPassed;
    }

    ngOnDestroy() {
        this.disableCheckSurveyState();
    }

}
