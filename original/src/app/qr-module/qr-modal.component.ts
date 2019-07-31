import {Component, Inject, Input, TemplateRef, HostListener} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal/bs-modal.service';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'app-qr-modal',
    templateUrl: './qr-modal.html',
    styleUrls: ['./qr-modal.scss']
})
export class QrModalComponent {
    modalRef: BsModalRef;
    @Input()
    surveyCode: number;
    qrCode: string;
    @Input()
    icon: boolean;
    size: number;
    hostname: string;

    constructor(private readonly modalService: BsModalService, @Inject(DOCUMENT) private document: Document) {
    }

    openModal(template: TemplateRef<any>) {
        const locationObj = this.document.location;

        this.qrCode = locationObj.origin + '/vote';
        this.hostname = locationObj.hostname;

        if (this.surveyCode) {
            this.qrCode = `${this.qrCode}/${this.surveyCode}`;
        }

        if (window.innerWidth <= window.innerHeight) {
            this.size = window.innerWidth * 0.4
        } else {
            this.size = window.innerHeight * 0.4
        }

        this.modalRef = this.modalService.show(template, {class: 'qr-modal'});

        this.setDisplayPropertyForElem("app-root", "none");
    }

    closeModal() {
        this.setDisplayPropertyForElem("app-root", "");
        this.modalRef.hide();
    }

    @HostListener('window:resize')
    onWindowResize() {
        if (this.document.getElementsByTagName("qrcode")[0]) {
            redraw(this.document.getElementsByTagName("qrcode")[0].getElementsByTagName("canvas")[0]);
        }

        function redraw(canvas) {
            if (window.innerWidth <= window.innerHeight) {
                canvas.nextSibling.height = window.innerWidth * 0.4;
                canvas.nextSibling.width = window.innerWidth * 0.4;
            } else {
                canvas.nextSibling.height = window.innerHeight * 0.4;
                canvas.nextSibling.width = window.innerHeight * 0.4;
            }
        }
    }

    @HostListener('document:keydown', ['$event'])
    onKeydownHandler(event: KeyboardEvent) {
        if (event.keyCode === 27) {
            this.setDisplayPropertyForElem("app-root", "");
            this.modalRef.hide();
        }
    }

    private setDisplayPropertyForElem(elemId: string, value: string) {
        let htmlElement = document.getElementById(elemId);
        if (htmlElement) {
            htmlElement.style.display = value;
        }
    }
}
