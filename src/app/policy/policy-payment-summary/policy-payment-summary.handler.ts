import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';
import { OfflineService } from 'src/app/offline/offline.service';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPaymentSummaryHandlerComponent extends BaseComponent<PolicyService> implements OnChanges {
  isOnlineAvailable: boolean;
  partyRoleList;
  constructor(
    policyService: PolicyService,
    public settingService: SettingService,
    protected offlineService: OfflineService
  ) {
    super(policyService);
    // console.log(this.service.responseIO);

    this.isOnlineAvailable = false;
    for (let i = 0; i < this.service.responseIO.data.InitialPayment.InitialPaymentDetailsList.length; i++) {
      if (this.service.responseIO.data.InitialPayment.InitialPaymentDetailsList[i].paymentMethodCd == 'IPG') {
        this.isOnlineAvailable = true;
        break;
      }
    }

    this.service.getPartyRoleList('PAYER', 'INITIAL').subscribe(
      (body) => {
        // console.log(body);
        this.partyRoleList = JSON.parse(JSON.stringify(body));
      },
      (error) => {
        console.log('Data load failed.');
        console.log('Error:', error);
      }
    );
  }

  ngOnInit() {
    //Used for Offline
    super.ngOnInit();
    if (
      this.settingService.getApplicationMode() === 'offline' &&
      (this.service.responseIO.data.Entity.statusCd === 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd === 'PAYMENTFAILED')
    ) {
      this.onPaymentStatusClick();
    }
  }

  onPaymentClick() {
    this.paymentStatusCheck('PAYNOW');
  }

  payNow() {
    //Login for offline Payment Gateway process
    if (
      this.settingService.getApplicationMode() === 'offline' &&
      this.settingService.isRhosimulator !== true &&
      (this.service.responseIO.data.Entity.statusCd === 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd === 'PAYMENTFAILED')
    ) {
      this.offlineService.onOfflinePayment(this.service.responseIO.data.InitialPayment.id);
    } else {
      document.forms['paymentGatewayForm'].submit();
    }
  }

  onPaymentStatusClick() {
    this.paymentStatusCheck('PAYMENTCHECK');
  }

  //Used for Offline
  paymentStatusCheck(source: any) {
    if (
      this.settingService.getApplicationMode() === 'offline' &&
      (this.service.responseIO.data.Entity.statusCd === 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd === 'PAYMENTFAILED')
    ) {
      this.service.checkPaymentStatus(false).subscribe(
        (body) => {
          let responseJson = JSON.parse(JSON.stringify(body));
          this.service.responseIO = responseJson;
          if (
            this.service.responseIO.data.Entity.statusCd === 'PAYMENTDONE' ||
            this.service.responseIO.data.Entity.statusCd === 'PAYMENTSUCCESS'
          ) {
            this.offlineService.reloadCurrentRoute();
          } else {
            //this.warn('Awaiting Payment status ');
            if (source == 'PAYMENTCHECK') {
              //   this.warn(responseJson['message']);
            } else {
              this.payNow();
            }
          }
        },
        (error) => {
          console.log('Data load failed.');
          console.log('Error:', error);
        }
      );
    } else if (
      this.settingService.getApplicationMode() === 'online' &&
      (this.service.responseIO.data.Entity.statusCd === 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd === 'PAYMENTFAILED')
    ) {
      this.service.checkPaymentStatus(false).subscribe(
        (body) => {
          let responseJson = JSON.parse(JSON.stringify(body));
          //this.service.responseIO = responseJson;
          //console.log(responseJson);
          if (responseJson.success) {
            //this.offlineService.reloadCurrentRoute();
            this.success(
              responseJson['message'],
              () => {
                this.service.reloadCurrentRoute();
              },
              false
            );
          } else {
            //this.warn('Awaiting Payment status ');
            if (source == 'PAYMENTCHECK') this.warn(responseJson['message']);
            else this.payNow();
          }
        },
        (error) => {
          console.log('Data load failed.');
          console.log('Error:', error);
        }
      );
    }
  }

  sendPaymentLinkClick() {
    this.service.sendPaymentLink().subscribe(
      (response) => {
        if (response['success'] == true) {
          this.success(response['message'], undefined, true);
        } else {
          this.error(response['message'], undefined, true);
        }
        console.log(response['message']);
      },
      (error) => {
        console.log('Send Payment Link failed.');
        console.log('Error:', error);
      }
    );
  }
}
