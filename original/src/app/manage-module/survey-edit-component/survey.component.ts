import {Component, DoCheck, Inject, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Survey} from "../../model/survey.model";
import {SurveyService} from "../../services/survey.service";
import {Question} from "../../model/question.model";
import {QuestionTypes} from "../../model/question.type";
import {QuestionService} from "../../services/question.service";
import {HasPosition} from "../../model/has-position.model";
import {AlertService} from "../../services/alert.service";
import {mergeMap} from "rxjs/operators/mergeMap";
import {DragulaService} from "ng2-dragula";
import {Subscription} from "rxjs/Subscription";
import {NgModel} from "@angular/forms";
import {DOCUMENT} from "@angular/common";

@Component({
    selector: 'app-survey',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit, DoCheck, OnDestroy {
    waitSurvey = true;
    survey: Survey;
    surveyInit: string;
    change = false;
    questionTypes = QuestionTypes;
    selectedQuestion: Question;
    @ViewChild('surveyInput')
    surveyInput: NgModel;
    dragulaSubscription = new Subscription();

    constructor(private readonly router: Router, private readonly route: ActivatedRoute,
                public surveyService: SurveyService, private readonly questionService: QuestionService,
                private readonly alertService: AlertService, private readonly dragulaService: DragulaService,
                @Inject(DOCUMENT) private readonly document: Document) {

        console.log(this.dragulaService.dropModel("questions"));
        this.dragulaSubscription.add(this.dragulaService.dropModel("questions").subscribe(({sourceModel}) => {
            sourceModel.forEach((model, index) => {
                model.position = index;
            });

            this.survey.questions = sourceModel;
        }));
    }

    ngDoCheck() {
        if (this.surveyInit && !this.change) {
            this.change = JSON.stringify(this.survey) !== this.surveyInit;
        }
    }

    ngOnInit() {
        this.document.getElementById("rosatom-header").style.minWidth = "300px";
        this.route.params.pipe(mergeMap((params: Params) => {
            this.waitSurvey = true;

            return this.surveyService.getById(params['surveyId']);
        }))
            .subscribe((survey: Survey) => {
                this.waitSurvey = false;
                this.survey = survey;
                this.surveyInit = JSON.stringify(this.survey);
            });
        this.surveyService.deleteQuestionEvent.subscribe(() => {
            this.surveyService.deleteSelectedPositionedItem(this.survey.questions, this.selectedQuestion);
            this.selectedQuestion = undefined;
            this.surveyService.deselectChoiceEvent.next(true);
        });
    }

    onSelectQuestion(question: Question) {
        if (this.selectedQuestion && !this.selectedQuestion.question.match(/^(?! )(?!.* $).+$/)) {
            return;
        }

        this.selectedQuestion = question;
        this.surveyService.deselectChoiceEvent.next(true);
    }

    onSave() {
        this.trimSpaces();
        this.surveyService.updateAndGet(this.survey).subscribe((survey: Survey) => {
            this.alertService.success("Опрос успешно сохранен");
            this.survey = survey;
            this.selectedQuestion = undefined;
            this.surveyService.deselectChoiceEvent.next(true);
            this.surveyInit = JSON.stringify(this.survey);
            this.change = false;
        });
    }

    onReturnToLibrary() {
        this.surveyService.setSurveyValidationToInitialState(true, true);
        this.router.navigate(['manage']);
    }


    onNewQuestion(question: Question) {
        question.position = this.survey.questions.length;
        this.survey.questions.push(question);
        this.selectedQuestion = question;
        this.surveyService.deselectChoiceEvent.next(true);
    }

    private trimSpaces() {
        this.survey.name = this.survey.name.trim();
        this.survey.questions.forEach((questionName, index) => {
            this.survey.questions[index].question = this.survey.questions[index].question.trim();
        })
    }

    ngOnDestroy() {
        this.dragulaSubscription.unsubscribe();
    }

    onPositionUp(question: HasPosition) {
        this.surveyService.positionUp(this.survey.questions, question);
    }

    onPositionDown(question: HasPosition) {
        this.surveyService.positionDown(this.survey.questions, question);
    }
}
