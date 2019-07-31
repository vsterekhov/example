import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Question} from "../../model/question.model";
import {QuestionService} from "../../services/question.service";
import {SurveyService} from "../../services/survey.service";
import {DialogService} from "../dialog.service";

@Component({
    selector: 'app-delete-question-dialog',
    templateUrl: './delete-question-dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DeleteQuestionDialogComponent implements OnInit {
    @Input() item: Question;
    @Output() delete: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private questionService: QuestionService,
                public surveyService: SurveyService,
                private dialogService: DialogService) {
    }

    ngOnInit() {
    }

    open(template) {
        if (this.item) {
            if (this.questionService.canDelete(this.item)) {
                this.ok();
            } else {
                this.dialogService.openDialog(template);
            }
        }
    }

    ok() {
        this.delete.emit(true);
        this.close();
    }

    close(){
        this.dialogService.closeDialog();
    }
}
