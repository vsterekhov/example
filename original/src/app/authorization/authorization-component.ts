import {Component, Inject} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {SecurityService} from "../services/security.service";
import {PresenterService} from "../services/presenter.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {AlertService} from "../services/alert.service";
import {DOCUMENT} from "@angular/common";

@Component({
    selector: 'authorization',
    templateUrl: './authorization-component.html',
    styleUrls: ['./authorization-component.scss']
})
export class AuthorizationComponent {
    authorizationForm: FormGroup;
    login: FormControl;
    showRecoveryConfirm: boolean;

    constructor(private readonly fb: FormBuilder, private readonly router: Router,
                private readonly security: SecurityService, private readonly presenterService: PresenterService,
                private readonly alertService: AlertService, @Inject(DOCUMENT) private readonly document: Document) {
        this.login = fb.control('', Validators.required);

        this.authorizationForm = fb.group({
            login: this.login,
            password: ['', [Validators.required]],
            server: ['']
        });
        this.document.getElementById("rosatom-header").style.minWidth = "200px";
    }

    toReg() {
        this.router.navigate(["/registration"]);
    }

    checkUsername() {
        this.presenterService.userExists(this.login.value)
            .subscribe(
                (exists: boolean) => {
                    if (!exists) {
                        this.alertService.error('Такой пользователь не зарегистрирован в системе.');
                    } else {
                        this.showRecoveryConfirm = true;
                    }
                }
            );
    }

    sendRecoveryEmail() {
        const serverUrl = this.getServerUrl();
        let emailRecoveryInfo = {
            serverUrl: serverUrl,
            emailTo: this.login.value
        };

        this.presenterService.sendRecoveryEmail(emailRecoveryInfo).subscribe((res: HttpResponse<any>) => {
                this.alertService.success('E-mail отправлен на указанный вами адрес.');
                this.showRecoveryConfirm = false;
            }, (error: HttpErrorResponse) => {
                this.alertService.error(error.error);
            }
        );
    }

    input() {
        this.authorizationForm.controls['server'].setErrors(null);
    }

    onSubmit() {
        this.security.login(this.authorizationForm.value.login.toLowerCase(), this.authorizationForm.value.password,
            this.authorizationForm);
    }

    private getServerUrl(): string {
        const location = window.location;
        const locationPath = location.pathname;
        const path = locationPath.substr(0, locationPath.indexOf('/login'));

        return location.origin + path;
    }
}
