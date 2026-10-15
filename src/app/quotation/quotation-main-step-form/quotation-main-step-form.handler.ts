import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { QuotationStepFormComponent } from '../quotation-step-form/quotation-step-form.component';
import { QuotationService } from '../services/quotation.service';
import { Location } from '@angular/common';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationMainstepFormHandlerComponent extends QuotationStepFormComponent implements OnInit {
  public uiFormatXmFacetlValue: String;
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
  async ngOnInit() {
    this.uiFormatXmFacetlValue = undefined;
    await this.getCompanyFacet();
  }
  protected setUICompanyFacetValue() {
    let facetId = 'QUOTEUIFORMAT_' + this.getInsuranceType();
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
