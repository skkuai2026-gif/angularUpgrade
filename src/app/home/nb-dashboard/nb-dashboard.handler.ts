import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { BusinessCommonService } from 'src/app/business-common/service/business-common.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import { Router } from '@angular/router';
// import * as Chart from 'chart.js';
import Chart from 'chart.js';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class NbDashboardHandlerComponent
  extends BaseComponent<BusinessCommonService>
  implements OnInit, AfterViewInit
{
  [x: string]: any;
  @ViewChild('fullCalendar', { static: true }) calendarComponent: FullCalendarComponent;
  listViewArr: any[] = [];
  public pieChartArr: any[] = [];
  public currentSelectedPieChartObj: any;
  public calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth', //timeGridWeek,timeGridDay,listMonth',
    },
    initialDate: '2024-04-01', // TODO change to current system date.
    navLinks: true, // can click day/week names to navigate views
    businessHours: true, // display business hours
    editable: true,
    selectable: true,
    height: '100%',
  };

  public dashboardData: any;
  constructor(public businessCommonService: BusinessCommonService, public router: Router) {
    super(businessCommonService);
    this.currentSelectedPieChartObj = undefined;
  }

  ngOnInit() {
    let data = this.businessCommonService.getDashboardData();
    // console.log( data );
    this.dashboardData = data['default']; // data obtained adds default keyword
    setTimeout(() => {
      this.calendarOptions.events = this.dashboardData.dashBoard.CalendarView.data;
    }, 50);
    this.setRecentRecordList();
    this.setPieChartRecordList();
  }

  ngAfterViewInit() {}

  /*
    onResize ( event )
    {
      this.ngAfterViewInit();
      //event.target.innerWidth;
    }*/
  protected setPieChartOptions(elementIdName: string, chartOptionsObj: any) {
    let pieChartLabels = [];
    let pieChartData = [];
    let pieChartColor = [];
    let pieChart: any;
    let pieChartLabelObj: any = [];
    pieChartLabels = [];
    pieChartData = [];

    for (let i = 0; i < chartOptionsObj.data.length; i++) {
      if (chartOptionsObj.data[i] > 0) {
        pieChartData.push(chartOptionsObj.data[i]);
        pieChartLabels.push(chartOptionsObj.label[i].label);
        pieChartColor = this.getColor();
        pieChartLabelObj.push(chartOptionsObj.label[i]);
      }
    }

    pieChart = new Chart(elementIdName, {
      type: 'pie',
      data: {
        labels: pieChartLabels,
        datasets: [
          {
            backgroundColor: pieChartColor,
            data: pieChartData,
          },
        ],
      },
      options: {
        responsive: true,
        title: null,
        plugins: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          credits: {
            enabled: false,
          },
        },
        legend: {
          display: true,
          position: this.service.isMobileViewRendeered() ? 'bottom' : 'right',
          labels: {
            generateLabels: () => {
              var result = [];
              pieChartLabels.forEach((label, i) => {
                result.push({
                  text: pieChartLabels[i] + ' (' + pieChartData[i] + ')',
                  fillStyle: pieChartColor[i],
                  index: i,
                });
              });
              return result;
            },
          },
          onClick: (event, legendItem) => {
            this.onPieChartClick(event, pieChartLabelObj[legendItem.index], elementIdName);
          },
        },
        onClick: (event, chartElements) => {
          // if (chartElements && chartElements.length > 0) {
          //   this.onPieChartClick(event, chartElements[0]['_model'].label, elementIdName);
          // }
          if (chartElements && chartElements.length > 0) {
            const index = chartElements[0]['_index'];
            this.onPieChartClick(event, pieChartLabelObj[index], elementIdName);
          }
        },
      },
    });

    // HighCharts.chart(elementIdName, {
    //   chart: {
    //     plotBackgroundColor: null,
    //     plotBorderWidth: null,
    //     plotShadow: false,
    //     type: 'pie',
    //   },
    //   exporting: {
    //     enabled: false,
    //   },
    //   credits: {
    //     enabled: false,
    //   },
    //   title: {
    //     text: null,
    //   },
    //   accessibility: {
    //     point: {
    //       valueSuffix: '%',
    //     },
    //   },
    //   legend: {
    //     layout: 'vertical',
    //     align: 'right',
    //     verticalAlign: this.service.isMobileViewRendeered() ? 'bottom' : 'middle',
    //     itemMarginTop: 4,
    //     itemMarginBottom: 4,
    //   },
    //   plotOptions: {
    //     pie: {
    //       allowPointSelect: true,
    //       cursor: 'pointer',
    //       dataLabels: {
    //         enabled: false,
    //       },
    //       showInLegend: true,
    //     },
    //   },
    //   series: [
    //     {
    //       type: 'pie',
    //       name: 'Status',
    //       colorByPoint: true,
    //       data: chartOptionsObj.data,
    //     },
    //   ],
    //   responsive: {
    //     rules: [
    //       {
    //         condition: {
    //           maxWidth: 500,
    //         },
    //       },
    //     ],
    //   },
    // });
  }

  protected getRecentRecordArray(): any[] {
    return [
      {
        title: 'recentLeads',
        data: undefined,
        action: 'lead/',
        searchName: 'LeadSearchAPI',
        seqIndex: 6,
        refIndex: 0,
        nameIndex: 1,
      },
      {
        title: 'recentIllustrations',
        data: undefined,
        action: 'quotation/',
        searchName: 'SearchLifeIllustration',
        seqIndex: 9,
        refIndex: 0,
        nameIndex: 2,
      },
      {
        title: 'recentEApplications',
        data: undefined,
        action: 'policy/',
        searchName: 'SearchPolicy',
        seqIndex: 6,
        refIndex: 0,
        nameIndex: 3,
      },
    ];
  }

  public setRecentRecordList() {
    this.listViewArr = this.getRecentRecordArray();

    for (let i = 0; i < this.listViewArr.length; i++) {
      this.service.getSearchList(this.listViewArr[i].searchName, true, null).subscribe(
        (successResponse) => {
          let response = JSON.parse(JSON.stringify(successResponse));
          if (response != undefined && response.data != undefined)
            this.listViewArr[i].data = response.data.searchResultData;
        },
        (error) => {
          // this.errorApiResponse(error);
        }
      );
    }
  }

  protected getPieChartArray(): any[] {
    return [
      {
        id: 'Quotation',
        title: 'quotationStatus',
        data: undefined,
        label: undefined,
        searchName: 'QuotationStatusDashboardView',
        searchDtlResultName: 'SearchLifeIllustration',
        searchTitle: 'Illustrations',
        searchCriteriaData: { 'SearchProspectDO.quoteStatusCd': undefined },
        currentValue: undefined,
        currentLabel: undefined,
        searchResultColumns: [
          'SearchProspectDO.productId',
          'SearchProspectDO.quotationDt',
          'SearchProspectDO.quotationRefNum',
        ],
      },
      {
        id: 'Policy',
        title: 'eAppStatus',
        data: undefined,
        label: undefined,
        searchName: 'PolicyStatusDashboardView',
        searchDtlResultName: 'SearchPolicy',
        searchTitle: 'E-App',
        searchCriteriaData: { 'SearchPolicyDO.policyStatusCd': undefined },
        currentValue: undefined,
        currentLabel: undefined,
        searchResultColumns: [
          'SearchPolicyDO.productId',
          'SearchPolicyDO.proposalNum',
          'SearchPolicyDO.proposalReceivedDt',
        ],
      },
    ];
  }
  public setPieChartRecordList() {
    this.pieChartArr = this.getPieChartArray();
    for (let i = 0; i < this.pieChartArr.length; i++) {
      this.service.getSearchList(this.pieChartArr[i].searchName, true, null).subscribe(
        (successResponse) => {
          let response = JSON.parse(JSON.stringify(successResponse));
          let labelNameList = [];
          Object.keys(response.data.searchResultInfo).forEach((property) => {
            let labelName = {
              label: response.data.searchResultInfo[property].header,
              statusCd: response.data.searchResultInfo[property].colName,
            };
            labelNameList.push(labelName);
          });
          if (response != undefined && response.data != undefined) {
            this.pieChartArr[i].data = response.data.searchResultData[0];
            this.pieChartArr[i].label = labelNameList;
          }
          this.setPieChartOptions(this.pieChartArr[i].id, this.pieChartArr[i]);
        },
        (error) => {
          // this.errorApiResponse(error);
        }
      );
    }
  }

  onLinkClick(link) {
    this.router.navigate([link]);
  }
  onHideStatusList() {
    this.currentSelectedPieChartObj = undefined;
  }
  protected onPieChartClick(event, currentStatus, graphId: string): void {
    this.pieChartArr.filter((chartObj) => {
      if (chartObj.id == graphId) {
        this.currentSelectedPieChartObj = chartObj;
        this.currentSelectedPieChartObj.currentLabel = currentStatus?.label;
        let statusCd = currentStatus?.statusCd != undefined ? currentStatus?.statusCd : currentStatus.label;
        this.currentSelectedPieChartObj.currentValue = statusCd.toUpperCase();
        Object.keys(this.currentSelectedPieChartObj.searchCriteriaData).forEach((property) => {
          this.currentSelectedPieChartObj.searchCriteriaData[property] =
            this.currentSelectedPieChartObj.currentValue;
        });
        this.currentSelectedPieChartObj.searchCriteriaData = JSON.parse(
          JSON.stringify(this.currentSelectedPieChartObj.searchCriteriaData)
        );
      }
    });
  }

  protected getColor() {
    return this.service.getColor();
  }
}
