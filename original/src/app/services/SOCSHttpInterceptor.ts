import {Injectable} from '@angular/core';
import {
    HttpClient,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpXsrfTokenExtractor
} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {catchError} from "rxjs/operators/catchError";
import {mergeMap} from "rxjs/operators/mergeMap";
import {Router} from '@angular/router';
import {AlertService} from "./alert.service";
import {ErrorObservable} from "rxjs/observable/ErrorObservable";

@Injectable()
export class SOCSHttpInterceptor implements HttpInterceptor {
    constructor(private readonly http: HttpClient, private readonly router: Router,
                private readonly tokenExtractor: HttpXsrfTokenExtractor, private readonly alertService: AlertService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(error => {
            if (error.status === 401) {
                this.router.navigate(['/login']);
            }

            if (error.status === 403) {
                return this.http.get('/api/token').pipe(mergeMap(() => {
                    return this.handleCSRF(request, next);
                }));
            }

            return this.handleError(request, error);
        }));
    }

    private handleCSRF(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.tokenExtractor.getToken();

        if (token !== null) {
            request = request.clone({headers: request.headers.set('X-XSRF-TOKEN', token)});
        }

        return handler.handle(request);
    }

    private handleError(request: HttpRequest<any>, error: any): ErrorObservable {
        if (request.url !== 'api/login' && request.url !== '/socs/api/presenter/add' &&
            !request.url.includes('/socs/api/vote')) {
            let message =
                'При выполнении действия произошла ошибка. Попробуйте снова или обратитесь к администратору системы.';

            if (error.error && typeof error.error === 'string') {
                message = 'Ошибка: ' + error.error;
            }

            this.alertService.error(message);
        }

        if (request.url.includes('api/vote') && error.status !== 500) {
            this.alertService.errorVote();
        }

        return ErrorObservable.create(error);
    }
}
