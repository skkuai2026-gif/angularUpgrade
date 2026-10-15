import { ResponseIO } from './../../models/responseIO';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { QuotationService } from 'src/app/quotation/services/quotation.service';

@Component({
  selector: 'sym-customer-quotation-coverage',
  templateUrl: './customer-quotation-coverage.component.html',
  styleUrls: ['./customer-quotation-coverage.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CustomerQuotationCoverageComponent extends BaseComponent<QuotationService> implements OnInit {
  @Input() responseIO: ResponseIO;
  @Input() responseUpdated: boolean;
  public isBasePlanSelected: boolean;
  public selectedQuotationCardIndex: number;
  respApplicableProducts: any;
  constructor(service: QuotationService) {
    super(service);
    this.isBasePlanSelected = false;
  }

  ngOnInit() {
    // this.service.loadScroll();
    this.getApplicableProducts();
  }

  public onBasePlanSelection(selectedResponseIO?: ResponseIO, index?: number) {
    setTimeout(() => {
      this.isBasePlanSelected = !this.isBasePlanSelected;
    }, 500);

    if (index != undefined) {
      this.selectedQuotationCardIndex = index;
    }
    if (selectedResponseIO != undefined) {
      this.service.responseIO.data.BasePlan = selectedResponseIO.data.BasePlan;
      this.service.responseIO.data.RiderList = [];
      this.service.responseIO.data.RiderList = selectedResponseIO.data.RiderList;
      this.service.refreshMetaData(selectedResponseIO);
    }
    if (
      this.service.responseIO.data.BasePlan.productPlanOptionCd != undefined &&
      this.service.responseIO.data.BasePlan.productPlanOptionCd != null &&
      this.selectedStep != undefined
    ) {
      //After setting the rider data hardcode that the rider tab is visited since
      //this tab is not actually present but we need to set it to see the validation errors.
      this.setVisitedTabs('tab_rider');
      this.selectedStep.resetForwardButtons();
    } else {
      this.selectedStep.hideFowardButtons();
    }
  }
  getApplicableProducts() {
    this.service.getApplicableProducts().subscribe(
      (successResponse) => {
        this.respApplicableProducts = JSON.parse(JSON.stringify(successResponse));
        this.respApplicableProducts = this.respApplicableProducts.data;
      },
      (error) => {
        console.log('Error:', error);
      }
    );
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
          console.log(totalRiderPremium);
        }
      });
    }
    return totalRiderPremium;
  }

  getTotalPremium() {
    let totalPremium: number;
    totalPremium =
      parseFloat(this.service.responseIO.data['BasePlan']['modalPremium']) + this.getRiderTotalPremium();
    return totalPremium;
  }
}
