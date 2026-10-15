import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { BusinessCommonService } from 'src/app/business-common/service/business-common.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import { Router } from '@angular/router';
// import * as Chart from 'chart.js';
import Chart from 'chart.js';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import { NbDashboardHandlerComponent } from './nb-dashboard.handler';
import { SettingService } from 'src/app/system-common/services/setting.service';

@Component({
  selector: 'sym-nb-dashboard',
  templateUrl: './nb-dashboard.component.html',
  styleUrls: ['./nb-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class NbDashboardComponent extends NbDashboardHandlerComponent {
  constructor(
    public businessCommonService: BusinessCommonService,
    public settingService: SettingService,
    public router: Router
  ) {
    super(businessCommonService, router);
  }
  ngOnInit(): void {
    super.ngOnInit();
  }
  ngAfterViewInit(): void {}
  protected getPieChartArray(): any[] {
    //  console.log("--InDashboard---");
    let pieChartArray = super.getPieChartArray();

    pieChartArray.filter((pieChart) => {
      if (pieChart.id == 'Quotation') {
        pieChart.searchTitle = 'Proposals';
        pieChart.searchResultColumns = [
          'SearchProspectDO.baseSumAssured',
          'SearchProspectDO.baseAnnualPremium',
          'SearchProspectDO.productId',
          'SearchProspectDO.systemUpdatedDt',
          'SearchTrackLeadDO.fullName',
        ];
      }
      if (pieChart.id == 'Policy') {
        pieChart.searchResultColumns = [
          'SearchTrackLeadDO.productId',
          'SearchPolicyDO.proposalNum',
          'SearchProspectDO.systemUpdatedDt',
        ];
      }
    });
    return pieChartArray;
  }

  protected getRecentRecordArray(): any[] {
    let optionList: any[];
    optionList = [];
    optionList.push({
      title: this.service.getMultilingualLabel('recentLeads'),
      header: ['Client', 'Mobile Number', 'Created On'],
      data: undefined,
      action: 'lead/',
      searchName: 'LeadSearchAPI',
      seqIndex: 4,
      nameIndex: 3,
      nameIndex1: 1,
      refIndex: 0,
    });
    if (SettingService.getApplicationPropertiesValue('COMPANYCOLOUR') === 'SLGFI') {
      optionList.push({
        title: this.service.getMultilingualLabel('recentCSA'),
        header: ['Client', 'Status', 'Updated Date'],
        data: undefined,
        action: 'csa-slgfi/',
        searchName: 'SearchFNARequest',
        seqIndex: 5,
        refIndex: 0,
        nameIndex: 4,
        nameIndex1: 3,
      });
    } else {
      optionList.push({
        title: this.service.getMultilingualLabel('recentCSA'),
        header: ['Client', 'Status', 'Updated Date'],
        data: undefined,
        action: 'csa/',
        searchName: 'SearchFNARequest',
        seqIndex: 5,
        refIndex: 0,
        nameIndex: 4,
        nameIndex1: 3,
      });
    }
    if (SettingService.getApplicationPropertiesValue('COMPANYCOLOUR') === 'SLGFI') {
      optionList.push({
        title: this.service.getMultilingualLabel('recentIllustrations'),
        header: ['Insured Name', 'Plan Name', 'Updated Date'],
        data: undefined,
        action: 'quotation/',
        searchName: 'SearchLifeIllustration',
        seqIndex: 8,
        refIndex: 1,
        nameIndex: 7,
        nameIndex1: 2,
      });
    } else {
      optionList.push({
        title: this.service.getMultilingualLabel('recentIllustrations'),
        header: ['Insured Name', 'Plan Name', 'Updated Date'],
        data: undefined,
        action: 'quotation/',
        searchName: 'SearchLifeIllustration',
        seqIndex: 7,
        refIndex: 1,
        nameIndex: 8,
        nameIndex1: 2,
      });
    }
    optionList.push({
      title: this.service.getMultilingualLabel('recentEApplications'),
      header: ['Owner Name', 'Insured Name', '  Plan Name'],
      data: undefined,
      action: 'policy/',
      searchName: 'SearchPolicy',
      seqIndex: 6,
      refIndex: 3,
      nameIndex: 2,
      nameIndex1: 1,
    });
    return optionList;
  }
  protected getColor() {
    if (SettingService.getApplicationPropertiesValue('COMPANYCOLOUR') === 'SLGFI') {
      return ['#E0DCD1', '#FFBD0E', '#1D5798', '#E5E5E5'];
    } else {
      return ['#E0DCD1', '#4A7283', '#FEBE10'];
    }
  }
  public setPieChartOptions(elementIdName: string, chartOptionsObj: any) {
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
      type: 'doughnut',
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
        cutoutPercentage: 60,
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
          position: this.service.isMobileViewRendeered() ? 'bottom' : 'bottom',
          labels: {
            usePointStyle: true, // Use point style (circle)
            generateLabels: (chart) => {
              let data = chart.data;
              return data.labels.map((label, i) => {
                return {
                  text: label + ' (' + data.datasets[0].data[i] + ')',
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].backgroundColor[i],
                  pointStyle: 'circle', // Shape of the legend marker
                  hidden: !chart.getDatasetMeta(0).data[i],
                  lineCap: 'round',
                  lineDash: [],
                  lineDashOffset: 0,
                  lineJoin: 'miter',
                  pointRadius: 10, // Size of the circle
                  borderRadius: 0,
                  rotation: 0,
                  index: i,
                };
              });
            },
          },
          onClick: (event, legendItem) => {
            this.onPieChartClick(event, pieChartLabelObj[legendItem.index], elementIdName);
          },
        },
        onClick: (event, chartElements) => {
          if (chartElements && chartElements.length > 0) {
            const index = chartElements[0]['_index'];
            this.onPieChartClick(event, pieChartLabelObj[index], elementIdName);
          }
        },
      },
    });
  }
  // getSingleNotification(channel: string, agentId: string) {
  //   let respData;
  //   this.service.getSingleNotification(channel, agentId).subscribe((response) => {
  //     console.log('Notification response:', response);
  //     respData = JSON.parse(JSON.stringify(response));
  //     console.log('respData', respData);
  //     if (this.settingService.getApplicationMode() === 'online') {
  //       let agentName = this.agentId;
  //       this.notificationBody = respData.data[agentName].notificationBody;
  //       this.notificationSubject = respData.data[agentName].notificationSubject;
  //     } else {
  //       this.notificationBody = respData.data.notificationBody;
  //       this.notificationSubject = respData.data.notificationSubject;
  //     }
  //     if(this.notificationSubject?.trim() && this.notificationBody?.trim()){
  //       this.isNotificationSeen=false;
  //     }
  //   });
  // }
}
