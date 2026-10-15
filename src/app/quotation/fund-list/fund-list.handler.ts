import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { QuotationService } from '../services/quotation.service';
// import * as Chart from 'chart.js';
import Chart from 'chart.js';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FundListHandlerComponent extends BaseComponent<QuotationService> implements OnChanges {
  /**
   *
   * This is used to to show only the selected fund legends.
   * by default its false.
   *
   */
  showOnlySelectFundsInLegend: boolean;

  chart: Chart;
  fundAllocationGraph: any;
  allocationPercData = [];
  allocationPercLabels = [];
  pieColorArray = [];
  isPieChartRequired: boolean;
  totalallocationPerc: number;
  totaltopupAllocationPerc: number;
  constructor(quotationService: QuotationService, public settingService: SettingService) {
    super(quotationService);
    this.isPieChartRequired = true;
    this.totalallocationPerc = 0;
    this.totaltopupAllocationPerc = 0;
    this.showOnlySelectFundsInLegend = false;
  }
  ngOnInit() {
    this.resetFundPieData();
  }

  public resetFundPieData() {
    this.loadPieData();
    this.setTotalValue();
    setTimeout(() => {
      this.initPieChart();
    }, 15);
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this.resetFundPieData();
  }

  private loadPieData() {
    this.allocationPercData = [];
    this.pieColorArray = [];
    let globalColorArray = this.getColor();
    this.allocationPercLabels = [];
    if (this.service.responseIO.data.BasePlan?.FundList != undefined) {
      this.service.responseIO.data.BasePlan.FundList.filter((fund, index) => {
        let fundPerc: number = 0;
        if (fund.allocationPerc != undefined) fundPerc = parseInt(fund.allocationPerc);
        if (fundPerc > 0 && this.showOnlySelectFundsInLegend)
          this.allocationPercLabels.push(this.service.getFieldLookupDesc(fund, 'fundCd'));
        else if (!this.showOnlySelectFundsInLegend)
          this.allocationPercLabels.push(this.service.getFieldLookupDesc(fund, 'fundCd'));
        this.allocationPercData.push(fundPerc);
        // this.pieColorArray = this.getColor();
        if (fund.addtnlFld1Str != undefined) {
          this.pieColorArray.push(fund.addtnlFld1Str);
        } else {
          this.pieColorArray.push(globalColorArray[index]);
        }
        if (this.allocationPercData.length > this.pieColorArray.length) {
          this.pieColorArray.push(this.getRandomColor());
        }
      });
    }
  }

  protected portfolioModelCd_change(item: FieldItem) {
    this.service.getProductFunds(item, () => {
      this.resetFundPieData();
    });
    //this.resetFundPieData();
  }
  protected portfolioModelCd_focus(item: FieldItem) {
    this.service.getPortfolioModelCd(item);
  }

  protected topUpAllocSameAsPremAllocFl_change(item: FieldItem) {
    this.setTotalValue('topupAllocationPerc');
  }

  public initPieChart() {
    if (this.allocationPercData && this.allocationPercData.length > 0 && this.isPieChartRequired) {
      if (this.fundAllocationGraph) this.fundAllocationGraph.destroy();
      this.fundAllocationGraph = new Chart('pieChart', {
        type: 'pie',
        data: {
          labels: this.allocationPercLabels,
          datasets: [
            {
              backgroundColor: this.pieColorArray,
              hoverBackgroundColor: this.pieColorArray,
              data: this.allocationPercData,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            callbacks: {
              label: function (tooltipItems, data) {
                return (
                  data.labels[tooltipItems.index] +
                  ' : ' +
                  data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] +
                  '%'
                );
              },
            },
          },
          plugins: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            credits: {
              enabled: false,
            },
            title: {
              display: true,
              text: null,
            },
          },
          legend: {
            display: true,
            onClick: null,
            position: this.settingService.isMobileViewRendered() ? 'bottom' : 'right',
            labels: {
              generateLabels: () => {
                var result = [];
                this.allocationPercLabels.forEach((label, i) => {
                  result.push({
                    text: this.allocationPercLabels[i],
                    fillStyle: this.pieColorArray[i],
                  });
                });
                return result;
              },
            },
          },
        },
      });
    }
  }

  allocationPerc_change(item: FieldItem) {
    this.setTotalValue('allocationPerc');
    if (this.fundAllocationGraph != undefined) {
      //only update the allocation percentage values as the rest of the colors remain the same.
      this.allocationPercData = [];
      this.allocationPercLabels = [];
      this.service.responseIO.data.BasePlan.FundList.filter((fund, index) => {
        let fundPerc: number = 0;
        if (fund.allocationPerc != undefined) fundPerc = parseInt(fund.allocationPerc);
        if (fundPerc > 0 && this.showOnlySelectFundsInLegend)
          this.allocationPercLabels.push(this.service.getFieldLookupDesc(fund, 'fundCd'));
        else if (!this.showOnlySelectFundsInLegend)
          this.allocationPercLabels.push(this.service.getFieldLookupDesc(fund, 'fundCd'));
        this.allocationPercData.push(fundPerc);
      });
      setTimeout(() => {
        this.initPieChart();
      }, 5);
    } else {
      this.loadPieData();
      setTimeout(() => {
        this.initPieChart();
      }, 0);
    }
  }

  topupAllocationPerc_change(item: FieldItem) {
    this.setTotalValue('topupAllocationPerc');
  }

  /**
   * Sets the total allocation percentage of all the entered funds
   * @param attributeCd - attribute whose sum has to be calculated
   */
  private setTotalValue(attributeCd?: string): void {
    if (attributeCd == undefined || attributeCd == 'allocationPerc') this.totalallocationPerc = 0;
    if (attributeCd == undefined || attributeCd == 'topupAllocationPerc') this.totaltopupAllocationPerc = 0;
    if (this.service.responseIO.data.BasePlan?.FundList != undefined) {
      this.service.responseIO.data.BasePlan.FundList.filter((fund) => {
        if (attributeCd == undefined || attributeCd == 'allocationPerc') {
          this.totalallocationPerc +=
            fund['allocationPerc'] !== undefined && isNaN(parseInt(fund['allocationPerc'])) == false
              ? parseInt(fund['allocationPerc'])
              : 0;
        }
        if (attributeCd == undefined || attributeCd == 'topupAllocationPerc') {
          this.totaltopupAllocationPerc +=
            fund['topupAllocationPerc'] !== undefined && isNaN(parseInt(fund['topupAllocationPerc'])) == false
              ? parseInt(fund['topupAllocationPerc'])
              : 0;
        }
      });
    }
  }

  /**
   * This method generate random colors each time.
   * @returns random #colors to display.
   */
  private getRandomColor() {
    return this.service.getRandomColor();
  }

  private getColor() {
    return this.service.getColor();
  }
}
