import {Component, Input} from '@angular/core';

@Component({
    selector: 'validator-message',
    template: `
        <div class="alert alert-danger alert-message col-lg-offset-2"
             *ngIf="form.invalid && form.touched && validatorMessages.length !== 0">
            <li *ngFor="let errMsg of validatorMessages"> {{errMsg.message}}</li>
        </div>
    `,
    styles: [`.alert-message {
        font-size: 10px;
        padding: 0 5px;
        margin: 0;
    }`
    ]
})
export class ValidatorMessageComponent {
    @Input()
    form: any;
    @Input()
    isFormGroup: boolean;
    errors = [];
    messages = {
        "login": "Логин: ",
        "pwd": "Пароль: ",
        "passwords": "Пароль: ",
        "password": "Пароль: ",
        "pwdconfirm": "Повтор пароля: ",
        "confirm1": "Регистрация: ",
        "confirm2": "Регистрация: ",
    };

    //для двух уровней вложенности групп
    public get validatorMessages() {
        this.errors = [];

        if (this.isFormGroup) {
            const controls = this.form.controls;
            const names = Object.keys(this.form.controls || {});

            names.forEach((name) => {
                if (controls[name].touched && controls[name].status === 'INVALID') {
                    const subControls = controls[name].controls;
                    const subNames = Object.keys(controls[name].controls || {});

                    subNames.forEach((subName) => {
                        if (subControls[subName].touched && subControls[subName].status === 'INVALID') {
                            this.setErrors(subControls[subName], subName);
                        }
                    });

                    this.setErrors(controls[name], name);
                }
            });
        } else {
            this.setErrors(this.form, null)
        }

        return this.errors;
    }

    private setErrors(field, controlName) {
        if (!field || !field.errors) {
            return;
        }

        const config = {
            required: 'Поле обязательно для заполнения'
        };

        if (field.errors.hasOwnProperty('custom')) {
            config['custom'] = (typeof field.errors.custom === 'string' && field.errors.custom.length) ?
                field.errors.custom : 'Не соответствует формату';
        }

        if (field.errors.hasOwnProperty('minlength')) {
            config['minlength'] = `Минимальная длина ${field.errors.minlength.requiredLength}`;
        }

        if (field.errors.hasOwnProperty('maxlength')) {
            config['maxlength'] = `Максимальная длина ${field.errors.maxlength.requiredLength}`;
        }

        if (field.errors.hasOwnProperty('error')) {
            config['error'] = "Ошибка: " + field.errors['error'];
        }

        if (controlName && this.messages[controlName]) {
            config['required'] = this.messages[controlName] + config['required'];
            config['custom'] = this.messages[controlName] + config['custom'];
            config['minlength'] = this.messages[controlName] + config['minlength'];
            config['maxlength'] = this.messages[controlName] + config['maxlength'];
        }

        Object.keys(field.errors).forEach((error: string) => {
            this.errors.push({message: config[error], control: field});
        });
    }
}
