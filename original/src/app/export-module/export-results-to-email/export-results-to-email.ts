import {Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {Question} from "../../model/question.model";
import {ExportService} from "../export.service";
import {Survey} from "../../model/survey.model";
import {AlertService} from "../../services/alert.service";
import {Subscription} from "rxjs/Subscription";
import {DialogService} from "../../dialog-module/dialog.service";

@Component({
    selector: 'app-export-results-to-email',
    templateUrl: './export-results-to-email.html',
    encapsulation: ViewEncapsulation.None
})
export class ExportResultsToEmail implements OnInit, OnDestroy {
    @Input()
    survey: Survey;
    @Input()
    question: Question;
    @ViewChild('template')
    template;
    public email: string;

    private subscriptions: Subscription[] = [];

    constructor(public exportService: ExportService, private readonly dialogService: DialogService,
                private readonly alertService: AlertService) {
    }

    ngOnInit() {
        this.subscriptions.push(this.exportService.$exportSurveyResultsToEmail.subscribe(() => {
            if (this.survey && !isNaN(this.survey.id)) {
                this.open();
            }
        }));
    }

    open() {
        this.email = null;
        this.dialogService.openDialog(this.template);
    }

    public ok(): void {
        this.exportService.exportSurveyResultsToCSV(this.survey.id, this.email).subscribe(() => {
            this.onExportSuccess();
        }, () => {
            this.onExportError();
        });

        this.close();
    }

    onExportSuccess() {
        this.alertService.success('Результаты высланы на e-mail: ' + this.email);
    }

    onExportError() {
        this.alertService.error(`Не удалось отправить результаты на e-mail: ${this.email}, если адрес электронной `
            + `почты указан верно - сообщите о проблеме администратору системы`);
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
