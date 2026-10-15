import { StepItem } from 'src/app/models/common/step-item';
import { HeaderService } from './../../system-common/services/header.service';
import { SettingService } from './../../system-common/services/setting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuotationService } from './../services/quotation.service';
import { QuotationStepFormComponent } from './../quotation-step-form/quotation-step-form.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'sym-quotation-health-step-form',
  templateUrl: './quotation-health-step-form.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationHealthStepFormComponent extends QuotationStepFormComponent {
  constructor(
    service: QuotationService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
  }

  protected getStepList(): StepItem[] {
    let stepList: StepItem[] = [
      new StepItem(
        0,
        'step_yourDetails',
        [{ id: 'tab_basic', modelList: ['Entity', 'Proposer', 'PrimaryInsured', 'JointLife'] }],
        ['but_DraftSave', 'but_Continue']
      ),
      new StepItem(
        1,
        'step_selectProduct',
        [{ id: 'tab_selProduct', modelList: ['Entity', 'BasePlan'] }],
        ['but_Back', 'but_DraftSave', 'but_Continue']
      ),
      new StepItem(
        2,
        'step_coverageDet',
        [
          {
            id: 'tab_plan',
            modelList: [
              'BasePlan',
              'InitialInvestment',
              'RegularTopup',
              'AdHocTopupList',
              'TransferTopupList',
              'WithdrawalList',
              'RiderList',
              'SupplementaryList',
            ],
          },
          { id: 'tab_supplementary', modelList: ['SupplementaryList', 'BasePlan', 'RiderList'] },
          { id: 'tab_rider', modelList: ['BasePlan', 'RiderList', 'SupplementaryList'] },
        ],
        ['but_Back', 'but_DraftSave', 'but_Continue']
      ),
      new StepItem(
        3,
        'step_quoteSummary',
        [
          {
            id: 'tab_premiumSummary',
            modelList: [
              'Entity',
              'BasePlan',
              'RiderList',
              'Proposer',
              'PrimaryInsured',
              'JointLife',
              'SupplementaryList',
            ],
          },
        ],
        ['but_Back', 'but_Accept']
      ),
    ];

    return stepList;
  }
}
