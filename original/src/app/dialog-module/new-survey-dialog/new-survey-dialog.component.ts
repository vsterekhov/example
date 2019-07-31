import {Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Survey} from "../../model/survey.model";
import {SurveyService} from "../../services/survey.service";
import {DialogService} from "../dialog.service";

@Component({
    selector: 'app-new-survey-dialog',
    templateUrl: './new-survey-dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class NewSurveyDialogComponent implements OnInit {
    @Output() new: EventEmitter<Survey> = new EventEmitter<Survey>();
    survey: Survey;

    constructor(public surveyService: SurveyService, private dialogService: DialogService) {
    }

    ngOnInit() {
    }

    open(template) {
        this.survey = this.surveyService.getDefaultSurvey();
        this.dialogService.openDialog(template);
    }

    ok() {
        this.survey.name = this.survey.name.trim();
        this.new.emit({...this.survey});
        this.close();
    }

    close() {
        this.dialogService.closeDialog();
    }
}
