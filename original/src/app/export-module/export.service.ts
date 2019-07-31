import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HttpResponse} from "@angular/common/http/src/response";

@Injectable()
export class ExportService {
    private readonly baseURL = '/socs/api/export';

    emailValidationRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/g;

    private readonly _exportSurveyResultsToEmail: Subject<void> = new Subject<void>();
    private readonly _exportSurveyResultsToFile: Subject<void> = new Subject<void>();

    constructor(private readonly http: HttpClient) {
    }

    get $exportSurveyResultsToEmail(): Observable<void> {
        return this._exportSurveyResultsToEmail.asObservable();
    }

    exportSurveyResultsToEmail(): void {
        this._exportSurveyResultsToEmail.next();
    }

    get $exportSurveyResultsToFile(): Observable<void> {
        return this._exportSurveyResultsToFile.asObservable();
    }

    exportSurveyResultsToFile(): void {
        this._exportSurveyResultsToFile.next();
    }

    downloadSurveyResultsInCSV(surveyID: number): Observable<HttpResponse<string>> {
        return this.http.post(`${this.baseURL}/download/survey/csv`, `surveyID=${surveyID}`, {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'text/csv;charset=utf-8;'
            }),
            observe: 'response',
            responseType: 'text'
        });
    }

    exportSurveyResultsToCSV(surveyID: number, address: string): Observable<HttpResponse<string>> {
        return this.http.post(`${this.baseURL}/survey/csv`, `surveyID=${surveyID}&address=${address}`, {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            observe: 'response',
            responseType: 'text'
        });
    }
}
