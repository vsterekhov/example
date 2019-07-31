import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ExportResultsToEmail} from "./export-results-to-email/export-results-to-email";
import {ExportResultsToFile} from "./export-results-to-file/export-results-to-file";
import {DialogModule} from "../dialog-module/dialog.module";
import {ExportService} from "./export.service";

@NgModule({
    declarations: [
        ExportResultsToEmail,
        ExportResultsToFile
    ],
    imports: [
        CommonModule,
        FormsModule,
        DialogModule
    ],
    exports: [
        ExportResultsToEmail,
        ExportResultsToFile
    ]
})
export class ExportModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ExportModule,
            providers: [ExportService]
        };
    }
}
