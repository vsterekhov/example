import {BsModalService} from "ngx-bootstrap/modal/bs-modal.service";
import {BsModalRef} from "ngx-bootstrap/modal/bs-modal-ref.service";
import {EventEmitter, Injectable} from "@angular/core";
import {ModalOptions} from "ngx-bootstrap/modal/modal-options.class";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {Survey} from "../model/survey.model";

@Injectable()
export class DialogService {
    private readonly bsModalService: BsModalService;
    private bsModalRef: BsModalRef;

    private readonly _runSurvey: Subject<any> = new Subject<any>();
    private readonly _continueSurvey: Subject<any> = new Subject<any>();
    private readonly _deleteSurvey: Subject<any> = new Subject<any>();
    private readonly _copySurvey: Subject<any> = new Subject<any>();

    constructor(bsModalService: BsModalService) {
        this.bsModalService = bsModalService;
    }

    openDialog(template, config?: ModalOptions) {
        let _config: ModalOptions;

        if (config) {
            config.class = config.class ? 'socs-dialog ' + config.class : 'socs-dialog';
            _config = config;
        } else {
            _config = {class: 'socs-dialog'};
        }

        this.bsModalRef = this.bsModalService.show(template, _config);
    }

    closeDialog() {
        if (this.bsModalRef) {
            this.bsModalRef.hide();
            this.bsModalRef = null;
        }
    }

    runSurvey(survey: Survey): void {
        this._runSurvey.next(survey);
    }

    get $runSurvey(): Observable<Survey> {
        return this._runSurvey.asObservable();
    }

    continueSurvey(survey: Survey): void {
        this._continueSurvey.next(survey);
    }

    get $continueSurvey(): Observable<Survey> {
        return this._continueSurvey.asObservable();
    }

    deleteSurvey(): void {
        this._deleteSurvey.next();
    }

    get $deleteSurvey(): Observable<any> {
        return this._deleteSurvey.asObservable();
    }

    copySurvey(): void {
        this._copySurvey.next();
    }

    get $copySurvey(): Observable<void> {
        return this._copySurvey.asObservable();
    }

    get onHide(): EventEmitter<any> {
        return this.bsModalService.onHide;
    }
}

