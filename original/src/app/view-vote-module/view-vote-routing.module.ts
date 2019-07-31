import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ViewVoteComponent} from "./view-vote-component/view-vote-component";
import {RunSurveyGuard} from "../guard/run-survey.guard";

const viewVoteRoutes = [{
    path: '',
    component: ViewVoteComponent,
    canActivate: [RunSurveyGuard]
}];

@NgModule({
    imports: [
        RouterModule.forChild(viewVoteRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [RunSurveyGuard]
})
export class ViewVoteRoutingModule {
}
