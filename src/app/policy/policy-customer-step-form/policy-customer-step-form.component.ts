import { ActivatedRoute, Router } from '@angular/router';
import { PolicyService } from './../services/policy.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { Location } from '@angular/common';
import { PolicyCustomerStepFormHandlerComponent } from './policy-customer-step-form.handler';
import { TabItem } from 'src/app/models/common/tab-items';
import { StepItem } from 'src/app/models/common/step-item';

@Component({
  selector: 'sym-policy-customer-step-form',
  templateUrl: './policy-customer-step-form.component.html',
  styleUrls: ['./policy-customer-step-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyCustomerStepFormComponent extends PolicyCustomerStepFormHandlerComponent implements OnInit {
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

  async ngOnInit() {
    await super.ngOnInit();
    await this.loadInitData(['Proposer']);
  }

  protected postLoad() {
    super.postLoad();
    if (this.selectedStep != undefined && this.selectedStep.id == 'step_preview') {
      this.checkForCSAPreviewApplicable(this.selectedStep);
    }
    this.setAcceptButtonState();
  }
  protected checkForCSAPreviewApplicable(nextStepObj: StepItem): void {
    console.log('calling checkforcsapreview');
    for (var i = 0; i < nextStepObj.tabList.length; i++) {
      var tabItem = nextStepObj.tabList[i];
      console.log('checkForCSAPreviewApplicable', nextStepObj);
      if (
        this.service &&
        this.service.responseIO &&
        this.service.responseIO.data &&
        this.service.responseIO.data.Entity &&
        this.service.responseIO.data.Entity.allocatedToRole === 'PROPOSER'
      ) {
        if (
          tabItem.id == 'tab_csaIllustration_rs' &&
          this.service.responseIO.data.Proposer !== undefined &&
          this.service.responseIO.data.Proposer.partyTypeCd === 'ORGANIZATION'
        ) {
          tabItem.visible = false;
        } else {
          tabItem.visible = true;
        }
      } else if (tabItem.id == 'tab_illustration_rs') {
        tabItem.visible = true;
      } else tabItem.visible = false;
    }
  }

  protected preStepSelection(nextStepObj: StepItem): void {
    // super.preStepSelection(nextStepObj);
    if (nextStepObj.id == 'step_preview') {
      this.checkForCSAPreviewApplicable(nextStepObj);
    }
    super.preStepSelection(nextStepObj);
  }

  protected postProcess(): void {
    super.postProcess();
    this.setAcceptButtonState();
  }
  protected setAcceptButtonState(): void {
    const visitedTabs = this.service?.responseIO?.data?.Entity?.visitedTabs || '';

    const currentActiveTab = this.service?.currentActiveTab || '';
    const allocatedToRole = this.service.responseIO.data.Entity.allocatedToRole;

    if (allocatedToRole == 'PROPOSER') {
      const isOrganization = this.service?.responseIO?.data?.Proposer?.partyTypeCd === 'ORGANIZATION';

      let allTabsVisited = false;

      if (isOrganization) {
        const requiredTabs = ['tab_illustrationorg_rs', 'tab_siIllustrationorg_rs'];
        // allTabsVisited = currentActiveTab === 'tab_illustration_rs' || visitedTabs.includes('tab_illustration_rs');
        allTabsVisited = requiredTabs.every((tab) => visitedTabs.includes(tab) || currentActiveTab === tab);
      } else {
        const requiredTabs = ['tab_csaIllustration_rs', 'tab_siIllustration_rs', 'tab_illustration_rs'];
        allTabsVisited = requiredTabs.every((tab) => visitedTabs.includes(tab) || currentActiveTab === tab);
      }

      setTimeout(() => {
        this.showHideAcceptBtn(allTabsVisited);
      }, 0);
    } else if (allocatedToRole == 'PRIMARY') {
      let allTabsVisited = false;
      const requiredTabs = ['tab_illustrationprimary_rs'];
      allTabsVisited = requiredTabs.every((tab) => visitedTabs.includes(tab) || currentActiveTab === tab);
      setTimeout(() => {
        this.showHideAcceptBtn(allTabsVisited);
      }, 0);
    }
  }

  public showHideAcceptBtn(show: boolean): void {
    const button = document.getElementById('but_Accept') as HTMLButtonElement | null;

    if (!button) {
      console.warn('Accept button not found');
      return;
    }
    button.disabled = !show;
  }
}
