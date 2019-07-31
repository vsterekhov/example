import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {ChartComponent} from "./chart.component";
import {MultiChoicesComponent} from "./multi-choices/multi-choices.component";
import {OpenEndedComponent} from "./open-ended/open-ended.component";
import {SvgWordCloudComponent} from "./svg-word-cloud/svg-word-cloud.component";

import {Utils} from "./Utils";
import {ColorPalette} from "./ColorPalette";


@NgModule({
    declarations: [
        ChartComponent,
        MultiChoicesComponent,
        OpenEndedComponent,
        SvgWordCloudComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ChartComponent
    ],
    providers: [
        Utils,
        ColorPalette
    ]
})
export class ChartModule {
}
