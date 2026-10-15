import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Alert, AlertType } from '../model/common/alert';
import { BaseComponent } from '../base/base.component';
import { BaseService } from 'src/app/system-common/services/base.service';
import { SettingService } from '../services/setting.service';
import { NavigationStart, Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sym-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AlertComponent extends BaseComponent<BaseService> {
  constructor(
    baseService: BaseService,
    public settingService: SettingService,
    private router: Router,
    private alertService: AlertService
  ) {
    super(baseService);
  }

  @Input() id = 'default-alert';
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription: Subscription;
  routeSubscription: Subscription;

  ngOnInit() {
    // subscribe to new alert notifications
    this.alertSubscription = this.alertService.onAlert(this.id).subscribe((alert) => {
      // clear alerts when an empty alert is received
      if (!alert.message) {
        // filter out alerts without 'keepAfterRouteChange' flag
        this.alerts = this.alerts.filter((x) => x.keepAfterRouteChange);

        // remove 'keepAfterRouteChange' flag on the rest
        this.alerts.forEach((x) => delete x.keepAfterRouteChange);
        return;
      }

      // add alert to array
      this.alerts.push(alert);

      // auto close alert if required
      if (alert.autoClose) {
        setTimeout(() => this.removeAlert(alert), 8000);
      }
    });

    // clear alerts on location change
    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.alertService.clear(this.id);
      }
    });
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    if (this.alertSubscription != undefined) this.alertSubscription.unsubscribe();
    if (this.routeSubscription != undefined) this.routeSubscription.unsubscribe();
  }

  removeAlert(alert: Alert) {
    // check if already removed to prevent error on auto close
    if (!this.alerts.includes(alert)) return;

    if (this.fade) {
      // fade out alert
      this.alerts.find((x) => x === alert).fade = true;

      this.alerts = this.alerts.filter((x) => x !== alert);
      // remove alert after faded out
      setTimeout(() => {
        this.alerts = this.alerts.filter((x) => x !== alert);
      }, 0);
    } else {
      // remove alert
      this.alerts = this.alerts.filter((x) => x !== alert);
    }
  }

  cssClass(alert: Alert) {
    if (!alert) return;

    const classes = ['alert', 'alert-dismissable'];

    const alertTypeClass = {
      [AlertType.Success]: 'alert alert-success',
      [AlertType.Error]: 'alert alert-danger',
      [AlertType.Info]: 'alert alert-info',
      [AlertType.Warning]: 'alert alert-warning',
      [AlertType.Question]: 'alert alert-info',
    };

    classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
      classes.push('fade');
    }

    return classes.join(' ');
  }

  iconClass(alert: Alert) {
    if (!alert) return;

    const classes = ['pr-2'];

    const alertTypeClass = {
      [AlertType.Success]: 'fa fa-check-circle',
      [AlertType.Error]: '	fa fa-times-circle',
      [AlertType.Info]: 'fa fa-info-circle',
      [AlertType.Warning]: '	fa fa-exclamation-triangle',
      [AlertType.Question]: 'fa fa-question-circle',
    };

    classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
      classes.push('fade');
    }

    return classes.join(' ');
  }
  // ngOnInit(): void {
  //   //alert('in init');
  // }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['alert'] && changes['alert'].currentValue && alert != undefined) {
  //     // alert('changed');
  //     this.openModal('sym_alert');
  //   }
  // }

  onOkClick(alert: Alert) {
    // this.closeModal('sym_alert');
    if (typeof alert.okCallBack === 'function') {
      alert.okCallBack();
    }
    this.removeAlert(alert);
  }

  onCancelClick(alert: Alert) {
    //this.closeModal('sym_alert');
    if (typeof alert.cancelCallBack === 'function') {
      alert.cancelCallBack();
    }
    this.removeAlert(alert);
  }
}
