import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {Survey} from "../../model/survey.model";
import {SurveyService} from "../../services/survey.service";
import {DialogService} from "../dialog.service";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'app-copy-survey-dialog',
    templateUrl: './copy-survey-dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CopySurveyDialogComponent implements OnInit, OnDestroy {
    @Input()
    item: Survey;
    @Output()
    copy: EventEmitter<Survey> = new EventEmitter<Survey>();
    @ViewChild('template')
    template;
    survey: Survey;
    private copySurveySubs: Subscription;

    constructor(public surveyService: SurveyService, private dialogService: DialogService) {
    }

    ngOnInit() {
        this.copySurveySubs = this.dialogService.$copySurvey.subscribe(() => {
            if (this.item) {
                this.open(this.template);
            }
        });
    }

    ngOnDestroy() {
        this.copySurveySubs.unsubscribe();
    }

    open(template) {
        this.survey = this.surveyService.getDefaultSurvey();
        this.survey.name = this.item.name + " - копия";
        this.dialogService.openDialog(template);
    }

    ok() {
        this.survey.name = this.survey.name.trim();
        this.copy.emit({...this.survey});
        this.close();
    }

    close() {
        this.dialogService.closeDialog();
    }
}
