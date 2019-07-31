import { Component, OnInit } from '@angular/core';
import { Alert } from '../model/alert';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  alert: Alert;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.getMessage().subscribe(alert => {
        this.alert = alert;
        if (this.alert && this.alert.type !== 'vote') {
            setTimeout(() => {
                this.closeAlert();
            }, 5000);
        }
    });
  }

  closeAlert() {
    this.alert = null;
  }

}
