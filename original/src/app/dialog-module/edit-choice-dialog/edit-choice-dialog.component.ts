import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {SurveyService} from "../../services/survey.service";
import {DialogService} from "../dialog.service";
import {Choice} from "../../model/choice.model";

@Component({
    selector: 'app-edit-choice-dialog',
    templateUrl: './edit-choice-dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class EditChoiceDialogComponent implements OnInit {
    @Input() item: Choice;
    label: string;

    constructor(public surveyService: SurveyService, private dialogService: DialogService) {
    }

    ngOnInit() {
    }

    open(template) {
        if (this.item) {
            this.label = this.item.label;
            this.dialogService.openDialog(template);
        }
    }

    ok() {
        this.item.label = this.label.trim();
        this.close();
    }

    close() {
        this.dialogService.closeDialog();
    }
}
