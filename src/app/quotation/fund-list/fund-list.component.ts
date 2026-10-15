import { Component, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { QuotationService } from '../services/quotation.service';
import { FundListHandlerComponent } from './fund-list.handler';
import { DynamicComponentList } from '../services/dynamic-component-list';
import { FieldItem } from 'src/app/models/common/field-item';
// import * as Chart from 'chart.js';
import Chart from 'chart.js';

@Component({
  selector: 'sym-fund-list',
  templateUrl: './fund-list.component.html',
  styleUrls: ['./fund-list.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FundListComponent extends FundListHandlerComponent {
  @Input() hidePieChart: boolean;
  public companySUNPH;
  /**
   *
   * This is used to to show only the selected fund legends.
   * by default its false.
   *
   */
  @Input() showOnlySelectedFundsInLegend: boolean;

  constructor(quotationService: QuotationService, public settingService: SettingService) {
    super(quotationService, settingService);
    if (this.settingService.isMobileViewRendered()) {
      this.isPieChartRequired = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.showOnlySelectFundsInLegend = this.showOnlySelectedFundsInLegend;
    super.ngOnChanges(changes);
    if (changes['hidePieChart'] && changes['hidePieChart'].currentValue) {
      setTimeout(() => {
        this.isPieChartRequired = !this.hidePieChart;
      }, 10);
    }
    super.ngOnChanges(changes);
  }
  public allocationPerc_change(item: FieldItem) {
    super.allocationPerc_change(item);
    if (this.service.responseIO.data.WithdrawalList && this.service.responseIO.data.WithdrawalList.length > 0) {
      this.service.responseIO.data.Entity.campaignCode = 'RESET';
    }
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
            position: 'right',
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
  ngOnInit(): void {
    super.ngOnInit();
    this.companySUNPH = SettingService.getApplicationPropertiesValue('COMPANYCOLOUR');
    this.service.responseIO.data.BasePlan.FundList.forEach((fundList: any) => {
      fundList['objName'] = this.service.responseIO.data.BasePlan.FundList[0].objName;
    });
  }
  onRefreshFundClick() {
    this.service.refreshFunds(() => {
      this.resetFundPieData();
    });
  }
}
