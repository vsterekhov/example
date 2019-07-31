import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {DialogService} from "./dialog.service";
import {DialogComponent} from "./dialog.component";
import {NewSurveyDialogComponent} from "./new-survey-dialog/new-survey-dialog.component";
import {CopySurveyDialogComponent} from "./copy-survey-dialog/copy-survey-dialog.component";
import {DeleteSurveyDialogComponent} from "./delete-survey-dialog/delete-survey-dialog.component";
import {RunSurveyDialogComponent} from "./run-survey-dialog/run-survey-dialog.component";
import {ReturnToLibraryDialogComponent} from "./return-to-library-dialog/return-to-library-dialog.component";
import {NewQuestionDialogComponent} from "./new-question-dialog/new-question-dialog.component";
import {DeleteQuestionDialogComponent} from "./delete-question-dialog/delete-question-dialog.component";
import {NewChoiceDialogComponent} from "./new-choice-dialog/new-choice-dialog.component";
import {EditChoiceDialogComponent} from "./edit-choice-dialog/edit-choice-dialog.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        DialogComponent,
        NewSurveyDialogComponent,
        CopySurveyDialogComponent,
        DeleteSurveyDialogComponent,
        RunSurveyDialogComponent,
        ReturnToLibraryDialogComponent,
        NewQuestionDialogComponent,
        DeleteQuestionDialogComponent,
        NewChoiceDialogComponent,
        EditChoiceDialogComponent
    ],
    exports: [
        DialogComponent,
        NewSurveyDialogComponent,
        CopySurveyDialogComponent,
        DeleteSurveyDialogComponent,
        RunSurveyDialogComponent,
        ReturnToLibraryDialogComponent,
        NewQuestionDialogComponent,
        DeleteQuestionDialogComponent,
        NewChoiceDialogComponent,
        EditChoiceDialogComponent
    ]
})
export class DialogModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DialogModule,
            providers: [DialogService]
        };
    }
}
