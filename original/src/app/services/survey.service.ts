import orderBy from "lodash-es/orderBy";
import find from "lodash-es/find";
import remove from "lodash-es/remove";
import cloneDeep from "lodash-es/cloneDeep";

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Survey} from "../model/survey.model";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {map} from "rxjs/operators/map";
import {switchMap} from "rxjs/operators/switchMap";
import {SurveyPaces} from "../model/survey.type";
import {Question} from "../model/question.model";
import {HasPosition} from "../model/has-position.model";

export declare type SurveyValidation = { isQuestionNameValid?: boolean, isSurveyNameValid?: boolean };

@Injectable()
export class SurveyService {
    private readonly url = '/socs/api/survey';
    private readonly httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
    private readonly httpOptionsResponse = Object.assign({observe: "response"}, this.httpOptions);

    surveyEvents: Subject<Survey> = new Subject<Survey>();
    surveyStopEvent: Subject<Survey> = new Subject<Survey>();
    deleteQuestionEvent: Subject<boolean> = new Subject<boolean>();
    deselectChoiceEvent: Subject<boolean> = new Subject<boolean>();

    nameValidationRegex = /^\s*(\S+\s*)+$/g;
    nameValidationEvent: Subject<SurveyValidation> = new Subject<SurveyValidation>();
    surveyValidation: SurveyValidation = {
        isSurveyNameValid: true,
        isQuestionNameValid: true
    };

    constructor(private readonly http: HttpClient) {
        this.nameValidationEvent.subscribe((surveyValidation: SurveyValidation) => {
            Object.assign(this.surveyValidation, surveyValidation);
        });
    }

    getDefaultSurvey() {
        return {
            name: '',
            type: SurveyPaces.PRESENTER.propName,
            voting: false,
            presenter: null
        };
    }

    getAllByPresenter(): Observable<Array<Survey>> {
        return this.http.get<Array<Survey>>(`${this.url}/getAllByPresenter`);
    }

    add(survey: Survey): Observable<Survey> {
        return this.http.post<Survey>(`${this.url}/add`, survey, this.httpOptions);
    }

    update(survey: Survey): Observable<HttpResponse<any>> {
        return this.http.put<any>(`${this.url}/update`, this.serializeSurvey(cloneDeep(survey)), this.httpOptions);
    }

    updateAndGet(survey: Survey): Observable<Survey> {
        return this.update(survey).pipe(switchMap(() => {
            return this.getById(survey.id);
        }));
    }

    copy(surveyId: number, newName: string): Observable<number> {
        return this.http.post<number>(`${this.url}/copy`, {
            surveyId,
            newName
        }, this.httpOptions);
    }

    delete(surveyId: number) {
        return this.http.delete(`${this.url}/${surveyId}`);
    }

    getById(id): Observable<Survey> {
        return this.http.get<Survey>(`${this.url}/${id}`, this.httpOptions).pipe(map(this.deserializeSurvey));
    }

    deserializeSurvey(survey: Survey): Survey {
        survey.questions.forEach((question: Question) => {
            question.settings = JSON.parse(question.settings);
        });

        return survey;
    }

    serializeSurvey(survey: Survey): Survey {
        survey.questions.forEach((question: Question) => {
            question.settings = JSON.stringify(question.settings);
        });

        return survey;
    }

    run(surveyId: number, resetResults: boolean): Observable<Survey> {
        return this.http.post<Survey>(`${this.url}/run?surveyId=${surveyId}&resetResults=${resetResults}`,
            this.httpOptions);
    }

    stop(surveyId): Observable<HttpResponse<any>> {
        return this.http.put<any>(`${this.url}/stop?surveyId=${surveyId}`, null, this.httpOptionsResponse);
    }

    changeActiveQuestion(activeQuestionId: number, surveyId: number): Observable<Question> {
        return this.http.put<Question>(`${this.url}/changeActiveQuestion?activeQuestionId=${activeQuestionId}`
            + `&id=${surveyId}`, this.httpOptions);
    }

    order(collection: any[], prop = 'position', order = 'asc') {
        return orderBy(collection, prop, order);
    }

    find(collection: any[], propValue: any, prop = 'position') {
        const predicate = {};

        predicate[prop] = propValue;

        return find(collection, predicate);
    }

    deleteSelectedPositionedItem(collection: HasPosition[], selectedItem: HasPosition) {
        collection.filter((item: HasPosition) => item.position > selectedItem.position)
            .forEach((item: HasPosition) => {
                item.position--;

                return item;
            });

        remove(collection, (item: HasPosition) => {
            return item === selectedItem;
        });
    }

    positionUp(collection: HasPosition[], item: HasPosition) {
        if (item.position !== 0) {
            const prevItem = this.find(collection, item.position - 1);

            prevItem.position = item.position;
            item.position = item.position - 1;
        }
    }

    positionDown(collection: HasPosition[], item: HasPosition) {
        if (item.position !== collection.length - 1) {
            const nextItem = this.find(collection, item.position + 1);

            nextItem.position = item.position;
            item.position = item.position + 1;
        }
    }

    getSurveyRespondentsAndActiveQuestionVotes(surveyCode: number, questionId: number): Observable<Survey> {
        return this.http.get<Survey>(`${this.url}/statistic?surveyCode=${surveyCode}&questionId=${questionId}`,
            this.httpOptions);
    }

    checkOwner(surveyId: number): Observable<boolean> {
        return this.http.get<boolean>(`${this.url}/${surveyId}/checkOwner`, this.httpOptions);
    }

    setSurveyValidationToInitialState(isSurveyNameValid: boolean, isQuestionNameValid: boolean) {
        return this.surveyValidation = {
            isQuestionNameValid: isSurveyNameValid,
            isSurveyNameValid: isQuestionNameValid
        };
    }
}
