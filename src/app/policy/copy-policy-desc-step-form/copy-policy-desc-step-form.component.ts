import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StepItem } from 'src/app/models/common/step-item';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyStepFormComponent } from '../policy-step-form/policy-step-form.component';
import { PolicyService } from '../services/policy.service';
import { Location } from '@angular/common';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { PolicyMainStepFormComponent } from '../policy-main-step-form/policy-main-step-form.component';

@Component({
  selector: 'sym-copy-policy-desc-step-form',
  templateUrl: './copy-policy-desc-step-form.component.html',
  styleUrls: ['./copy-policy-desc-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CopyPolicyDescStepFormComponent extends PolicyMainStepFormComponent implements OnInit {
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
    super.ngOnInit();
    this.setTimeoutPromise(() => {
      this.superInit();
    }, 100);
  }

  protected getStepList(): StepItem[] {
    let stepList: StepItem[];
    let facetId = 'COPYPOLICYDESC_UIFORMAT';
    if (this.service.companyFacets.data[facetId] != undefined) {
      this.uiFormatXmFacetlValue = 'XMLBASED';
      stepList = this.service.getStepList(this.service.companyFacets.data[facetId]);
    } else {
      this.uiFormatXmFacetlValue = 'STATIC';
      stepList = [
        new StepItem(0, 'step_previewEApp', [
          {
            id: 'tab_illustration',
            text: 'eappPreview',
            modelList: ['ServiceSignatureList', 'OutputPreferences'],
          },
        ]),
      ];
    }

    return stepList;
  }
  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  protected getMoreOptionList(): any[] {
    let optionList: any[];
    return optionList;
  }
}
