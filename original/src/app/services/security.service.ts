import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {FormGroup} from "@angular/forms";

@Injectable()
export class SecurityService {
    constructor(private readonly http: HttpClient, private readonly router: Router) {
    }

    login(username: string, password: string, form: FormGroup) {
        const body = `username=${username}&password=${password}`;
        const options = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('X-Requested-With',
                'XMLHttpRequest')
        };

        this.http.post('api/login', body, options).subscribe(() => {
                localStorage.setItem('username', username);
                this.router.navigate(['manage']);
            },
            error => {
                form.controls['server'].setErrors({
                    'error': error.status === 401 ? 'Неверный логин или пароль' :
                        'Во время аутентификации произошла ошибка'
                });
                form.controls['server'].markAsTouched();
            });
    }

    logout() {
        this.http.post('api/logout', null).subscribe();
        localStorage.removeItem('username');
        this.router.navigate(['/login']);
    }

}
