import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from '../services/policy.service';
import { PolicyStepFormComponent } from '../policy-step-form/policy-step-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { Location } from '@angular/common';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyMainstepFormHandlerComponent extends PolicyStepFormComponent implements OnInit {
  public uiFormatXmFacetlValue: String;
  protected facetId: string;
  constructor(
    service: PolicyService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
  }
  ngOnInit() {
    this.uiFormatXmFacetlValue = undefined;
    this.getCompanyFacet();
  }

  protected superInit() {
    super.ngOnInit();
  }

  protected setUICompanyFacetValue() {
    let facetId = 'POLICYUIFORMAT_' + this.getInsuranceType();
    if (this.facetId != null) facetId = this.facetId;
    if (this.service.companyFacets != undefined) {
      let uifacetVal = this.service.companyFacets.data[facetId];
      if (uifacetVal) this.uiFormatXmFacetlValue = 'XMLBASED';
      else this.uiFormatXmFacetlValue = 'STATIC';
    }
  }
  protected postLoadCompanyFacets() {
    this.setUICompanyFacetValue();
  }

  async getCompanyFacet() {
    if (this.service.companyFacets == undefined) {
      await this.loadCompanyFacets();
    } else {
      this.setUICompanyFacetValue();
    }
  }
}
