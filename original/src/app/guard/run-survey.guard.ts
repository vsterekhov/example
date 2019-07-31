import {Injectable} from '@angular/core';
import {SurveyGuard} from "./survey-guard";
import {ActivatedRouteSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {map} from "rxjs/operators/map";

@Injectable()
export class RunSurveyGuard extends SurveyGuard {

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.surveyService.checkOwner(route.queryParams['surveyID'])
            .pipe(map(isOwner => {
                    if (!isOwner) {
                        this.router.navigate(['/manage']);
                    }
                    return isOwner;
                })
            );
    }
}
