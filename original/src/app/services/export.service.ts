import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {HttpResponse} from "@angular/common/http/src/response";

@Injectable()
export class ExportService {
    private readonly baseURL = '/socs/api/export';
    private readonly headers = [new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'text/csv;charset=utf-8;'
    }), new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
    })];
    private readonly observe = 'response';
    private readonly responseType = 'text';

    constructor(private readonly http: HttpClient) {
    }

    downloadSurveyResultsInCSV(surveyID: number): Observable<HttpResponse<string>> {
        return this.http.post(`${this.baseURL}/download/survey/csv`, `surveyID=${surveyID}`, {
            headers: this.headers[0],
            observe: this.observe,
            responseType: this.responseType
        });
    }

    downloadQuestionResultsInCSV(questionID: number): Observable<HttpResponse<string>> {
        return this.http.post(this.baseURL + '/download/question/csv', `questionID=${questionID}`, {
            headers: this.headers[0],
            observe: this.observe,
            responseType: this.responseType
        });
    }

    exportQuestionResultsToCSV(questionID: number, address: string): Observable<HttpResponse<string>> {
        return this.http.post(`${this.baseURL}/question/csv`, `questionID=${questionID}&address=${address}`, {
            headers: this.headers[1],
            observe: this.observe,
            responseType: this.responseType
        });
    }

    exportSurveyResultsToCSV(surveyID: number, address: string): Observable<HttpResponse<string>> {
        return this.http.post(`${this.baseURL}/survey/csv`, `surveyID=${surveyID}&address=${address}`, {
            headers: this.headers[1],
            observe: this.observe,
            responseType: this.responseType
        });
    }
}
