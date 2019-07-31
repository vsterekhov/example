import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";
import {Presenter} from "../model/presenter.model";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

@Injectable()
export class PresenterService {
    private readonly url = '/socs/api/presenter';
    private readonly httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };


    constructor(private readonly http: HttpClient) {
    }

    add(presenter: Presenter) {
        return this.http.post<Presenter>(`${this.url}/add`, presenter, this.httpOptions);
    }

    userExists(username: string): Observable<boolean> {
        return this.http.post<boolean>(`${this.url}/userExists`, username, this.httpOptions);
    }

    sendRecoveryEmail(emailRecoveryInfo: Object): Observable<HttpResponse<any>> {
        return this.http.post<HttpResponse<any>>(`${this.url}/sendRecoveryEmail`, emailRecoveryInfo);
    }

    getByRecovery(recovery: string): Observable<Presenter> {
        return this.http.post<Presenter>(`${this.url}/getByRecovery`, recovery, this.httpOptions);
    }

    resetPassword(presenter: Presenter, recovery: string): Observable<Presenter> {
        return this.http.post<Presenter>(`${this.url}/resetPassword/${recovery}`, presenter, this.httpOptions);
    }
}
