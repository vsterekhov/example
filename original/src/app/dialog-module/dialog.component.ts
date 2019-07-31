import {Component, Input, ViewEncapsulation} from "@angular/core";

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DialogComponent {
    @Input() footer: boolean = true;
    @Input() content: boolean = true;
}

