import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

import {Observable} from "rxjs/Observable";
import {from} from "rxjs/observable/from";

import {QuestionTypes} from "../model/question.type";
import {Question} from "../model/question.model";
import {Choice} from "../model/choice.model";

@Injectable()
export class QuestionService {
    private readonly url = 'api/question';
    private readonly httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private readonly http: HttpClient) {
    }

    getDefaultQuestion(questionValue = ''): Question {
        return {
            question: questionValue,
            type: QuestionTypes.MULTI_CHOICES.propName,
            position: 0,
            choices: [],
            settings: {},
            votesNumber: 0
        };
    }

    getDefaultChoice(): Choice {
        return {
            label: '',
            position: 0,
            score: 0
        };
    }

    get(id: number): Observable<Question> {
        return this.http.get<Question>(`${this.url}/${id}`, this.httpOptions);
    }

    hasAnswers(question: Question): Observable<boolean> {
        if (question.id) {
            return this.http.get<boolean>(`${this.url}/${question.id}/hasAnswers`, this.httpOptions);
        } else {
            return from([false]);
        }
    }

    canDelete(question: Question): boolean {
        if (question.id && Array.isArray(question.choices)) {
            return !question.choices.some((choice) => {
                if (QuestionTypes.isMultiChoices(question.type) && choice.score > 0 ||
                    QuestionTypes.isOpenEnded(question.type) ||
                    QuestionTypes.isWordCloud(question.type)) {
                    return true;
                }
            });
        }

        return true;
    }
}
