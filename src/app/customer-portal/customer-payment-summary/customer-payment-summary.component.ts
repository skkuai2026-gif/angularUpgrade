import { PolicyPaymentSummaryComponent } from './../../policy/policy-payment-summary/policy-payment-summary.component';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from 'src/app/policy/services/policy.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { OfflineService } from 'src/app/offline/offline.service';

@Component({
  selector: 'sym-customer-payment-summary',
  templateUrl: './customer-payment-summary.component.html',
  styleUrls: ['./customer-payment-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CustomerPaymentSummaryComponent extends PolicyPaymentSummaryComponent implements OnInit {
  constructor(
    policyService: PolicyService,
    public settingService: SettingService,
    protected offlineService: OfflineService
  ) {
    super(policyService, settingService, offlineService);
  }

  ngOnInit() {
    super.ngOnInit();
    // this.service.responseIO.data.InitialPayment.InitialPaymentDetailsList[0]['instrumentStatusCd'] = 'SaUCCESS';
  }
  getRiderTotalPremium() {
    let totalRiderPremium: number;
    totalRiderPremium = 0;
    if (this.service.responseIO.data && this.service.responseIO.data['RiderList']) {
      this.service.responseIO.data['RiderList'].filter((rider) => {
        // console.log(rider);
        if (rider.selected == 'YES') {
          // console.log(rider.modalPremium);
          totalRiderPremium += rider.modalPremium;
        }
      });
    }
    return totalRiderPremium;
  }
}
