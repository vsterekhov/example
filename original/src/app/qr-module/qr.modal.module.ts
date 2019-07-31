import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {QrModalComponent} from "./qr-modal.component";
import {QRCodeModule} from "angularx-qrcode";

@NgModule({
    declarations: [QrModalComponent],
    imports: [CommonModule, QRCodeModule],
    exports: [QrModalComponent]
})
export class QrModalModule {

}
