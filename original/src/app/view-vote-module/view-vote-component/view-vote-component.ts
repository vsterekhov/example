import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef, Inject,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Params, Router} from "@angular/router";
import {HttpResponse} from "@angular/common/http";

import {Subscription} from "rxjs/Subscription";
import {interval} from "rxjs/observable/interval";
import {timer} from "rxjs/observable/timer";
import {switchMap} from "rxjs/operators/switchMap";

import {SurveyService} from "../../services/survey.service";
import {QuestionService} from "../../services/question.service";
import {Survey} from "../../model/survey.model";
import {Question} from "../../model/question.model";
import {QuestionTypes} from "../../model/question.type";
import {ChartAction, ChartActions} from "../../chart/chart.types";
import {DOCUMENT} from "@angular/common";

@Component({
    selector: 'view-vote-comp',
    templateUrl: './view-vote-component.html',
    styleUrls: ['./view-vote-component.scss']
})
export class ViewVoteComponent implements OnInit, OnDestroy, AfterViewInit {
    hideResults = true;
    survey: Survey;
    surveyStatistic: Survey;
    slideIndex: number;
    lastSlide = false;
    chartAction: ChartAction;
    styleContainer: number;

    private updateVotesCountSubscription: Subscription;
    private updateActiveQuestionSubscription: Subscription;

    @ViewChild('questionTitleContainer')
    questionTitleContainer: ElementRef;

    constructor(private readonly router: Router, private readonly route: ActivatedRoute,
                private readonly surveyService: SurveyService, private readonly questionService: QuestionService,
                private readonly rd: Renderer2, private readonly cdRef: ChangeDetectorRef,
                @Inject(DOCUMENT) private readonly document: Document) {
    }

    ngOnInit() {
        this.document.getElementById("rosatom-header").style.minWidth = "600px";

        this.route.queryParams.subscribe((params: Params) => {
            const surveyId = params['surveyID'];
            const activeLast = params['activeLast'] === 'true';
            const result = params['result'] === 'true';

            this.stopUpdateData();

            this.surveyService.getById(surveyId).subscribe((survey: Survey) => {
                this.initSurvey(survey, activeLast, result);

                this.getSurveyRespondentsAndActiveQuestionVotes();

                if (survey.voting && !this.hideResults) {
                    this.startUpdateActiveQuestion();
                }
            });

            this.surveyService.surveyStopEvent.subscribe(() => {
                this.stopUpdateData();
            });
        });
    }

    ngAfterViewInit() {
        this.cdRef.detectChanges();
    }

    public getHeightView() {
        if (!this.questionTitleContainer) {
            return '10%';
        }

        return `${55 + this.questionTitleContainer.nativeElement.offsetHeight}px`;
    }

    initSurvey(survey: Survey, activeLast: boolean, result: boolean) {
        this.survey = survey;
        this.surveyService.surveyEvents.next(survey);
        this.hideResults = !result;

        this.initActiveQuestion(survey, activeLast);
    }

    initActiveQuestion(survey: Survey, activeLast: boolean) {
        let position: number;

        if (survey.voting) {
            for (const question of survey.questions) {
                if (survey.activeQuestionId === question.id) {
                    position = question.position;

                    break;
                }
            }
        } else if (activeLast) {
            position = survey.questions[survey.questions.length - 1].position;
        } else {
            position = survey.questions[0].position;
        }

        this.setActiveQuestion(position);
    }

    questionChanged(question: Question) {
        const activeQuestion = this.getActiveQuestion();

        if (activeQuestion.choices.length !== question.choices.length) {
            return true;
        }

        const activeQuestionChoices = [...activeQuestion.choices];
        activeQuestionChoices.sort((a, b) => a.id - b.id);
        const activeQuestionChoicesUpdate = [...question.choices];
        activeQuestionChoicesUpdate.sort((a, b) => a.id - b.id);

        if (activeQuestion.choices.some((element, i) => {
            return activeQuestionChoices[i].score !== activeQuestionChoicesUpdate[i].score;
        })) {
            return true;
        }

        return false;
    }

    setActiveQuestion(slideIndex: number) {
        this.slideIndex = slideIndex;

        if (this.survey.voting) {
            this.startUpdateSurveyStatistic();
        }

        this.updateView(true);
        this.setClass(slideIndex);
    }

    setClass(slideIndex) {
        let l = this.survey.questions[slideIndex].question.length;

        for (let choice of this.survey.questions[slideIndex].choices) {
            l += choice.label.length;
        }

        this.styleContainer = 100 * Math.pow(650 / l, 0.25);
    }

    updateView(init?: boolean) {
        if (!this.hideResults) {
            if (init) {
                this.chartAction = ChartActions.DRAW;
            } else {
                this.chartAction = ChartActions.UPDATE;
            }
        }
    }

    private updateQuestion(question: Question) {
        this.survey.questions[question.position].choices = question.choices;
    }

    getQuestionBySlideIndex(slideIndex: number) {
        return this.survey.questions[slideIndex];
    }

    getActiveQuestion() {
        return this.survey.questions[this.slideIndex];
    }

    getActiveQuestionId() {
        return this.getActiveQuestion().id;
    }

    getActiveQuestionType() {
        return this.getActiveQuestion().type;
    }

    getActiveQuestionChoices() {
        return this.survey.questions[this.slideIndex].choices;
    }

    getActiveQuestionSettings(): boolean | null {
        const activeQuestion = this.getActiveQuestion();

        if (activeQuestion && activeQuestion.settings) {
            return (typeof activeQuestion.settings === 'string') ?
                JSON.parse(activeQuestion.settings) : activeQuestion.settings;
        }

        return null;
    }


