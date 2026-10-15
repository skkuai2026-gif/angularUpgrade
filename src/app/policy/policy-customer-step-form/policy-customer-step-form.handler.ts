import { StepItem } from './../../models/common/step-item';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyService } from './../services/policy.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { Location } from '@angular/common';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { PolicyMainStepFormComponent } from '../policy-main-step-form/policy-main-step-form.component';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyCustomerStepFormHandlerComponent extends PolicyMainStepFormComponent implements OnInit {
  public uiFormatXmFacetlValue: string;
  constructor(
    service: PolicyService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
    this.facetId = 'CUSTOMERTRANSFER_UIFORMAT';
  }

  async ngOnInit() {
    super.ngOnInit();
    //TODO: need to remove this timeout and use this function below.
    await this.setTimeoutPromise(() => {
      this.superInit();
    }, 1000);
  }

  // protected postLoadCompanyFacets() {
  //   super.postLoadCompanyFacets();
  //   this.setTimeoutPromise(() => {
  //     this.superInit();
  //   }, 100);
  // }

  protected getStepList(): StepItem[] {
    let stepList: StepItem[];

    if (this.uiFormatXmFacetlValue == 'XMLBASED') {
      stepList = this.service.getStepList(this.service.companyFacets.data[this.facetId]);
    } else if (this.uiFormatXmFacetlValue == 'STATIC') {
      stepList = [
        new StepItem(
          0,
          'step_completeDataEntry',
          [
            {
              id: 'tab_basic',
              isSelected: true,
              modelList: [
                'Entity',
                'BasePlan',
                'RiderList',
                'InitialInvestment',
                'RegularTopup',
                'AdHocTopupList',
                'TransferTopupList',
                'WithdrawalList',
              ],
            },
            {
              id: 'tab_owner',
              isSelected: false,
              modelList: ['Proposer'],
            },
            {
              id: 'tab_primary',
              isSelected: false,
              modelList: ['PrimaryInsured'],
            },
            {
              id: 'tab_joint',
              isSelected: false,
              modelList: ['JointLife'],
            },
            {
              id: 'tab_supplementary',
              isSelected: false,
              modelList: ['SupplementaryList'],
            },
            {
              id: 'tab_nominee',
              isSelected: false,
              modelList: ['NomineeList', 'Appointee'],
            },
            {
              id: 'tab_payment',
              isSelected: false,
              modelList: [
                'InitialOtherPayerParty',
                'InitialPayment',
                'RenewalOtherPayerParty',
                'RenewalPayment',
                'RefundPayment',
              ],
            },
            {
              id: 'tab_questionnaire',
              isSelected: false,
              modelList: ['PartyQuestionnaireResponseList'],
            },
          ],
          ['but_DraftSave', 'but_Continue']
        ),
        new StepItem(
          1,
          'step_requirement',
          [
            {
              id: 'tab_requirement',
              modelList: ['PartyDocumentList'],
            },
          ],
          ['but_Back', 'but_DraftSave', 'but_Continue']
        ),
        new StepItem(
          2,
          'step_previewEApp',
          [
            {
              id: 'tab_illustration',
              modelList: ['ServiceSignatureList'],
            },
          ],
          ['but_Back', 'but_Complete']
        ),
      ];
    }

    return stepList;
  }

  protected getMoreOptionList(): any[] {
    let optionList: any[];
    return optionList;
  }

  protected getBreadCrumbList(): BreadCrumb[] {
    return [];
  }
}
