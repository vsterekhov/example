import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SurveyRoutingModule} from "./survey-routing.module";
import {SurveyQuestionComponent} from "./survey-question/survey-question-component";
import {SurveyOpenQuestionComponent} from "./survey-open-question/survey-open-question-component";
import {AsArrayPipe, SurveyCloudQuestionComponent} from "./survey-cloud-question/survey-cloud-question-component";

@NgModule({
    imports: [
        SurveyRoutingModule,
        CommonModule,
        FormsModule
    ],
    declarations: [
        SurveyQuestionComponent,
        SurveyOpenQuestionComponent,
        SurveyCloudQuestionComponent,
        AsArrayPipe
    ]
})
export class SurveyModule {
}
