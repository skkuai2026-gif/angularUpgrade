import { TabItem } from './../../models/common/tab-items';
import { QuotationService } from './../services/quotation.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { Component, OnInit, OnChanges, Input, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { Router } from '@angular/router';
import { ChartYPlotDetails } from 'src/app/system-common/custom-charts/custom-charts.component';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PremiumSummaryHandlerComponent extends BaseComponent<QuotationService> implements OnChanges, OnInit {
  @Input() displayBenefitSummary: boolean;
  @Input() displayBenefitChart: boolean;
  @Input() displayLastBenefitChartValues: boolean;
  @Input() widthInPX: number;

  public fieldCodes: string[];
  totalModalPremium: number;
  illustrationResult: any;
  tabList: TabItem[];
  selectedTab: TabItem;
  rateLength: number;
  selectedGraphPer;
  isConvertToEappReq: boolean;
  public isCustomerPortal: boolean;
  totalNetPremium: number;
  totalServiceTax: number;
  totalDiscount: number;
  mask: string;
  public newPremiumLayout: boolean;
  /**D3 variables starts*/
  dataList: any[];
  plotDetails: ChartYPlotDetails[];
  /**D3 variables ends*/

  constructor(quotationService: QuotationService, public router: Router, public settingService: SettingService) {
    super(quotationService);
    this.displayBenefitSummary = true;
    this.displayBenefitChart = true;
    this.isConvertToEappReq = false;
    this.isCustomerPortal = this.settingService.isCustomerPortal();
    if (!settingService.isMobileViewRendered()) {
      this.widthInPX = 550;
    }
    this.dataList = [];
    this.tabList = [];

    // console.log(this.service.responseIO.data);
  }

  ngOnInit() {
    if (!this.newPremiumLayout) {
      setTimeout(() => {
        this.doCalculation();
      }, 25);
    } else {
      this.tabList = this.getTabList();
      this.selectedTab = this.tabList[0];
    }
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
      if (!this.newPremiumLayout) {
        this.tabList = [];
        this.tabList = this.getTabList();
        this.selectedTab = this.tabList[0];
      }
      this.mask = '1.0-0';
      // let maskValue =
      //   this.service.getFieldMetadata(this.service.responseIO.data['BasePlan'], 'modalPremium') != undefined &&
      //   this.service.getFieldMetadata(this.service.responseIO.data['BasePlan'], 'modalPremium')['MASK'] !=
      //     undefined
      //     ? this.service.getFieldMetadata(this.service.responseIO.data['BasePlan'], 'modalPremium')['MASK']
      //     : undefined;

      // //getting the numeric comma separation value for numebr pipe to display the mask accordingly.
      // this.mask =
      //   maskValue != undefined ? maskValue.substring(maskValue.lastIndexOf(':') + 1, maskValue.length) : undefined;
      // if (isNaN(parseFloat(this.mask)) && maskValue != undefined) {
      //   let newMaskValue = maskValue.substring(0, maskValue.lastIndexOf(':'));
      //   this.mask =
      //     newMaskValue != undefined
      //       ? newMaskValue.substring(newMaskValue.lastIndexOf(':') + 1, newMaskValue.length)
      //       : undefined;
      // }
      if (
        this.service.productFacets &&
        this.service.productFacets.data &&
        this.service.productFacets.data['SISUMMARYELEMENTS'] &&
        (this.displayBenefitChart || this.displayLastBenefitChartValues)
      ) {
        let isBodyReq = this.service.isBankPortal();
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
  }

  protected getTabList(): TabItem[] {
    if (this.newPremiumLayout) {
      const tabList: TabItem[] = [
        {
          id: 'benefitSummary',
          isSelected: true,
          imageSrc: 'icon-e-app',
        },
      ];

      if (
        this.service.productFacets &&
        this.service.productFacets.data &&
        this.service.productFacets.data['SISUMMARYELEMENTS'] &&
        this.displayBenefitChart
      ) {
        tabList.push({
          id: 'illustrationChart',
          isSelected: false,
          imageSrc: 'icon-illustration',
        });
      }

      return tabList;
    } else {
      return [
        {
          id: 'illustrationChart',
          isSelected: true,
        },
        {
          id: 'illustrationTable',
          isSelected: false,
        },
      ];
    }
  }

  setTab(tab: TabItem) {
    this.selectedTab = tab;
  }

  onConvertToEappClick(event) {
    let respData: any;
    this.service.convertToEapp().subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        this.router.navigate(['policy/' + respData.data.Entity.policySeq]);
        // alert(
        //     'Policy record ' +
        //         respData.data.Entity.policySeq +
        //         ' generated.'
        // );
        console.log('ConvertToEapp  successful.');
      },
      (error) => {
        console.log('ConvertToEapp failed.');
        console.log('Error:', error);
      }
    );
  }

  /**
   * This invokes when sendpdf button is clicked.
   */
  onSendPDFClick() {
    // this.getPDFContent('getPDFContnetFromSummarry');
    this.openPDF({
      insuredName: { background: '#018acd', color: '#fff' },
      h4: {
        padding: '6px 6px 6px 13px !important',
        color: '#018acd',
      },
    });
    // this.downloadPDF({
    //   insuredName: { background: '#018acd', color: '#fff' },
    //   h4: {
    //     padding: '6px 6px 6px 13px !important',
    //     color: '#018acd',
    //   },
    // });
  }

  public getNetPremium(modalPremium: number, discount: number): number {
    let netPremium = 0;
    if (modalPremium != null && discount != null) {
      netPremium = modalPremium - discount;
    }
    return netPremium;
  }
  /**D3 variables changes starts*/
  createDataForGraph(rateIndex) {
    this.selectedGraphPer = rateIndex;
    /** sorting data for line logic */
    this.dataList = [];
    this.plotDetails = [];

    for (let b = 0; b < this.illustrationResult['siSummaryElements'].length; b++) {
      this.plotDetails.push({
        fieldCd: this.illustrationResult['siSummaryElements'][b],
        displayedLabelText: this.illustrationResult['elementLabel'][b],
      });
    }

    for (let i = 0; i < this.illustrationResult['ageToPrint'].length; i++) {
      this.dataList.push({ x: this.illustrationResult['ageToPrint'][i] });
    }

    for (let a = 0; a < this.illustrationResult['rateOrder'].length; a++) {
      for (let b = 0; b < this.illustrationResult['siSummaryElements'].length; b++) {
        let selectedIndex = rateIndex != undefined ? rateIndex : a;
        for (
          let i = 0;
          i <
          this.illustrationResult['calculatedData'][this.illustrationResult['rateOrder'][selectedIndex]]['data'][b]
            .length;
          i++
        ) {
          for (let j = 0; j < this.illustrationResult['yearsToPrint'].length; j++) {
            this.dataList[j][this.illustrationResult['siSummaryElements'][b]] =
              this.illustrationResult['calculatedData'][this.illustrationResult['rateOrder'][selectedIndex]][
                'data'
              ][b][this.illustrationResult['yearsToPrint'][j] - 1];
          }
        }
      }
    }
  }
  /**D3 variables changes ends*/

  protected fetchIllustrationResult(event: any) {
    if (!this.illustrationResult) this.doCalculation();
  }
}
