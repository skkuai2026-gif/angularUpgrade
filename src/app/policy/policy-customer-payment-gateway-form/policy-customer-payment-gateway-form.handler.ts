import { ActivatedRoute, Router } from '@angular/router';
import { StepItem } from 'src/app/models/common/step-item';
import { PolicyService } from 'src/app/policy/services/policy.service';
import { BaseStepFormComponent } from 'src/app/system-common/base-step-form/base-step-form.component';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { PageHeader } from 'src/app/models/common/page-header';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { Location } from '@angular/common';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyCustomerPaymentGatewayFormHandlerComponent
  extends BaseStepFormComponent<PolicyService>
  implements OnInit
{
  inwardPaymentInfo = { policyNum: null, inwardAmount: null, payerName: null, productName: null };
  constructor(
    service: PolicyService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    const uid = this.route.snapshot.paramMap.get('id');
    this.service.id = +uid;
    this.service.getInwardPaymentInfo(this.service.id).subscribe(
      (response) => {
        if (response['success'] == true) {
          let responseJson = JSON.parse(JSON.stringify(response));
          this.inwardPaymentInfo.policyNum = responseJson.data.policyNum;
          this.inwardPaymentInfo.inwardAmount = responseJson.data.inwardAmount;
          this.inwardPaymentInfo.payerName = responseJson.data.payerName;
          this.inwardPaymentInfo.productName = responseJson.data.productName;
        } else {
          this.error(response['message'], undefined, true);
        }
        console.log(response['message']);
      },
      (error) => {
        console.log('Get Inward payment info failed.');
        console.log('Error:', error);
      }
    );
  }

  protected getStepList(): StepItem[] {
    let stepList = [];
    return stepList;
  }

  protected getMoreOptionList(): any[] {
    let optionList: any[];
    return optionList;
  }

  protected getBreadCrumbList(): BreadCrumb[] {
    return [];
  }

  protected getPageHeader(): PageHeader {
    let header = new PageHeader();
    return header;
  }

  onPaymentClick() {
    //Login for offline Payment Gateway process
    // if (
    //   this.settingService.mode === 'offline' &&
    //   this.settingService.isRhosimulator !== true &&
    //   (this.service.responseIO.data.Entity.statusCd === 'PAYMENTPENDING' ||
    //     this.service.responseIO.data.Entity.statusCd === 'PAYMENTFAILED')
    // ) {
    //   this.offlineService.onOfflinePayment(this.service.responseIO.data.InitialPayment.id);
    // } else {
    document.forms['paymentGatewayForm'].submit();
    // }
  }

  protected loadInitData() {}
}
