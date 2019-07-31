import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {SurveyService} from "../../services/survey.service";
import {Survey} from "../../model/survey.model";
import {AlertService} from "../../services/alert.service";
import {VoteService} from "../../services/vote.service";
import {fromEvent} from "rxjs/observable/fromEvent";
import {Subscription} from "rxjs/Subscription";
import {DOCUMENT} from "@angular/common";
import {HttpResponse} from "@angular/common/http";
import {DialogService} from "../../dialog-module/dialog.service";
import {ExportService} from "../../export-module/export.service";

@Component({
    selector: 'manage-comp',
    templateUrl: './manage-component.html',
    styleUrls: ['./manage-component.scss']
})
export class ManageComponent implements OnInit {
    surveys: Array<Survey>;
    selectedSurvey: Survey;
    isStatisticOpened = false;

    statisticWindowLeftCoord: number;
    statisticWindowTopCoord: number;

    globalClick: Subscription;

    sizeSmall = false;
    size800 = false;

    size = '0px';

    constructor(private readonly surveyService: SurveyService, private readonly voteService: VoteService,
                private readonly router: Router, private readonly route: ActivatedRoute,
                private readonly alertService: AlertService, @Inject(DOCUMENT) private readonly document: Document,
                private readonly exportService: ExportService, private readonly dialogService: DialogService) {
    }

    ngOnInit() {
        this.surveyService.getAllByPresenter().subscribe((surveys: Array<Survey>) => {
            this.surveys = surveys;
        });

        if (window.innerWidth < 670) {
            this.sizeSmall = true;
        } else if (window.innerWidth < 800) {
            this.size800 = true;
        }

        this.document.getElementById("rosatom-header").style.minWidth = "200px";
    }

    onCreateSurvey(survey) {
        this.surveyService.add(survey).subscribe((survey: Survey) => {
            this.router.navigate([survey.id], {relativeTo: this.route});
            this.alertService.success("Опрос успешно сохранен");
        }, () => {
            this.alertService.error("Произошла ошибка при сохранении опроса");
        });
    }

    checkVotesAndRespondentsNotNull(survey: Survey) {
        if (survey.votes === null) {
            this.selectedSurvey.votes = 0;
        }

        if (survey.respondents === null) {
            this.selectedSurvey.respondents = 0;
        }
    }

    chooseSurvey(survey: Survey) {
        this.selectedSurvey = survey;
        this.surveyService.surveyEvents.next(survey);
    }

    deleteSurvey() {
        for (const index in this.surveys) {
            if (this.surveys[index].id === this.selectedSurvey.id) {
                this.surveyService.delete(this.selectedSurvey.id).subscribe(() => {
                    this.surveys.splice(parseInt(index), 1);
                    this.selectedSurvey = undefined;
                    this.alertService.success("Опрос успешно удален");
                }, () => {
                    this.alertService.error("Произошла ошибка при удалении опроса");
                });

                return;
            }
        }
    }

    onEditSurvey() {
        if (this.selectedSurvey) {
            this.voteService.wasThePollStarted(this.selectedSurvey.code)
                .subscribe((started: boolean) => {
                    if (started) {
                        this.alertService.error("Невозможно отредактировать активный опрос. Завершите опрос и попробуйте снова.");
                    } else {
                        this.router.navigate([this.selectedSurvey.id], {relativeTo: this.route});
                    }
                });

        }
    }

    copySurvey(survey) {
        this.surveyService.copy(this.selectedSurvey.id, survey.name)
            .subscribe((copiedSurveyId: number) => {
                this.router.navigate([copiedSurveyId], {relativeTo: this.route});
            });
    }

    viewResultSurvey(survey: Survey) {
        if (survey.votes) {
            const extras: NavigationExtras = {
                queryParams: {
                    surveyID: survey.id,
                    result: true
                }
            };
            this.router.navigate(['view-vote'], extras);
        } else {
            this.alertService.error("Результаты голосования по опросу отсутствуют");
        }
    }

