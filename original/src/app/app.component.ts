import {Component} from '@angular/core';
import {AlertService} from "./services/alert.service";
import {setTheme} from "ngx-bootstrap/utils/theme-provider";
import {VoteService} from "./services/vote.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public error: boolean;
    public isBrowserVersionValid: boolean;
    public serverName: string;

    constructor(private readonly alertService: AlertService, private readonly voteService: VoteService) {
        setTheme('bs3');
    }

    ngOnInit() {
        this.serverName = window.location.hostname;
        this.isBrowserVersionValid = this.voteService.checkBrowser();

        this.error = false;
        this.alertService.getMessage().subscribe(alert => {
            if (alert && alert.type === 'vote') {
                this.error = true;
            }
        });
    }
}
