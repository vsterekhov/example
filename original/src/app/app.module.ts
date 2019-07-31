//modules
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from "./app-routing.module";
import {BsDropdownModule} from 'ngx-bootstrap/dropdown/bs-dropdown.module';
import {AlertModule} from "ngx-bootstrap/alert/alert.module";
import {ModalModule} from "ngx-bootstrap/modal/modal.module";
import {QrModalModule} from "./qr-module/qr.modal.module";
import {ChartModule} from "./chart/chart.module";
import {ExportModule} from "./export-module/export.module";
import {DialogModule} from "./dialog-module/dialog.module";

//components
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {AlertComponent} from "./alert/alert.component";
import {AuthorizationComponent} from "./authorization/authorization-component";
import {RegistrationComponent} from "./registration/registration.component";
import {ValidatorMessageComponent} from "./validator-message.directive";

//services
import {SurveyService} from "./services/survey.service";
import {QuestionService} from './services/question.service';
import {VoteService} from "./services/vote.service";
import {PresenterService} from "./services/presenter.service";
import {SecurityService} from "./services/security.service";
import {AlertService} from "./services/alert.service";
import {AuthGuard} from "./guard/auth.guard";
import {SOCSHttpInterceptor} from "./services/SOCSHttpInterceptor";
import {PresenterByRecoveryResolverService} from "./registration/presenter-by-recovery-resolver.service";


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        AlertComponent,
        AuthorizationComponent,
        RegistrationComponent,
        ValidatorMessageComponent
    ],
    imports: [
        BsDropdownModule.forRoot(),
        AlertModule.forRoot(),
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        AppRoutingModule,
        ModalModule.forRoot(),
        QrModalModule,
        ChartModule,
        ExportModule.forRoot(),
        DialogModule.forRoot()
    ],
    providers: [
        SurveyService,
        PresenterService,
        QuestionService,
        VoteService,
        SecurityService,
        AuthGuard,
        AlertService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: SOCSHttpInterceptor,
            multi: true
        },
        PresenterByRecoveryResolverService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}


