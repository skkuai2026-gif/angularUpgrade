import { Component, OnInit, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from '../../system-common/base/base.component';
import { PolicyService } from '../services/policy.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { ResponseIO } from 'src/app/models/responseIO';

@Component({
  selector: 'sym-policy-uw-underwriting',
  templateUrl: './policy-uw-underwriting.component.html',
  styleUrls: ['./policy-uw-underwriting.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyUwWritingComponent extends BaseComponent<PolicyService> implements OnChanges {
  flag: any;
  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService);
  }

  ngOnInit() {
    // alert( this.settingService.getLabelValue('recordId'))
    setTimeout(() => {
      this.autoUnderwrite();
    }, 100);
  }
  autoUnderwrite() {
    Object.assign(this, this.service.responseIO.data);
    const modelNameList: string[] = Object.keys(this.service.responseIO.data);

    const formattedModelList: { ModelName: string }[] = modelNameList.map((name) => ({ ModelName: name }));

    if (this.settingService.getApplicationMode() === 'offline') {
      this.service.autoUnderwrite(true, formattedModelList as unknown as string[]).subscribe(
        (responseIO) => {
          this.service.responseIO = new ResponseIO();
          this.service.responseIO = JSON.parse(JSON.stringify(responseIO));
          if (
            this.service &&
            this.service.responseIO &&
            this.service.responseIO.data &&
            this.service.responseIO.data.Entity &&
            this.service.responseIO.data.Entity.uwDecisionCd === 'DECLINED'
          ) {
            if (this.selectedStep.tabList) {
              for (var i = 0; i < this.selectedStep.tabList.length; i++) {
                var tabItem = this.selectedStep.tabList[i];

                if (
                  tabItem.id == 'tab_csaIllustration' ||
                  tabItem.id == 'tab_illustration' ||
                  tabItem.id == 'tab_siIllustration'
                ) {
                  tabItem.visible = false;
                }
              }
            }
          }
          const visitedTabs = this.service.responseIO.data.Entity.visitedTabs || '';
          const currentActiveTab = this.service.currentActiveTab || '';
          const requiredTabs = [
            'tab_underWriting',
            'tab_csaIllustration',
            'tab_illustration',
            'tab_siIllustration',
          ];

          if (this.service.responseIO.data.Proposer.partyTypeCd === 'ORGANIZATION') {
            requiredTabs.splice(requiredTabs.indexOf('tab_csaIllustration'), 1);
          }

          const allTabsVisited =
            requiredTabs.every((tab) => visitedTabs.includes(tab) || currentActiveTab === tab) &&
            this.service?.responseIO?.data?.Entity?.uwDecisionCd !== 'DECLINED';
          const signatureTabVisited =
            visitedTabs.includes('tab_f2fSignature') || currentActiveTab === 'tab_f2fSignature';

          if (this.selectedStep.tabList) {
            for (var i = 0; i < this.selectedStep.tabList.length; i++) {
              var tabItem = this.selectedStep.tabList[i];

              if (tabItem.id == 'tab_f2fSignature') {
                tabItem.visible = allTabsVisited;
              }
            }
          }
          setTimeout(() => {
            this.showHideAcceptBtn(allTabsVisited && signatureTabVisited);
            if (this.service?.responseIO?.data?.Entity?.uwDecisionCd === 'DECLINED') {
              const nextButton = document.querySelector('.btn_icon_next') as HTMLElement;
              if (nextButton) {
                nextButton.style.display = 'none';
              }
            }
          }, 0);
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.settingService.getApplicationMode() === 'online') {
      // console.log('autounderwrite');
      this.service.autoUnderwrite(false).subscribe(
        (responseIO) => {
          // alert( responseIO[ 'message' ] );
          this.service.responseIO = new ResponseIO();
          this.service.responseIO = JSON.parse(JSON.stringify(responseIO));
          if (
            this.service &&
            this.service.responseIO &&
            this.service.responseIO.data &&
            this.service.responseIO.data.Entity &&
            this.service.responseIO.data.Entity.uwDecisionCd === 'DECLINED'
          ) {
            if (this.selectedStep.tabList) {
              for (var i = 0; i < this.selectedStep.tabList.length; i++) {
                var tabItem = this.selectedStep.tabList[i];

                if (
                  tabItem.id == 'tab_csaIllustration' ||
                  tabItem.id == 'tab_illustration' ||
                  tabItem.id == 'tab_siIllustration'
                ) {
                  tabItem.visible = false;
                }
              }
            }
          }
          const visitedTabs = this.service.responseIO.data.Entity.visitedTabs || '';
          const currentActiveTab = this.service.currentActiveTab || '';
          const requiredTabs = [
            'tab_underWriting',
            'tab_csaIllustration',
            'tab_illustration',
            'tab_siIllustration',
          ];

          if (this.service.responseIO.data.Proposer.partyTypeCd === 'ORGANIZATION') {
            requiredTabs.splice(requiredTabs.indexOf('tab_csaIllustration'), 1);
          }

          const allTabsVisited =
            requiredTabs.every((tab) => visitedTabs.includes(tab) || currentActiveTab === tab) &&
            this.service?.responseIO?.data?.Entity?.uwDecisionCd !== 'DECLINED';
          const signatureTabVisited =
            visitedTabs.includes('tab_f2fSignature') || currentActiveTab === 'tab_f2fSignature';

          if (this.selectedStep.tabList) {
            for (var i = 0; i < this.selectedStep.tabList.length; i++) {
              var tabItem = this.selectedStep.tabList[i];

              if (tabItem.id == 'tab_f2fSignature') {
                tabItem.visible = allTabsVisited;
              }
            }
          }
          setTimeout(() => {
            this.showHideAcceptBtn(allTabsVisited && signatureTabVisited);
            if (this.service?.responseIO?.data?.Entity?.uwDecisionCd === 'DECLINED') {
              const nextButton = document.querySelector('.btn_icon_next') as HTMLElement;
              if (nextButton) {
                nextButton.style.display = 'none';
              }
            }
          }, 0);
        },
        (error) => {
          console.log(error);
        }
      );
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
  public but_ok_click() {
    // let prevStepObj = this.stepList[this.selectedStep.index - 4];
    // this.onStepChanged(prevStepObj);
    // $('#btn_ok').hide();
  }

  capitalizeFirstLetterOnly(word) {
    if (word.length === 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
}
