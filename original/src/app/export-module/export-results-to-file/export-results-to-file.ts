import {Directive, Input, OnDestroy, OnInit} from "@angular/core";
import {Question} from "../../model/question.model";
import {ExportService} from "../export.service";
import {Survey} from "../../model/survey.model";
import {Subscription} from "rxjs/Subscription";
import {HttpResponse} from "@angular/common/http/src/response";

@Directive({
    selector: 'app-export-results-to-file'
})
export class ExportResultsToFile implements OnInit, OnDestroy {
    @Input()
    survey: Survey;
    @Input()
    question: Question;

    private subscriptions: Subscription[] = [];

    constructor(private readonly exportService: ExportService) {
    }

    ngOnInit() {
        this.subscriptions.push(this.exportService.$exportSurveyResultsToFile.subscribe(() => {
            if (this.survey && !isNaN(this.survey.id)) {
                this.exportService.downloadSurveyResultsInCSV(this.survey.id)
                    .subscribe((response: HttpResponse<string>) => {
                        this.open(['\ufeff' + response.body], response.headers.get('X-SOCS-CSV-FILENAME'));
                    });
            }
        }));
    }

    open(blobParts: any[], filename) {
        const options = {type: 'text/csv;charset=utf-8;'};
        const data = new Blob(blobParts, options);

        if (navigator.msSaveBlob != null) {
            navigator.msSaveBlob(data, filename);
        } else {
            const link = document.createElement('a');

            if (link.download != null) {
                link.setAttribute('href', URL.createObjectURL(data));
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
        this.subscriptions = [];
    }
}
