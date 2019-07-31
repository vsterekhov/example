import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SurveyService} from "../../services/survey.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {QuestionService} from "../../services/question.service";
import {Question} from "../../model/question.model";
import {QuestionTypes} from "../../model/question.type";
import {VoteService} from "../../services/vote.service";

@Component({
    selector: 'vote-comp',
    templateUrl: './vote-component.html',
    styleUrls: ['./vote-component.scss']
})
export class VoteComponent implements OnInit {
    public errorMessage = "";

    voteForm: FormGroup;
    private pollCode: number;

    constructor(private readonly fb: FormBuilder, private readonly surveyService: SurveyService,
                private readonly router: Router, private readonly questionService: QuestionService,
                private readonly voteService: VoteService, private readonly route: ActivatedRoute) {
    }

    ngOnInit() {
        let code;

        this.route.params.subscribe((params: Params) => {
            code = '';

            if (params['surveyCode']) {
                code = params['surveyCode']
            }
        });

        this.initForm(code);
    }

    onSubmit() {
        this.pollCode = Number(this.voteForm.value.voteCode);

        this.voteService.wasThePollStarted(this.pollCode).subscribe((pollStarted: boolean) => {
            this.changeErrorMessage(pollStarted);

            if (pollStarted) {
                this.voteService.getActiveQuestion(this.pollCode).subscribe((question: Question) => {
                    this.voteService.increaseRespondentsNumber(this.pollCode).subscribe(() => {
                        if (question.type === QuestionTypes.MULTI_CHOICES.propName) {
                            this.router.navigateByUrl(`vote/survey/${this.pollCode}/question/${question.id}`);
                        } else if (question.type === QuestionTypes.OPEN_ENDED.propName) {
                            this.router.navigateByUrl(`vote/survey/open/${this.pollCode}/question/${question.id}`);
                        } else if (question.type === QuestionTypes.WORD_CLOUD.propName) {
                            this.router.navigateByUrl(`vote/survey/cloud/${this.pollCode}/question/${question.id}`);
                        }
                    });
                });
            }
        });
    }

    reset() {
        this.errorMessage = '';
    }

    printOnlyNumbers(event: any) {
        this.errorMessage = '';
        let formControl;

        formControl = event.target;
        formControl.value = formControl.value.replace(/[^0-9]+/g, "");
    }

    changeErrorMessage(pollStarted: boolean) {
        const code = this.voteForm.value.voteCode;
        const control = this.voteForm.controls['voteCode'];

        if (control.invalid && control.touched || !code) {
            this.errorMessage = 'Пожалуйста, введите код опросного листа';
        }

        if (!pollStarted) {
            this.errorMessage = 'Опрос с таким кодом не проводится';
        }
    }

    private initForm(code) {
        this.voteForm = this.fb.group({
            voteCode: [code, [Validators.required]]
        });
    }
}
