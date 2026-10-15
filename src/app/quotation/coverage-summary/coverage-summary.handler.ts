import { Component, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { QuotationService } from '../services/quotation.service';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CoverageSummaryHandlerComponent extends BaseComponent<QuotationService> implements OnChanges {
  constructor(quotationService: QuotationService, public settingService: SettingService) {
    super(quotationService);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  isMultiLifeApplicable(): boolean {
    if (
      this.service.productFacets != undefined &&
      this.service.productFacets.data != undefined &&
      this.service.productFacets.data['MULTILIFEAPPLICABLE'] != undefined &&
      this.service.productFacets.data['MULTILIFEAPPLICABLE'] == 'YES'
    )
      return true;
    else return false;
  }

  getRiderTotalPremium(): number {
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

  getMultiLifeTotalSA() {
    let totalSA: number;
    totalSA = 0;
    if (this.isMultiLifeApplicable() && this.service.responseIO.data['SupplementaryList'] != undefined) {
      this.service.responseIO.data['SupplementaryList'].filter((supplementary) => {
        if (!isNaN(supplementary.baseSumAssured)) totalSA = totalSA + parseFloat(supplementary.baseSumAssured);
      });
    }
    return totalSA;
  }

  getMultiLifeTotalPremium(): number {
    let totalPrm: number;
    totalPrm = 0;
    if (
      this.isMultiLifeApplicable() &&
      this.service.responseIO != undefined &&
      this.service.responseIO.data['SupplementaryList'] != undefined
    ) {
      this.service.responseIO.data['SupplementaryList'].filter((supplementary) => {
        if (!isNaN(supplementary.modalPremium)) totalPrm += parseFloat(supplementary.modalPremium);
      });
    }
    return totalPrm;
  }

  getTotalPolicyPremium() {
    let totalPolPremium: number;
    totalPolPremium = 0;
    let modalPremiumValue = this.service.responseIO.data['BasePlan']['modalPremium'];
    if (modalPremiumValue != undefined) {
      modalPremiumValue = parseFloat(modalPremiumValue);
    }
    totalPolPremium = modalPremiumValue + this.getRiderTotalPremium() + this.getMultiLifeTotalPremium();
    return totalPolPremium;
  }
}
