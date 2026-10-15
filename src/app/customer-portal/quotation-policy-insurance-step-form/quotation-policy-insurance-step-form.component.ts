import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CreatePolicyStepFormComponent } from '../create-policy-step-form/create-policy-step-form.component';
import { QuotationService } from 'src/app/quotation/services/quotation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { PolicyService } from 'src/app/policy/services/policy.service';
import { Location } from '@angular/common';
import { StepItem } from 'src/app/models/common/step-item';

@Component({
  selector: 'sym-quotation-policy-insurance-step-form',
  templateUrl: './quotation-policy-insurance-step-form.component.html',
  styleUrls: ['./quotation-policy-insurance-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationPolicyInsuranceStepFormComponent extends CreatePolicyStepFormComponent {
  constructor(
    service: QuotationService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService,
    public policyService: PolicyService
  ) {
    super(service, route, router, location, settingService, headerService, policyService);
    this.policyService = policyService;
    this.settingService.loadExternalStyle('customer_styles.css');
    if (this.service.companyFacets != undefined) this.service.companyFacets = undefined;
  }

  async ngOnInit() {
    await this.getCompanyFacet();
    //super.ngOnInit();
  }

  protected getStepList(): StepItem[] {
    let stepList: StepItem[];

    stepList = this.service.getStepList(
      this.service.companyFacets.data['QUOTEUIFORMAT_' + this.getInsuranceType()]
    );
    return stepList;
  }

  protected postLoadCompanyFacets() {
    super.ngOnInit();
  }
  async getCompanyFacet() {
    await this.loadCompanyFacets();
  }
}
