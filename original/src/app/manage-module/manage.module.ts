import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ManageComponent} from "./manage-component/manage-component";
import {SurveyComponent} from "./survey-edit-component/survey.component";
import {QuestionSettingsComponent} from "./survey-edit-component/question-settings/question-settings.component";
import {ChoicesComponent} from "./survey-edit-component/question-settings/choices/choices.component";
import {PreviewDialogComponent} from "./survey-edit-component/preview-dialog/preview-dialog.component";
import {CloseQuestionComponent} from "./survey-edit-component/preview-dialog/queries/close-question/close-question-component";
import {OpenQuestionComponent} from "./survey-edit-component/preview-dialog/queries/open-question/open-question-component";
import {QuestionsAndCommentsComponent} from "./survey-edit-component/preview-dialog/queries/questions-and-comments/questions-and-comments-component";
import {QrModalModule} from "../qr-module/qr.modal.module";
import {DragulaModule} from "ng2-dragula";
import {FormsModule} from "@angular/forms";
import {ManageRoutingModule} from "./manage-routing.module";
import {ChartModule} from "../chart/chart.module";
import {BsDropdownModule} from 'ngx-bootstrap/dropdown/bs-dropdown.module';
import {ExportModule} from "../export-module/export.module";
import {ModalModule} from "ngx-bootstrap/modal/modal.module";
import {DialogModule} from "../dialog-module/dialog.module";

@NgModule({
    declarations: [
        ManageComponent,
        SurveyComponent,
        QuestionSettingsComponent,
        ChoicesComponent,
        OpenQuestionComponent,
        QuestionsAndCommentsComponent,
        CloseQuestionComponent,
        PreviewDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ManageRoutingModule,
        QrModalModule,
        DragulaModule.forRoot(),
        ChartModule,
        BsDropdownModule.forRoot(),
        ExportModule,
        ModalModule.forRoot(),
        DialogModule
    ]
})
export class ManageModule {
}
