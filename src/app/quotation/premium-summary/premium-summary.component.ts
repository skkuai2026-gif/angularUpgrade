import { TabItem } from './../../models/common/tab-items';
import { QuotationService } from './../services/quotation.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import {
  Component,
  OnInit,
  OnChanges,
  Input,
  SimpleChanges,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PremiumSummaryHandlerComponent } from './premium-summary.handler';
import { Router } from '@angular/router';

@Component({
  selector: 'sym-premium-summary',
  templateUrl: './premium-summary.component.html',
  styleUrls: ['./premium-summary.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PremiumSummaryComponent extends PremiumSummaryHandlerComponent {
  @Input() isConvertToEappReq: boolean;
  @Input() newPremiumLayout: boolean;
  topUpAmount: number = 0.0;
  excessPremium = 0;
  annualexcesspremium = 0;
  partialTotalPremium = 0;
  paymentMode = '';
  sumOfModalPremium = 0;
  excessPremiumFlag: boolean;
  excessPremiumFromSolver = 0;
  totalwithoutsolverpremium: 0;
  totalInitialAnnualPremium = 0;
  premiumFrequencyLabel = 'Annual';

  constructor(quotationService: QuotationService, router: Router, public settingService: SettingService) {
    super(quotationService, router, settingService);
    // if (!settingService.isMobileViewRendered()) {
    this.widthInPX = 550;
    // }
  }
  ngOnInit(): void {
    // setTimeout(() => {
    super.ngOnInit();
    // this.calculateExcessPremium();
    // }, 100);
  }
  protected doCalculation() {
    if (this.service.responseIO != undefined) {
      let riderModalPremium = 0;
      let riderServiceTax = 0;
      let riderDiscount = 0;
      let riderNetPremium = 0;
      let riderList = this.service.responseIO.data.RiderList;
      if (riderList != undefined && riderList != null) {
        Object.keys(riderList).forEach((key) => {
          riderModalPremium = riderModalPremium + riderList[key]['modalPremium'];
          riderServiceTax = riderServiceTax + riderList[key]['serviceTax'];
          riderDiscount = riderDiscount + riderList[key]['totDiscount'];
          riderNetPremium =
            riderNetPremium + this.getNetPremium(riderList[key]['modalPremium'], riderList[key]['totDiscount']);
        });
      }
      let multiLifePremium = 0;
      if (
        this.service.productFacets &&
        this.service.productFacets.data &&
        this.service.productFacets.data['MULTILIFEAPPLICABLE'] &&
        this.service.productFacets.data['MULTILIFEAPPLICABLE'].length > 0 &&
        this.service.productFacets.data['MULTILIFEAPPLICABLE'] == 'YES' &&
        this.service.responseIO.data.SupplementaryList != undefined &&
        this.service.responseIO.data.SupplementaryList.length > 0
      ) {
        Object.keys(this.service.responseIO.data.SupplementaryList).forEach((key) => {
          multiLifePremium =
            multiLifePremium + this.service.responseIO.data.SupplementaryList[key]['modalPremium'];
        });
      }
      let basePlan = this.service.responseIO.data.BasePlan;
      let baseModalPremium = basePlan['modalPremium'];

      this.totalModalPremium =
        riderModalPremium != undefined && baseModalPremium != undefined
          ? riderModalPremium + baseModalPremium + multiLifePremium
          : 0;

      this.totalServiceTax =
        riderServiceTax != undefined && basePlan['serviceTax'] != undefined
          ? riderServiceTax + basePlan['serviceTax']
          : 0;
      this.totalDiscount =
        riderDiscount != undefined && basePlan['totDiscount'] != undefined
          ? riderDiscount + basePlan['totDiscount']
          : 0;
      this.totalNetPremium =
        riderNetPremium != undefined &&
        this.getNetPremium(basePlan['modalPremium'], basePlan['totDiscount']) != undefined
          ? riderNetPremium + this.getNetPremium(basePlan['modalPremium'], basePlan['totDiscount'])
          : 0;

      this.tabList = [];
      this.tabList = this.getTabList();
      this.selectedTab = this.tabList[0];
      this.mask = '1.0-0';

      setTimeout(() => {
        this.callingapi();
      }, 1000);
    }
  }

  protected callingapi() {
    if (
      this.service.productFacets &&
      this.service.productFacets.data &&
      this.service.productFacets.data['SISUMMARYELEMENTS'] &&
      (this.displayBenefitChart || this.displayLastBenefitChartValues)
    ) {
      console.log('callingapi');
      let isBodyReq = this.service.isBankPortal();
      console.log('isBodyReq', isBodyReq);
      this.service.getIllustrationValuesByFacet(isBodyReq).subscribe(
        (successResponse) => {
          this.illustrationResult = JSON.parse(JSON.stringify(successResponse));
          this.illustrationResult = this.illustrationResult.data;
          // console.log(this.illustrationResult);
          if (this.illustrationResult != undefined && this.illustrationResult.rates != undefined) {
            this.rateLength = Object.keys(this.illustrationResult.rates).length;
          }
          // if (this.illustrationResult != undefined) this.initLineGraph(0);
          //**Added for d3  */
          if (this.illustrationResult != undefined) this.createDataForGraph(0);
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['isConvertToEappReq'] && changes['isConvertToEappReq'].currentValue) {
      this.isConvertToEappReq = this.isConvertToEappReq;
    }
  }
  ngAfterViewInit() {
    this.service.displayLoader(true);
    console.log('ngAfterViewinit', this.service.responseIO.data.Entity.topupOptionCd);
    let quotAddtnlField8 = this.service.responseIO.data.Entity.topupOptionCd;

    if (
      this.service.responseIO.data.Entity.topupOptionCd == 'TFCALCULATIONWITHOUTPH' ||
      this.service.responseIO.data.Entity.topupOptionCd == 'TFCALCULATIONWITHPH' ||
      this.service.responseIO.data.Entity.topupOptionCd == 'EXCESSANDTFCALCULATIONWITHPH'
    ) {
      let currentSolverFacetId = 'TARGETFUNDSOLVERFORV8';
      this.excessPremiumFlag = false;

      this.service.responseIO.data.Entity.currentSolverFacetId = currentSolverFacetId;
      let modelNameListArray = [
        'Entity',
        'BasePlan',
        'RiderList',
        'InitialInvestment',
        'RegularTopup',
        'WithdrawalList',
      ];
      let respData: any;

      this.service.displayLoader(true, 'but_Continue');
      // this.service.settingService.setFreezePane(true);

      console.log('before actual call');
      this.service.solve(modelNameListArray).subscribe(
        (successResponse) => {
          this.service.hideLoader(true, 'but_Continue');
          // this.service.settingService.setFreezePane(true);
          respData = JSON.parse(JSON.stringify(successResponse));
          console.log('target fund response solver responser: ', respData.data);
          this.excessPremiumFromSolver = respData.data.RegularTopup.topUpAmount;
          console.log('excessPremiumFromSolver', this.excessPremiumFromSolver);
          // this.service.refreshMetaData(respData);
          this.calculateExcessPremium(respData);
          this.service.hideLoader(true, 'but_Continue');
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    } else {
      this.calculateExcessPremium(this.service.responseIO.data);
    }
  }
  protected calculateExcessPremium(respData: any) {
    const data = respData?.data ?? respData;

    if (data) {
      let topUpTypeCd1 = data.RegularTopup != null ? data.RegularTopup.topUpTypeCd : '';

      const topUpTypeCd2 = data.InitialInvestment != null ? data.InitialInvestment.topUpTypeCd : '';
      if (topUpTypeCd1 != null || topUpTypeCd2 != null) {
        this.excessPremiumFlag = true;
      }
      this.excessPremiumFlag = topUpTypeCd1 != null || topUpTypeCd2 != null;
      if (this.excessPremiumFromSolver > 0) {
        this.annualexcesspremium = this.excessPremiumFromSolver;
      }
      if (topUpTypeCd2 === 'INITIALINVESTMENT') {
        this.excessPremium = data.InitialInvestment.topUpAmount ?? 0.0;
      }

      if (topUpTypeCd1 === 'REGULARTOPUP') {
        this.annualexcesspremium = data.RegularTopup.topUpAmount ?? 0.0;
      }
    }
    if (data) {
      this.paymentMode = data.BasePlan?.['paymentFrequencyCd'];

      const productFamilyCd = data.BasePlan?.['productFamilyCd'];

      const frequency = this.paymentMode?.toUpperCase();
      const productFamily = productFamilyCd?.toUpperCase();

      if (productFamily === 'TRAD') {
        if (frequency === 'ANNUAL') {
          this.premiumFrequencyLabel = 'Annual';
          this.annualexcesspremium *= 1;
        } else if (frequency === 'HALFYEARLY' || frequency === 'SEMI-ANNUAL' || frequency === 'SEMIANNUAL') {
          this.premiumFrequencyLabel = 'Semi-Annual';
          this.annualexcesspremium *= 0.53;
        } else if (frequency === 'QUARTERLY') {
          this.premiumFrequencyLabel = 'Quarterly';
          this.annualexcesspremium *= 0.275;
        } else if (frequency === 'MONTHLY ACA' || frequency === 'WORKSITE (MONTHLY)') {
          this.premiumFrequencyLabel = 'Monthly';
          this.annualexcesspremium *= 0.1025;
        }
      } else if (productFamily === 'VUL') {
        if (frequency === 'ANNUAL') {
          this.premiumFrequencyLabel = 'Annual';
          this.annualexcesspremium *= 1;
        } else if (frequency === 'HALFYEARLY' || frequency === 'SEMI-ANNUAL' || frequency === 'SEMIANNUAL') {
          this.premiumFrequencyLabel = 'Semi-Annual';
          this.annualexcesspremium *= 0.5;
        } else if (frequency === 'QUARTERLY') {
          this.premiumFrequencyLabel = 'Quarterly';
          this.annualexcesspremium *= 0.25;
        } else if (frequency === 'MONTHLY') {
          this.premiumFrequencyLabel = 'Monthly';
          this.annualexcesspremium *= 0.0833333;
        } else if (frequency === 'MONTHLY ACA' || frequency === 'WORKSITE (MONTHLY)') {
          this.premiumFrequencyLabel = 'Monthly';
          this.annualexcesspremium *= 0.1025;
        }
      }
    }

    if (this.service.responseIO != undefined) {
      let riderModalPremium = 0;
      let riderServiceTax = 0;
      let riderDiscount = 0;
      let riderNetPremium = 0;
      let riderList = this.service.responseIO.data.RiderList;
      if (riderList != undefined && riderList != null) {
        Object.keys(riderList).forEach((key) => {
          riderModalPremium = riderModalPremium + riderList[key]['modalPremium'];
          riderServiceTax = riderServiceTax + riderList[key]['serviceTax'];
          riderDiscount = riderDiscount + riderList[key]['totDiscount'];
          riderNetPremium =
            riderNetPremium + this.getNetPremium(riderList[key]['modalPremium'], riderList[key]['totDiscount']);
        });
      }
      let multiLifePremium = 0;
      if (
        this.service.productFacets &&
        this.service.productFacets.data &&
        this.service.productFacets.data['MULTILIFEAPPLICABLE'] &&
        this.service.productFacets.data['MULTILIFEAPPLICABLE'].length > 0 &&
        this.service.productFacets.data['MULTILIFEAPPLICABLE'] == 'YES' &&
        this.service.responseIO.data.SupplementaryList != undefined &&
        this.service.responseIO.data.SupplementaryList.length > 0
      ) {
        Object.keys(this.service.responseIO.data.SupplementaryList).forEach((key) => {
          multiLifePremium =
            multiLifePremium + this.service.responseIO.data.SupplementaryList[key]['modalPremium'];
          this.topUpAmount = multiLifePremium;
        });
      }
      let basePlan = this.service.responseIO.data.BasePlan;
      let baseModalPremium = basePlan['modalPremium'];
      this.totalwithoutsolverpremium =
        riderModalPremium != undefined && baseModalPremium != undefined ? riderModalPremium + baseModalPremium : 0;
      this.totalModalPremium =
        riderModalPremium != undefined && baseModalPremium != undefined
          ? riderModalPremium + baseModalPremium + multiLifePremium + this.annualexcesspremium
          : 0;
      this.totalInitialAnnualPremium = this.totalwithoutsolverpremium + this.annualexcesspremium;
    }
    this.service.hideLoader(true);
  }
}
