import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { LeadStepFormComponent } from '../lead-step-form/lead-step-form.component';
import { LeadService } from '../services/lead.service';
import { Location } from '@angular/common';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadMainStepFormComponentHandler extends LeadStepFormComponent implements OnInit {
  public uiFormatXmFacetlValue: String;
  constructor(
    service: LeadService,
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
    let facetId = 'LEADUIFORMAT';
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
