import {Component, Input, ViewEncapsulation} from '@angular/core';
import {Question} from "../../../model/question.model";
import {QuestionTypes} from "../../../model/question.type";
import cloneDeep from "lodash-es/cloneDeep";
import {DialogService} from "../../../dialog-module/dialog.service";

@Component({
    selector: 'app-preview-dialog',
    templateUrl: './preview-dialog.component.html',
    styleUrls: ['./preview-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PreviewDialogComponent {
    @Input()
    question: Question;
    @Input()
    result: boolean;
    @Input()
    voting: boolean;
    questionTypes = QuestionTypes;
    previewQuestion: Question;

    votingTitle = 'Предпросмотр: окно голосования';
    resultTitle = 'Предпросмотр: окно результатов';

    constructor(private readonly dialogService: DialogService) {
    }

    open(template) {
        if (this.question) {
            this.setPreviewQuestion();
            this.dialogService.openDialog(template, {class: 'preview-dialog'});
        }
    }

    setPreviewQuestion() {
        this.previewQuestion = cloneDeep(this.question);

        if (QuestionTypes.isMultiChoices(this.question.type)) {
            this.previewQuestion.choices.forEach((choice, index) => choice.score = 2 + 10 * index);
        } else if (QuestionTypes.isWordCloud(this.question.type)) {
            this.previewQuestion.choices = [
                {label: 'Ответ 1', score: 1, position: null},
                {label: 'Ответ 2', score: 3, position: null},
                {label: 'Ответ 3', score: 5, position: null},
                {label: 'Ответ 4', score: 4, position: null},
                {label: 'Ответ 5', score: 2, position: null},
                {label: 'Ответ 6', score: 6, position: null},
                {label: 'Ответ 7', score: 8, position: null},
                {label: 'Ответ 8', score: 7, position: null},
                {label: 'Ответ 9', score: 9, position: null},
                {label: 'Ответ 10', score: 10, position: null}
            ];

        } else if (QuestionTypes.isOpenEnded(this.question.type)) {
            this.previewQuestion.choices = [
                {label: 'Вопрос от участника 1', score: null, position: null},
                {label: 'Вопрос от участника 2', score: null, position: null},
                {label: 'Вопрос от участника 3', score: null, position: null},
                {label: 'Вопрос от участника 4', score: null, position: null},
                {label: 'Вопрос от участника 5', score: null, position: null},
                {label: 'Вопрос от участника 6', score: null, position: null},
                {label: 'Вопрос от участника 7', score: null, position: null},
                {label: 'Вопрос от участника 8', score: null, position: null},
                {label: 'Вопрос от участника 9', score: null, position: null},
                {label: 'Вопрос от участника 10', score: null, position: null}
            ];
        }
    }

    close() {
        this.dialogService.closeDialog();
    }
}
