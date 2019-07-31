import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {DialogService} from "../dialog.service";

@Component({
    selector: 'app-return-to-library-dialog',
    templateUrl: './return-to-library-dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ReturnToLibraryDialogComponent implements OnInit {
    @Input() change;
    @Output() return: EventEmitter<any> = new EventEmitter<any>();

    constructor(private dialogService: DialogService) {
    }

    ngOnInit() {
    }

    open(template) {
        if (this.change) {
            this.dialogService.openDialog(template, {class: 'return-to-library'});
        } else {
            this.return.emit();
        }
    }

    ok() {
        this.return.emit();
        this.close();
    }

    close() {
        this.dialogService.closeDialog();
    }
}
