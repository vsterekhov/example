import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {SurveyService} from "../services/survey.service";
import {Observable} from "rxjs/Observable";
import {map} from "rxjs/operators/map";

export class SurveyGuard implements CanActivate {
    constructor(protected router: Router,
                protected surveyService: SurveyService) {
    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.surveyService.checkOwner(route.params['surveyId'])
            .pipe(map(isOwner => {
                    if (!isOwner) {
                        this.router.navigate(['/manage']);
                    }
                    return isOwner;
                })
            );
    }
}
