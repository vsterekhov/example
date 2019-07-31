import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {PresenterService} from "../services/presenter.service";
import {Presenter} from "../model/presenter.model";
import {of} from "rxjs/observable/of";

export class PresenterByRecoveryResolverService implements Resolve<Presenter> {
    constructor(private presenterService: PresenterService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Presenter> | Promise<Presenter> | Presenter {
        if (route.queryParams.recovery) {
            return this.presenterService.getByRecovery(route.queryParams.recovery);
        }
        return of(null);
    }
}
