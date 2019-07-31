import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ManageComponent} from "./manage-component/manage-component";
import {SurveyComponent} from "./survey-edit-component/survey.component";
import {SurveyGuard} from "../guard/survey-guard";
import { AuthGuard } from "../guard/auth.guard";

const routes = [{
    path: '',
    component: ManageComponent,
    canActivate: [AuthGuard]
}, {
    path: ':surveyId',
    component: SurveyComponent,
    canActivate: [SurveyGuard]
}];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: [SurveyGuard]
})
export class ManageRoutingModule {
}
