import {Component, OnInit, Renderer2} from '@angular/core';
import {Router} from "@angular/router";
import {SurveyService} from "../services/survey.service";
import {SecurityService} from "../services/security.service";
import {Survey} from "../model/survey.model";
import {HttpResponse} from "@angular/common/http";
import {AlertService} from "../services/alert.service";
import {ExportService} from "../export-module/export.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    surveyCode: number;
    surveyName: string;
    isSecondPartSurveyNameShowed: boolean;
    chosenSurveyViewVoteUrl: string;
    public currentUser;
    voting: boolean;
    survey: Survey;

    constructor(public router: Router, public surveyService: SurveyService, private readonly alertService: AlertService,
                private readonly exportService: ExportService, public securityService: SecurityService,
                private readonly renderer: Renderer2) {
    }

    ngOnInit() {
        this.voting = true;

        this.surveyService.surveyEvents
            .subscribe((survey: Survey) => {
                this.survey = survey;
                this.chosenSurveyViewVoteUrl = "/view-vote?surveyID=" + survey.id;

                this.surveyName = survey.name;
                this.surveyCode = survey.code;
                if (this.router.url.startsWith('/view-vote')) {
                    this.redrawSurveyNameAtResize();
                }
                this.voting = survey.voting;
            });
    }

    redrawSurveyNameAtResize() {
        this.isSecondPartSurveyNameShowed = false;

        const surveyNameContainer = document.getElementById("survey-name-container");

        this.renderer.setProperty(surveyNameContainer, 'innerText', '');

        const surveyNameContainerWidth = surveyNameContainer.getBoundingClientRect().width;

        //строим временную DOM модель, состоящую из последовательности букв названия опроса, каждая из которых
        // помещается в <span>
        const temporaryDivElem = this.renderer.createElement('div');

        this.renderer.appendChild(surveyNameContainer, temporaryDivElem);

        //разделяем строку на массив символов, чтобы затем считать ширину каждого символа
        let surveyNameFirstPartTmp = '';
        let surveyNameSecondPartTmp = '';
        let firstSurveyNamePartWidth = 0;
        let secondSurveyNamePartWidth = 0;

        //создаем временный span и помещаем туда одну букву, чтобы затем узнать его ширину
        //затем удаляем его из разметки
        for (const value of this.surveyName.split('')) {
            const temporarySpanElem = this.renderer.createElement('span');

            let character;

            if (value === ' ') {
                //случай обработки пробелов, тк span считает ширину пробела как 0
                character = this.renderer.createText('_');
            } else {
                character = this.renderer.createText(value);
            }

            this.renderer.appendChild(temporarySpanElem, character);
            this.renderer.appendChild(temporaryDivElem, temporarySpanElem);

            const temporarySpanElemWidth = temporarySpanElem.getBoundingClientRect().width;

            if (!this.isSecondPartSurveyNameShowed &&
                surveyNameContainerWidth > firstSurveyNamePartWidth + temporarySpanElemWidth + 115) {
                this.isSecondPartSurveyNameShowed = false;
                surveyNameFirstPartTmp += value;
                firstSurveyNamePartWidth += temporarySpanElemWidth;
            } else if (surveyNameContainerWidth > secondSurveyNamePartWidth + temporarySpanElemWidth + 115) {
                this.isSecondPartSurveyNameShowed = true;
                surveyNameSecondPartTmp += value;
                secondSurveyNamePartWidth += temporarySpanElemWidth;
            } else {
                //последние 3 буквы заменяем '...' в случае необходимости
                surveyNameSecondPartTmp = surveyNameSecondPartTmp.slice(0, surveyNameSecondPartTmp.length - 3) + '...';

                break;
            }

            this.renderer.setStyle(temporarySpanElem, "display", "none");
        }

        this.renderer.removeChild(surveyNameContainer, temporaryDivElem);

        //создаем разметку для первой и второй строк названия опроса
        const surveyNameFirstPartContainer = this.renderer.createElement('div');

        this.renderer.appendChild(surveyNameContainer, surveyNameFirstPartContainer);
        this.renderer.setProperty(surveyNameFirstPartContainer, 'innerText', surveyNameFirstPartTmp);

        if (this.isSecondPartSurveyNameShowed) {
            const surveyNameSecondPartContainer = this.renderer.createElement('div');

            this.renderer.appendChild(surveyNameContainer, surveyNameSecondPartContainer);
            this.renderer.setProperty(surveyNameSecondPartContainer, 'innerText', surveyNameSecondPartTmp);
        } else {
            this.renderer.addClass(surveyNameFirstPartContainer, 'flex-item-align');
        }
    }

    checkCurrentUser() {
        const item = localStorage.getItem('username');

        if (!item) {
            return false;
        }

        this.currentUser = item;

        return true;
    }

    routeToManage() {
        this.voting = true;
        this.router.navigate(['manage']);
    }

    exportSurveyResultsToFile(): void {
        this.exportService.exportSurveyResultsToFile();
    }

    onStopVoting() {
        this.surveyService.stop(this.survey.id)
            .subscribe((httpResponse: HttpResponse<any>) => {
                if (httpResponse.ok) {
                    this.surveyService.surveyStopEvent.next();
                    this.voting = false;
                    this.alertService.success("Опрос успешно остановлен");
                }
            });
    }
}