    showStatistic(survey: Survey, $event: MouseEvent) {
        if (!this.selectedSurvey) {
            this.chooseSurvey(survey);
        }

        if (!this.isStatisticOpened || this.isStatisticOpened && this.selectedSurvey !== survey) {
            this.chooseSurvey(survey);
            this.openStatistic($event);
        } else {
            this.closeStatistic();
            $event.stopPropagation();
        }
    }

    openStatistic($event) {
        this.voteService.getSurveyInfo(this.selectedSurvey.code).subscribe((survey: Survey) => {
            $event.stopPropagation();
            this.checkVotesAndRespondentsNotNull(survey);
            this.setTopLeftCoordinates($event);
            this.isStatisticOpened = !this.isStatisticOpened;
            if (!this.globalClick) {
                this.globalClick = fromEvent(document, 'click').subscribe(() => {
                    this.closeStatistic();
                });
            }
        });
    }

    closeStatistic() {
        this.isStatisticOpened = false;
        if (this.globalClick) {
            this.globalClick.unsubscribe();
            this.globalClick = undefined;
        }
    }

    setTopLeftCoordinates($event) {
        this.statisticWindowLeftCoord = $event.clientX - 280;
        this.statisticWindowTopCoord = $event.clientY;
    }

    exportSurveyResultsToEmail(): void {
        this.exportService.exportSurveyResultsToEmail();
    }

    exportSurveyResultsToFile(): void {
        this.exportService.exportSurveyResultsToFile();
    }

    onStopVoting(survey: Survey) {
        this.selectedSurvey = survey;

        this.surveyService.stop(this.selectedSurvey.id)
            .subscribe((httpResponse: HttpResponse<any>) => {
                if (httpResponse.ok) {
                    this.surveyService.surveyStopEvent.next();
                    this.selectedSurvey.voting = false;
                    this.alertService.success("Опрос успешно остановлен");
                }
            });
    }

    onCopySurvey() {
        this.dialogService.copySurvey();
    }

    onDeleteSurvey() {
        this.dialogService.deleteSurvey();
    }

    @HostListener('window:resize')
    onWindowResize() {
        if (window.innerWidth < 670) {
            this.document.getElementById("threeDots").style.width = "60px";
            this.sizeSmall = true;
            this.size800 = false;
        } else if (window.innerWidth < 800) {
            this.document.getElementById("threeDots").style.width = "220px";
            this.sizeSmall = false;
            this.size800 = true;
        } else {
            this.document.getElementById("threeDots").style.width = "220px";
            this.sizeSmall = false;
            this.size800 = false;
        }
    }

    runSurvey(survey: Survey) {
        this.selectedSurvey = survey;
        this.dialogService.runSurvey(survey);
    }

    continueSurvey(survey: Survey) {
        this.selectedSurvey = survey;
        this.dialogService.continueSurvey(survey);
    }

    onClickDropdown(event, voting, votes) {
        const coord = event.currentTarget.getBoundingClientRect();
        const coodrBorder = coord.top + coord.height;
        let ident;
        let sizeDropDown;

        if (voting) {
            sizeDropDown = 185;
        } else if (votes) {
            sizeDropDown = 216;
        } else {
            sizeDropDown = 154;
        }

        if (this.sizeSmall) {
            ident = coodrBorder - 96 + sizeDropDown;
        } else if (this.size800) {
            ident = coodrBorder - 74 + sizeDropDown;
        } else {
            ident = coodrBorder - 67 + sizeDropDown;
        }

        if (ident > window.innerHeight) {
            this.size = `-${coodrBorder + sizeDropDown - window.innerHeight + 5}px`;
        } else if (this.sizeSmall) {
            this.size = '-96px';
        } else if (this.size800) {
            this.size = '-74px';
        } else {
            this.size = '-67px';
        }
    }
}
