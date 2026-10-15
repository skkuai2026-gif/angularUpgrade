import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CSASLGFIService } from '../service/csa-slgfi-service.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { HttpClient } from '@angular/common/http';
import { FieldItem } from 'src/app/models/common/field-item';
import { NavigationLink } from 'src/app/models/common/navigation-link';
// import * as Chart from 'chart.js';
import Chart from 'chart.js';

@Component({
  selector: 'sym-csa-slgfi-risk-profile',
  templateUrl: './csa-slgfi-risk-profile.component.html',
  styleUrls: ['./csa-slgfi-risk-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CSASLGFIRiskProfileComponent extends BaseComponent<CSASLGFIService> {
  chart: Chart;
  fundAllocationGraph: any;
  allocationPercData = [];
  allocationPercLabels = [];
  @Input() hidePieChart: boolean;
  pieColorArray = [];
  isPieChartRequired: boolean;
  searchCriteriaforProposal: any;
  totalallocationPerc: number;
  totaltopupAllocationPerc: number;
  navigationLinkList: NavigationLink[];
  @Output() computeRiskScoreClick = new EventEmitter<any>();
  @Input() hideNavigationLinkList: boolean = false;
  message: any;
  isRiskFundApplicable: any;
  okAcceptConfirmation: boolean = false;
  constructor(public service: CSASLGFIService, public settingService: SettingService) {
    super(service);
    this.isPieChartRequired = true;
    this.totalallocationPerc = 0;
    this.totaltopupAllocationPerc = 0;
    this.searchCriteriaforProposal = {
      'SearchProspectDO.fnaId': this.service.responseIO.data.Entity.fnaNum,
    };
    if (this.settingService.isMobileViewRendered()) {
      this.isPieChartRequired = false;
    }
  }

  ngOnInit() {
    this.service.responseIO.data.LeadRPQ.RPQResponseList.forEach((leadRpq: any) => {
      leadRpq['objName'] = this.service.responseIO.data.LeadRPQ.RPQResponseList[0].objName;
    });
    this.service.responseIO.data.FNAFundList.forEach((fnaFund: any) => {
      fnaFund['objName'] = this.service.responseIO.data.FNAFundList[0].objName;
    });
    const userdata = this.service.getUserLoginData();
    let agentID = userdata?.['UserId'];
    this.service.getRiskFundApplicable(agentID).subscribe((resp) => {
      var respData = JSON.parse(JSON.stringify(resp));
      console.log('respData', respData);
      let isRiskFundApplicableFlag = respData.data.isRiskFundApplicable;
      if (isRiskFundApplicableFlag === true) {
        this.isRiskFundApplicable = true;
      } else {
        this.isRiskFundApplicable = false;
      }
      // console.log('Get search list failed.');
      // console.log('Error:', error);
    });
    this.loadNavigationLinkList();
    this.loadPieData();
    this.setTotalValue();
    setTimeout(() => {
      this.initPieChart();
    }, 15);

    this.service.fundRiskClassLabel = undefined;
    this.service.fundRiskClass = undefined;
    if (this.service.responseIO.data.LeadRPQ == '') {
      this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'rpqScore', 0);
      this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'address1', 'INDIVIDUAL');
      // this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'address', 'INDIVIDUAL');
    }

    this.computeRiskScore(false);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this.loadNavigationLinkList();
    super.ngOnChanges(changes);
    this.loadPieData();
    // this.populateFundListbasisPackage();
    this.setTotalValue();
    setTimeout(() => {
      this.initPieChart();
    }, 15);
  }
  ngafterviewInit() {
    // console.log('PACKAGEFUNDAPPLICABLE',this.service.companyFacets.data['PACKAGEFUNDAPPLICABLE']);
    // console.log('this.service.companyFacets.data',this.service.companyFacets.data.PACKAGEFUNDAPPLICABLE === 'YES')
  }

  private setTotalValue(attributeCd?: string): void {
    if (attributeCd == undefined || attributeCd == 'allocationPerc') this.totalallocationPerc = 0;
    if (attributeCd == undefined || attributeCd == 'topupAllocationPerc') this.totaltopupAllocationPerc = 0;
    if (this.service.responseIO.data?.FNAFundList != undefined) {
      this.service.responseIO.data.FNAFundList.filter((fund) => {
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

  private initPieChart() {
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

  public incomeGroup_focus(item: FieldItem) {
    let newAdvisorFundList = [];
    this.service.responseIO.data.FNAFundList.filter((resp) => {
      console.log('income', resp.fundCd);
      var fundChosen = new Object();
      fundChosen['cd'] = resp.fundCd;
      fundChosen['desc'] = this.service.getFieldLookupDesc(resp, 'fundCd');
      newAdvisorFundList.push(fundChosen);
    });
    let respAdvisorFundCd: any;
    respAdvisorFundCd = JSON.parse(JSON.stringify(newAdvisorFundList));
    console.log('respOccupationCd', newAdvisorFundList);
    this.service.setItemOptions(item, respAdvisorFundCd, null);
  }

  public score_change() {
    this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'rpqScore', 0);
    this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'address1', 'INDIVIDUAL');
    this.service.setModelFieldValue(this.service, 'fundRiskClassLabel', undefined);
    this.service.setModelFieldValue(this.service, 'fundRiskClass', undefined);
  }

  public allocationPerc_change(item: FieldItem) {
    this.setTotalValue('allocationPerc');
    if (this.fundAllocationGraph != undefined) {
      //only update the allocation percentage values as the rest of the colors remain the same.
      this.allocationPercData = [];
      this.service.responseIO.data.FNAFundList.filter((fund, index) => {
        let fundPerc: number = null;
        if (fund.allocationPerc != undefined) fundPerc = parseInt(fund.allocationPerc);
        this.allocationPercData.push(fundPerc);
      });
      setTimeout(() => {
        this.initPieChart();
      }, 5);
    } else {
      this.loadPieData();
      setTimeout(() => {
        this.initPieChart();
      }, 5);
    }
    let newClientFundList = [];
    let fundString = '';
    this.service.responseIO.data.FNAFundList.filter((resp) => {
      if (resp.allocationPerc != null && resp.allocationPerc > 0) {
        fundString = fundString + ',' + resp.fundCd;
      }
    });
    fundString = fundString.slice(1);
    this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'education', fundString);
  }

  /**
   * This method generate random colors each time.
   * @returns random #colors to display.
   */
  private getRandomColor() {
    return this.service.getRandomColor();
  }

  protected getColor() {
    if (SettingService.getApplicationPropertiesValue('COMPANYCOLOUR') === 'SLGFI') {
      return ['#E0DCD1', '#FFBD0E', '#1D5798', '#E5E5E5'];
    } else {
      return ['#E0DCD1', '#4A7283', '#FEBE10'];
    }
  }

  private loadPieData() {
    this.allocationPercData = [];
    this.pieColorArray = [];
    this.allocationPercLabels = [];
    let globalColorArray = this.getColor();
    if (this.service.responseIO.data?.FNAFundList != undefined) {
      this.service.responseIO.data.FNAFundList.filter((fund, index) => {
        this.allocationPercLabels.push(this.service.getFieldLookupDesc(fund, 'fundCd'));
        let fundPerc: number = null;
        if (fund.allocationPerc != undefined) fundPerc = parseInt(fund.allocationPerc);
        this.allocationPercData.push(fundPerc);
        // this.pieColorArray = this.getColor();
        if (fund.field2 != undefined) {
          this.pieColorArray.push(fund.field2);
        } else {
          this.pieColorArray.push(globalColorArray[index]);
        }
        if (this.allocationPercData.length > this.pieColorArray.length) {
          this.pieColorArray.push(this.getRandomColor());
        }
      });
    }
  }

  protected loadNavigationLinkList() {
    this.navigationLinkList = [];
    if (this.hideNavigationLinkList) return this.navigationLinkList;
    let nav = new NavigationLink();

    nav.link = 'rpq_Details_Body';
    nav.labelKey = 'RPQDETAILS';
    this.navigationLinkList.push(nav);

    nav = new NavigationLink();
    nav.link = 'rpq_score';
    nav.labelKey = 'RPQSCORE';
    this.navigationLinkList.push(nav);
    console.log('compute Risk Score', this.navigationLinkList);

    nav = new NavigationLink();
    nav.link = 'fund_option';
    nav.labelKey = 'FUNDOPTIONS';
    this.navigationLinkList.push(nav);
  }

  public rpqChanged() {
    this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'rpqScore', 0);
    this.service.setModelFieldValue(this.service, 'fundRiskClassLabel', undefined);
    this.service.setModelFieldValue(this.service, 'fundRiskClass', undefined);
  }

  computeRiskScore(saveFlag?: boolean) {
    // console.log('compute Risk Score');
    var rpqScore = 0;
    this.service.responseIO.data.LeadRPQ.RPQResponseList.filter((resp) => {
      if (resp.score != undefined && resp.score != null) {
        rpqScore += Number(resp.score);
      }
    });
    // console.log('rpqScore' + rpqScore);

    this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'rpqScore', rpqScore);
    if (saveFlag == undefined || saveFlag) this.computeRiskScoreClick.emit(rpqScore);
    this.service.computeRiskScore(rpqScore);
  }
  public address1_change(item: FieldItem) {
    if (item.event) {
      // alert(item.fieldValue);
      const leadRPQ = this.service.responseIO.data.LeadRPQ;
      const score = leadRPQ.rpqScore;

      if (!score || score === 0) {
        if (item.fieldValue == 'PACKAGE') {
          this.service.setModelFieldValue(item.model, 'address1', 'INDIVIDUAL');
        }
        alert('RPQ Score is zero. Please compute the score before proceeding.');
        // this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'address1',  respData.defaultFund['industryCd']);
        // this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'address1', 'INDIVIDUAL');
      } else this.handleRPQScoreMapping(item.fieldValue);
    }
  }

  handleRPQScoreMapping(addrs1) {
    const userdata = this.service.getUserLoginData();
    let agentID = userdata?.['UserId'];
    let fnaId = this.service.responseIO.data.LeadRPQ.fnaId;
    if (addrs1 === 'PACKAGE') {
      this.service.getDefaultFundPackage(this.service.responseIO.data.LeadRPQ.rpqScore, agentID, fnaId).subscribe(
        (successResponse) => {
          let respData = JSON.parse(JSON.stringify(successResponse));
          // console.log('data316..respData322.',respData)
          if (respData.success == false) {
            this.message = respData.message;
            this.confirm(
              this.message,
              () => {
                this.okAcceptConfirmation = true;
              },
              () => {
                let fnaId = this.service.responseIO.data.LeadRPQ.fnaId;
                this.populateIndividualFunds(fnaId);
                // this.service.setModelFieldValue(this.service.responseIO.data.Entity, 'counterOfferDecisionCd', null);
              }
            );
            // let fnaId = this.service.responseIO.data.LeadRPQ.fnaId;
            // this.populateIndividualFunds(fnaId);
          } else {
            let defaultFund = respData.data.defaultFund;
            // console.log('337;;;;;;;;;;;;;',defaultFund);
            this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'address2', defaultFund);
            //  console.log('respData.defaultFundPackage',respData.defaultFund);
            this.populateFundListbasisPackage(fnaId);
          }
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    } else {
      let fnaId = this.service.responseIO.data.LeadRPQ.fnaId;
      this.populateIndividualFunds(fnaId);
    }
  }

  populateIndividualFunds(fnaId: number) {
    this.service.getPopulateIndividualFunds(fnaId).subscribe((successResponse) => {
      let respData = JSON.parse(JSON.stringify(successResponse));
      this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'address1', 'INDIVIDUAL');
      console.log('this.service.responseIO.data', this.service.responseIO.data);
      this.service.responseIO.data.FNAFundList = respData.data.FNAFundList;

      if (respData.metadata != undefined) this.service.responseIO.metadata = respData.metadata;
      if (respData.lookups != undefined) this.service.responseIO.lookups = respData.lookups;
      this.changePackageOption();
    });
  }
  public address2_change(item: FieldItem) {
    let fnaId = this.service.responseIO.data.LeadRPQ.fnaId;
    this.populateFundListbasisPackage(fnaId);
  }
  public changePackageOption() {
    this.setTotalValue('allocationPerc');
    if (this.fundAllocationGraph != undefined) {
      //only update the allocation percentage values as the rest of the colors remain the same.
      this.allocationPercData = [];
      this.service.responseIO.data.FNAFundList.filter((fund, index) => {
        let fundPerc: number = null;
        if (fund.allocationPerc != undefined) fundPerc = parseInt(fund.allocationPerc);
        this.allocationPercData.push(fundPerc);
      });
      setTimeout(() => {
        this.initPieChart();
      }, 5);
    } else {
      this.loadPieData();
      setTimeout(() => {
        this.initPieChart();
      }, 5);
    }
    let newClientFundList = [];
    let fundString = '';
    this.service.responseIO.data.FNAFundList.filter((resp) => {
      if (resp.allocationPerc != null && resp.allocationPerc > 0) {
        fundString = fundString + ',' + resp.fundCd;
      }
    });
    fundString = fundString.slice(1);
    this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'education', fundString);
  }
  populateFundListbasisPackage(fnaId: any) {
    this.service.getpopulateFundListbasisPackage(this.service.responseIO.data.LeadRPQ.address2, fnaId).subscribe(
      (successResponse) => {
        let respData = JSON.parse(JSON.stringify(successResponse));
        this.service.responseIO.data.FNAFundList = respData.data.FNAFundList;

        this.changePackageOption();

        if (respData.metadata != undefined)
          respData.data.FNAFundList.forEach((fund, index) => {
            respData.metadata[fund['guid']]['allocationPerc'].ENABLED = 'NO';
          });
        this.service.responseIO.metadata = respData.metadata;
        if (respData.lookups != undefined) this.service.responseIO.lookups = respData.lookups;
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
