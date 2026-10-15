import { StepItem } from 'src/app/models/common/step-item';
import { ActivatedRoute, Router } from '@angular/router';
import { QuotationStepFormComponent } from './../quotation-step-form/quotation-step-form.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { QuotationService } from '../services/quotation.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { Location } from '@angular/common';

@Component({
  selector: 'sym-quotation-travel-step-form',
  templateUrl: './quotation-travel-step-form.component.html',
  styleUrls: ['./quotation-travel-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationTravelStepFormComponent extends QuotationStepFormComponent {
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
            modelList: ['BasePlan', 'RiderList'],
          },
          { id: 'tab_rider', modelList: ['RiderList', 'BasePlan'] },
        ],
        ['but_Back', 'but_DraftSave', 'but_Continue']
      ),
      new StepItem(
        3,
        'step_quoteSummary',
        [
          {
            id: 'tab_premiumSummary',
            modelList: ['Entity', 'BasePlan', 'RiderList', 'Proposer'],
          },
        ],
        ['but_Back', 'but_Accept']
      ),
    ];
    return stepList;
  }

  protected but_Accept_click() {
    //on acceptance first save the quotation and check if all errors are cleared if so
    //then go ahead and accept
    this.saveUpdatedModels(this.selectedStep, undefined, undefined, 'but_Accept');
  }
}
