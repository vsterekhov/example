import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {VoteRoutingModule} from "./vote-routing.module";
import {VoteComponent} from "./vote-component/vote-component";

@NgModule({
    imports: [
        VoteRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        VoteComponent
    ]
})
export class VoteModule {
}
