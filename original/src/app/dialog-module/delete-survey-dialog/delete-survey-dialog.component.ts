import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {Survey} from "../../model/survey.model";
import {DialogService} from "../dialog.service";
import {Subscription} from "rxjs/Subscription";
import {VoteService} from "../../services/vote.service";
import {AlertService} from "../../services/alert.service";
import {filter} from "rxjs/operators/filter";
import {switchMap} from "rxjs/operators/switchMap";

@Component({
    selector: 'app-delete-survey-dialog',
    templateUrl: './delete-survey-dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DeleteSurveyDialogComponent implements OnInit, OnDestroy {
    @Input()
    item: Survey;
    @Output()
    delete: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('template')
    template;
    survey: Survey;
    private deleteSurveySubs: Subscription;

    constructor(private readonly dialogService: DialogService, private readonly voteService: VoteService,
                private readonly alertService: AlertService) {
    }

    ngOnInit() {
        this.deleteSurveySubs = this.dialogService.$deleteSurvey
            .pipe(
                filter(() => this.item && !isNaN(this.item.code) && isFinite(this.item.code)),
                switchMap(() => this.voteService.wasThePollStarted(this.item.code))
            )
            .subscribe((started: boolean) => {
                if (started) {
                    this.alertService.error("Невозможно удалить активный опрос. Завершите опрос и попробуйте снова.");
                } else {
                    this.open(this.template);
                }
            });
    }

    ngOnDestroy() {
        this.deleteSurveySubs.unsubscribe();
    }

    open(template) {
        this.dialogService.openDialog(template, {class: 'delete-survey'});
    }

    ok() {
        this.delete.emit();
        this.close();
    }

    close() {
        this.dialogService.closeDialog();
    }
}
