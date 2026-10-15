import { TabItem } from './../../models/common/tab-items';
import { QuotationService } from './../services/quotation.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { Component, OnInit, OnChanges, Input, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { SettingService } from 'src/app/system-common/services/setting.service';
// import { Chart } from 'angular-highcharts';
import { BaseService } from 'src/app/system-common/services/base.service';
import { Router } from '@angular/router';
// import * as Chart from 'chart.js';
import Chart from 'chart.js';
import { ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { PremiumSummaryComponent } from '../premium-summary/premium-summary.component';
declare const commarize: any;

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ComboPremiumSummaryHandlerComponent extends PremiumSummaryComponent implements OnChanges, OnInit {
  @Input() displayBenefitSummary: boolean;
  @Input() displayBenefitChart: boolean;
  @Input() displayLastBenefitChartValues: boolean;

  public fieldCodes: string[];
  totalModalPremium: number = 0;
  illustrationResult: any;
  tabList: TabItem[];
  selectedTab: TabItem;
  chart: Chart;
  rateLength: number;
  selectedGraphPer;
  isConvertToEappReq: boolean;
  public isCustomerPortal: boolean;
  totalNetPremium: number;
  totalServiceTax: number;
  totalDiscount: number;
  mask: string;
  idList: number[] = [];

  lineChartLabels: Label[] = [];
  lineChartData = [];
  lineChartOptions: ChartOptions = {
    responsive: true,
  };
  lineChartType = 'line';
  lineChartPlugins = [];
  comboChildPrdServiceList = [];

  constructor(
    public quotationService: QuotationService,
    public router: Router,
    public settingService: SettingService
  ) {
    super(quotationService, router, settingService);
    this.displayBenefitSummary = true;
    this.displayBenefitChart = true;
    this.isConvertToEappReq = false;
    this.isCustomerPortal = this.settingService.isCustomerPortal();
    // console.log(this.service.responseIO.data);
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadChildComboProducts();
      this.doCalculation();
    }, 25);
  }

  public loadChildComboProducts() {
    let ids = this.service.responseIO.data.Entity.childQuoteReference;
    JSON.parse(ids).forEach((childQuoteReference) => {
      this.idList.push(childQuoteReference['quotationSeq']);
    });

    // let quotationChildService = SettingService.getInjector().get(QuotationService);
    // quotationChildService.id = 12406;
    // quotationChildService.load(12406, ['Entity']);
    // console.log('loaded');
    //  console.log('loaded');
  }

  protected doCalculation() {
    if (this.service.responseIO != undefined) {
      this.doTotalCalculation(this.service);
      this.tabList = [];
      this.tabList = this.getTabList();
      this.selectedTab = this.tabList[0];
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

  public getNetPremium(modalPremium: number, discount: number): number {
    let netPremium = 0;
    if (modalPremium != null && discount != null) {
      netPremium = modalPremium - discount;
    }
    return netPremium;
  }

  onComboChildPrdLoad(comboChildPrdService) {
    this.comboChildPrdServiceList.push(comboChildPrdService);
    //console.log('comboChildPrdService', this.comboChildPrdServiceList);
    this.doTotalCalculation(comboChildPrdService);
  }

  public doTotalCalculation(quotationService) {
    let riderModalPremium = 0;
    let riderServiceTax = 0;
    let riderDiscount = 0;
    let riderNetPremium = 0;
    let riderList = quotationService.responseIO.data.RiderList;
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
      quotationService.productFacets &&
      quotationService.productFacets.data &&
      quotationService.productFacets.data['MULTILIFEAPPLICABLE'] &&
      quotationService.productFacets.data['MULTILIFEAPPLICABLE'].length > 0 &&
      quotationService.productFacets.data['MULTILIFEAPPLICABLE'] == 'YES' &&
      quotationService.responseIO.data.SupplementaryList != undefined &&
      quotationService.responseIO.data.SupplementaryList.length > 0
    ) {
      Object.keys(quotationService.responseIO.data.SupplementaryList).forEach((key) => {
        multiLifePremium =
          multiLifePremium + quotationService.responseIO.data.SupplementaryList[key]['modalPremium'];
      });
    }
    let basePlan = quotationService.responseIO.data.BasePlan;
    let baseModalPremium = basePlan['modalPremium'];

    this.totalModalPremium =
      this.totalModalPremium +
      (riderModalPremium != undefined && baseModalPremium != undefined
        ? riderModalPremium + baseModalPremium + multiLifePremium
        : 0);

    this.totalServiceTax =
      this.totalServiceTax +
      (riderServiceTax != undefined && basePlan['serviceTax'] != undefined
        ? riderServiceTax + basePlan['serviceTax']
        : 0);
    this.totalDiscount =
      this.totalDiscount +
      (riderDiscount != undefined && basePlan['totDiscount'] != undefined
        ? riderDiscount + basePlan['totDiscount']
        : 0);
    this.totalNetPremium =
      this.totalNetPremium +
      (riderNetPremium != undefined &&
      this.getNetPremium(basePlan['modalPremium'], basePlan['totDiscount']) != undefined
        ? riderNetPremium + this.getNetPremium(basePlan['modalPremium'], basePlan['totDiscount'])
        : 0);
  }
}
