import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Question} from "../model/question.model";
import {Choice} from "../model/choice.model";
import {QuestionTypes} from "../model/question.type";
import {Router} from "@angular/router";
import {Survey} from "../model/survey.model";

declare var require: any;

@Injectable()
export class VoteService {
    private readonly baseURL = '/socs/api/vote';
    private readonly httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
    private readonly httpOptionsResponse = Object.assign({observe: "response"}, this.httpOptions);

    constructor(private readonly http: HttpClient) {
    }

    wasThePollStarted(code: number): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseURL}/survey/started/${code}`, this.httpOptions);
    }

    checkParticipation(code: number): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseURL}/checkParticipation/${code}`, this.httpOptions);
    }

    increaseRespondentsNumber(code: number): Observable<number> {
        return this.http.put<number>(`${this.baseURL}/increase/respondents`, code, this.httpOptions);
    }

    getActiveQuestion(pollCode: number): Observable<Question> {
        return this.http.get<Question>(`${this.baseURL}/survey/${pollCode}/active`, this.httpOptions);
    }

    getSurveyInfo(pollCode: number): Observable<Survey> {
        return this.http.get<Survey>(`${this.baseURL}/survey/${pollCode}`, this.httpOptions);
    }

    getQuestion(id: number): Observable<Question> {
        return this.http.get<Question>(`${this.baseURL}/get/question/${id}`, this.httpOptions);
    }

    private getQuestionInfo(id: number): Observable<Question> {
        return this.http.get<Question>(`${this.baseURL}/question/${id}`, this.httpOptions);
    }

    setVotingResult(choice: Choice): Observable<HttpResponse<any>> {
        return this.http.put<any>(`${this.baseURL}/set/result`, choice, this.httpOptionsResponse);
    }

    setVotingResults(data: Choice[]): Observable<HttpResponse<any>> {
        return this.http.put<any>(`${this.baseURL}/set/results`, data, this.httpOptionsResponse);
    }

    addOpenAnswer(choice: Choice): Observable<number> {
        return this.http.post<number>(`${this.baseURL}/add/open/answer`, choice, this.httpOptions);
    }

    addCloudAnswers(choices: Choice[]): Observable<Choice[]> {
        return this.http.post<Choice[]>(`${this.baseURL}/add/cloud/answers`, choices, this.httpOptions);
    }

    checkQuestionAnswered(id: number): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseURL}/question/answered/${id}`, this.httpOptions);
    }

    navigateToActiveQuestion(questionId: number, surveyCode: number, router: Router) {
        this.getQuestionInfo(questionId).subscribe((question: Question) => {
            if (QuestionTypes.MULTI_CHOICES.propName === question.type) {
                router.navigateByUrl(`vote/survey/${surveyCode}/question/${question.id}`);
            } else if (QuestionTypes.OPEN_ENDED.propName === question.type) {
                router.navigateByUrl(`vote/survey/open/${surveyCode}/question/${question.id}`);
            } else if (QuestionTypes.WORD_CLOUD.propName === question.type) {
                router.navigateByUrl(`vote/survey/cloud/${surveyCode}/question/${question.id}`);
            }
        });
    }

    checkBrowser(): boolean {
        const bowser = require('bowser');
        const browser = bowser.getParser(window.navigator.userAgent);

        return browser.satisfies({
            // declare browsers per OS
            windows: {
                chrome: ">51",
            },
            macos: {
                safari: ">1",
                chrome: ">51",
            },
            // per platform (mobile, desktop or tablet)
            mobile: {
                safari: '>1',
                chrome: ">51",
            },
            tablet: {
                safari: '>1',
                chrome: ">51",
            },
            // or in general
            "yandex browser": ">1"
        });
    };
}