    getSwitchViewTitle() {
        return this.hideResults ? 'Результаты' : 'Вопрос';
    }

    switchView() {
        this.hideResults = !this.hideResults;

        if (!this.hideResults) {
            this.updateView(true);
        }

        if (this.survey.voting) {
            if (this.hideResults) {
                this.stopUpdateActiveQuestion();
            } else {
                this.startUpdateActiveQuestion();
            }
        }
    }

    showResults() {
        this.setActiveQuestion(0);
        this.surveyService.getSurveyRespondentsAndActiveQuestionVotes(this.survey.code, this.survey.questions[0].id)
            .subscribe(surveyStatistic => {
                this.surveyStatistic = surveyStatistic;
            });
        this.lastSlide = false;
        this.hideResults = false;

        this.updateView(true);
    }

    private changeActiveQuestion(move?: string) {
        let newSlideIndex: number;

        switch (move) {
            case 'prev':
                newSlideIndex = this.slideIndex - 1;

                break;
            case 'next':
                newSlideIndex = this.slideIndex + 1;

                break;
            default:
                return;
        }

        const newActiveQuestion = this.getQuestionBySlideIndex(newSlideIndex);

        if (this.survey.voting) {
            this.surveyService.changeActiveQuestion(newActiveQuestion.id, this.survey.id).subscribe(() => {
                this.surveyService.getSurveyRespondentsAndActiveQuestionVotes(this.survey.code, newActiveQuestion.id)
                    .subscribe(surveyStatistic => {
                        this.surveyStatistic = surveyStatistic;

                        if (!surveyStatistic.votes && !this.hideResults) {
                            this.switchView();
                        }

                        this.setActiveQuestion(newSlideIndex);
                    });
            });
        } else {
            this.setActiveQuestion(newSlideIndex);
            this.getSurveyRespondentsAndActiveQuestionVotes();
        }
    }

    showAdditionalMessage(): boolean {
        return true;
    }

    hasData() {
        return this.survey && this.survey.questions;
    }

    isMultiChoices(): boolean {
        return this.hasData() && QuestionTypes.isMultiChoices(this.getActiveQuestionType());
    }

    isOpenEnded(): boolean {
        return this.hasData() &&
            QuestionTypes.isOpenEnded(this.getActiveQuestionType());
    }

    isWordCloud(): boolean {
        return this.hasData() &&
            QuestionTypes.isWordCloud(this.getActiveQuestionType());
    }

    isVoting(): boolean {
        return this.hasData() && this.survey.voting;
    }

    isFirstItem() {
        return this.slideIndex === 0 && !this.lastSlide && this.hasData();
    }

    isLastItem() {
        return this.hasData() && this.slideIndex === this.survey.questions.length - 1;
    }

    prevCtrlDisabled() {
        return this.isFirstItem() || this.lastSlide && !this.isVoting();
    }

    nextCtrlDisabled() {
        return this.isVoting() && this.lastSlide || !this.isVoting() && this.isLastItem();
    }

    onPrevClick() {
        if (this.lastSlide) {
            this.lastSlide = false;
        } else if (!this.isFirstItem()) {
            this.lastSlide = false;
            this.changeActiveQuestion('prev');
        }
    }

    onNextClick() {
        if (!this.isLastItem()) {
            this.changeActiveQuestion('next');
        } else if (this.isVoting()) {
            this.lastSlide = true;
        }
    }


    onStopVoting() {
        this.surveyService.stop(this.survey.id).subscribe((httpResponse: HttpResponse<any>) => {
            if (httpResponse.ok) {
                const extras: NavigationExtras = {
                    queryParams: {
                        surveyID: this.survey.id,
                        result: true,
                        activeLast: true
                    }
                };

                this.stopUpdateData();

                this.router.navigate(['view-vote'], extras);
            }
        });
    }

    stopUpdateData() {
        this.stopUpdateSurveyStatistic();
        this.stopUpdateActiveQuestion();
    }

    ngOnDestroy() {
        this.stopUpdateData();
    }

    private startUpdateSurveyStatistic() {
        this.stopUpdateSurveyStatistic();

        this.updateVotesCountSubscription =
            interval(5000).pipe(switchMap(() =>
                this.surveyService.getSurveyRespondentsAndActiveQuestionVotes(this.survey.code,
                    this.getActiveQuestionId()))).subscribe(surveyStatistic => {
                this.surveyStatistic = surveyStatistic;
            });
    }

    private stopUpdateSurveyStatistic() {
        if (this.updateVotesCountSubscription) {
            this.updateVotesCountSubscription.unsubscribe();
            this.updateVotesCountSubscription = undefined;
        }
    }

    private startUpdateActiveQuestion() {
        this.stopUpdateActiveQuestion();

        this.updateActiveQuestionSubscription = timer(0, 5000)
            .pipe(switchMap(() => this.questionService.get(this.getActiveQuestionId())))
            .subscribe(question => {
                if (question.id === this.getActiveQuestionId()) {
                    question.settings = JSON.parse(question.settings);

                    if (this.questionChanged(question)) {
                        this.updateQuestion(question);
                        this.updateView();
                    }
                }
            });
    }

    private stopUpdateActiveQuestion() {
        if (this.updateActiveQuestionSubscription) {
            this.updateActiveQuestionSubscription.unsubscribe();
            this.updateActiveQuestionSubscription = undefined;
        }
    }

    private getSurveyRespondentsAndActiveQuestionVotes() {
        this.surveyService.getSurveyRespondentsAndActiveQuestionVotes(this.survey.code, this.getActiveQuestionId())
            .subscribe(surveyStatistic => {
                this.surveyStatistic = surveyStatistic;
            });
    }
}
