import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Alert} from '../model/alert';
import {Observable} from 'rxjs/Observable';
import {NavigationStart, Router} from '@angular/router';

@Injectable()
export class AlertService {
    private readonly subject = new Subject<Alert>();

    constructor(private readonly router: Router) {
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.subject.next();
            }
        });
    }

    success(message: string) {
        this.subject.next({type: 'success', message});
    }

    info(message: string) {
        this.subject.next({type: 'info', message});
    }

    warn(message: string) {
        this.subject.next({type: 'warning', message});
    }

    error(message: string) {
        this.subject.next({type: 'danger', message});
    }

    errorVote() {
        this.subject.next({type: 'vote', message: ""});
    }

    getMessage(): Observable<Alert> {
        return this.subject.asObservable();
    }
}
