import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Survey} from "../../model/survey.model";
import {SurveyService} from "../../services/survey.service";
import {DialogService} from "../dialog.service";
import {AlertService} from "../../services/alert.service";
import {NavigationExtras, Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'app-run-survey-dialog',
    templateUrl: './run-survey-dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class RunSurveyDialogComponent implements OnInit, OnDestroy {
    survey: Survey;
    resetResults = false;
    @ViewChild('template')
    template;

    private subscriptions: Subscription[] = [];

    constructor(private readonly alertService: AlertService, private readonly router: Router,
                private readonly surveyService: SurveyService, private readonly dialogService: DialogService) {
    }

    ngOnInit() {
        this.subscriptions.push(this.dialogService.$runSurvey
            .subscribe((survey: Survey) => {
                this.survey = survey;
                this.resetResults = false;
                this.open();
            }));

        this.subscriptions.push(this.dialogService.$continueSurvey
            .subscribe((survey: Survey) => {
                this.survey = survey;
                this.resetResults = false;
                this.ok();
            }));
    }

    open() {
        if (this.survey.questionsNumber !== 0) {
            if (!this.survey.voting && !this.survey.votes) {
                this.resetResults = true;
                this.ok();
            } else {
                this.dialogService.openDialog(this.template, {class: 'run-survey-dialog'});
            }
        } else {
            this.alertService.error("Опрос не содержит вопросов. Невозможно запустить голосование");
        }
    }

    ok() {
        this.surveyService.run(this.survey.id, this.resetResults)
            .subscribe(() => {
                const extras: NavigationExtras = {
                    queryParams: {
                        surveyID: this.survey.id
                    }
                };

                this.router.navigate(['view-vote'], extras);
            });

        this.close();
    }

    close() {
        this.dialogService.closeDialog();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
        this.subscriptions = [];
    }
}
