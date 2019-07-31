import {NgModule} from "@angular/core";
import {VoteComponent} from "./vote-component/vote-component";
import {RouterModule} from "@angular/router";

const voteRoutes = [{
    path: '',
    component: VoteComponent
}, {
    path: ':surveyCode',
    component: VoteComponent
}, {
    path: 'survey',
    loadChildren: './survey-module/survey.module#SurveyModule'
}];

@NgModule({
    imports: [
        RouterModule.forChild(voteRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class VoteRoutingModule {
}
