import { BaseStepFormComponent } from 'src/app/system-common/base-step-form/base-step-form.component';
import { FnaService } from '../service/fna-service.service';
import { PageHeader } from 'src/app/models/common/page-header';
import { StepItem } from 'src/app/models/common/step-item';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { BreadCrumb } from './../../models/common/bread-crumb';

declare const scrollToTop: any;

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FnaStepFormHandlerComponent extends BaseStepFormComponent<FnaService> implements OnInit {
  constructor(
    service: FnaService,
    route: ActivatedRoute,
    public router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    // this.service.fnaStepQuestionnaire = [];
  }

  protected preStepSelection(nextStepObj: StepItem): void {
    // if (!this.service.fnaStepQuestionnaire.hasOwnProperty(nextStepObj.id))
    //   this.service.fnaStepQuestionnaire[nextStepObj.id] = [];
  }

  protected getStepList(): StepItem[] {
    let stepList: StepItem[] = [
      new StepItem(
        0,
        'step_FNADream',
        [{ id: 'tab_dream', isSelected: true, modelList: ['FNAParty'] }],

        ['but_Next']
        // ['but_Back',  'but_Continue']
      ),
      new StepItem(
        1,
        'step_FNABuyProduct',
        [
          {
            id: 'tab_buyProduct',
            isSelected: false,
            modelList: ['FNAParty'],
          },
        ],
        ['but_Previous', 'but_Next']
      ),
      new StepItem(
        2,
        'step_FNAPremium',
        [
          {
            id: 'tab_premium',
            isSelected: false,
            modelList: ['FNAParty'],
          },
        ],
        ['but_Previous', 'but_Next']
      ),
      new StepItem(
        3,
        'step_FNATimeline',
        [
          {
            id: 'tab_timeline',
            isSelected: false,
            modelList: ['FNAParty'],
          },
        ],
        ['but_Previous', 'but_Next']
      ),
      new StepItem(
        4,
        'step_FNARecommendation',
        [
          {
            id: 'tab_recommendation',
            isSelected: false,
            modelList: ['FNAParty'],
          },
        ],
        ['but_Previous', 'but_Next']
      ),
      new StepItem(
        5,
        'step_FNAProductSummary',
        [
          {
            id: 'tab_productSummary',
            isSelected: false,
            modelList: ['FNAParty'],
          },
        ],
        ['but_Previous', 'but_Next']
      ),
      new StepItem(
        6,
        'step_FNARiskProfile',
        [
          {
            id: 'tab_riskProfile',
            isSelected: false,
            modelList: ['FNAParty'],
          },
        ],
        ['but_Previous', 'but_Next']
      ),
      new StepItem(
        7,
        'step_FNASignature',
        [
          {
            id: 'tab_signature',
            isSelected: false,
            modelList: ['FNAParty'],
          },
        ],
        ['but_Previous', 'but_Complete']
      ),
    ];
    return stepList;
  }
  protected getPageHeader(): PageHeader {
    let header = new PageHeader();
    header.refNumber = this.service.responseIO.data.Entity.fnaId;
    header.title = 'fna';
    return header;
  }
  protected getBreadCrumbList(): BreadCrumb[] {
    return [
      {
        id: 'home',
        link: '/home',
      },
    ];
  }

  but_Next_click() {
    // this.but_Continue_click();
    // this.service.fnaStepQuestionnaire[this.stepList[this.selectedStep.index + 1].id] = [];
    // console.log(this.service.fnaStepQuestionnaire);
    let prevStepObj = this.stepList[this.selectedStep.index + 1];
    //call override onStepChanged function while back button click
    this.onStepChanged(prevStepObj);
    scrollToTop();
  }

  but_Previous_click() {
    this.but_Back_click();
    scrollToTop();
  }

  // protected postLoad(nextStepObj?: StepItem): void {
  //   if (this.selectedStep != undefined && this.selectedStep.index == 1) {
  //     setTimeout(() => {
  //       var mode = $('#applicationMode').text();
  //       if (mode == 'online') {
  //         initFnaSlider();
  //       } else if (mode == 'offline') {
  //         setTimeout(() => {
  //           var sliderElement = $('.sliderContainer');
  //           initSlickSlider(sliderElement);
  //         }, 15);
  //       }
  //     }, 50);
  //   }
  // }

  but_Complete_click() {
    this.createQuotation();
  }
  protected createQuotation() {
    let respData: any;
    this.service.createQuotation().subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        this.router.navigate(['quotation/' + respData.data.Entity.quotationSeq]);
        sessionStorage.removeItem('leadID');
        console.log('CreateQuotation  successful.');
      },
      (error) => {
        console.log('CreateQuotation failed.');
        console.log('Error:', error);
      }
    );
  }
}
