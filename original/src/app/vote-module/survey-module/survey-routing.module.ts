import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {SurveyQuestionComponent} from "./survey-question/survey-question-component";
import {SurveyOpenQuestionComponent} from "./survey-open-question/survey-open-question-component";
import {SurveyCloudQuestionComponent} from "./survey-cloud-question/survey-cloud-question-component";

const surveyRoutes = [{
    path: ':surveyCode/question/:questionID',
    component: SurveyQuestionComponent
}, {
    path: 'open/:surveyCode/question/:questionID',
    component: SurveyOpenQuestionComponent
}, {
    path: 'cloud/:surveyCode/question/:questionID',
    component: SurveyCloudQuestionComponent
}];

@NgModule({
    imports: [
        RouterModule.forChild(surveyRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class SurveyRoutingModule {
}
