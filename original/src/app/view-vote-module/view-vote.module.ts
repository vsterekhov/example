import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {ViewVoteRoutingModule} from "./view-vote-routing.module";
import {ModalModule} from "ngx-bootstrap/modal/modal.module";
import {ChartModule} from "../chart/chart.module";

import {ViewVoteComponent} from "./view-vote-component/view-vote-component";
import {ExportModule} from "../export-module/export.module";

@NgModule({
    imports: [
        ViewVoteRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        ChartModule,
        ExportModule
    ],
    declarations: [
        ViewVoteComponent
    ]
})
export class ViewVoteModule {
}
