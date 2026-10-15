import { SettingService } from './../../system-common/services/setting.service';
import { OfflineService } from './../../offline/offline.service';
import { ResponseIO } from '../../models/responseIO';
import { Component, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';
// import * as data from '../../../assets/config/url-config.json';
import { PolicypolicyEAppPreviewHandlerComponent } from './policy-e-app-preview.handler';

declare const setScrollAndScreenHeight: any;

@Component({
  selector: 'sym-policy-e-app-preview',
  templateUrl: './policy-e-app-preview.component.html',
  styleUrls: ['./policy-e-app-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicypolicyEAppPreviewComponent
  extends PolicypolicyEAppPreviewHandlerComponent
  implements OnChanges
{
  constructor(
    policyService: PolicyService,
    public offlineService: OfflineService,
    public settingService: SettingService
  ) {
    super(policyService, offlineService, settingService);
  }
  ngOnInit() {
    super.ngOnInit();
    this.displayIllustration();
    // $('.scrollDiv, .pgContent').css('overflow-y', 'hidden');
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
  ngOnDestroy() {
    // $('.pgContent').css('overflow', 'initial');
    $('.scrollDiv, .pgContent').css('overflow-y', 'auto');
  }
  eappPreviewInOld() {
    this.eAppPreviewHtmlPagesProperty = [];
    this.eAppPreviewHtmlPagesProperty = Object.keys(this.eAppPreviewHtmlPages.data.EappPreview);
    let newServiceSignatureList = [];
    this.eAppPreviewHtmlPagesProperty.forEach((item) => {
      if (this.eAppPreviewHtmlPages.data.EappPreview[item].signature != null) {
        this.signatureKey = [];
        this.signatureKey = Object.keys(this.eAppPreviewHtmlPages.data.EappPreview[item].signature);
        this.signatureKey.filter((sign, index) => {
          let currServiceSignature = this.eAppPreviewHtmlPages.data.EappPreview[item].signature[sign];

          if (
            this.service.responseIO.data.ServiceSignatureList &&
            this.service.responseIO.data.ServiceSignatureList.length > 0 &&
            currServiceSignature != null
          ) {
            let serviceSignatureDO = this.service.responseIO.data.ServiceSignatureList.find(
              (existServiceSignature) => existServiceSignature.guid === currServiceSignature.guid
            );
            if (serviceSignatureDO != null && serviceSignatureDO != undefined) {
              currServiceSignature = serviceSignatureDO;
            }
          }
          let isAlreayAdded = false;
          if (
            newServiceSignatureList.length > 0 &&
            currServiceSignature != null &&
            currServiceSignature != undefined &&
            currServiceSignature.length > 0
          ) {
            let serviceSignatureDO = newServiceSignatureList.find(
              (existServiceSignature) => existServiceSignature.guid === currServiceSignature.guid
            );
            if (serviceSignatureDO != null && serviceSignatureDO != undefined) {
              isAlreayAdded = true;
            }
          }
          if (!isAlreayAdded) {
            newServiceSignatureList.push(currServiceSignature);
          }
          this.signtureMapObject.set(sign, newServiceSignatureList[index]);
        });
      }
    });
    if (
      newServiceSignatureList.length > 0 ||
      newServiceSignatureList != null ||
      newServiceSignatureList != undefined
    ) {
      if (
        this.service.responseIO.data.ServiceSignatureList != undefined &&
        this.service.responseIO.data.ServiceSignatureList.length > 0
      ) {
        this.service.responseIO.data.ServiceSignatureList.forEach((serviceSignature) => {
          if (serviceSignature.entityGuid != this.service.responseIO.data.Entity.guid) {
            newServiceSignatureList.push(serviceSignature);
          }
        });
      }
      this.service.responseIO.data.ServiceSignatureList = [];
      this.service.responseIO.data.ServiceSignatureList = newServiceSignatureList;
      if (this.eAppPreviewHtmlPages.metadata != undefined)
        this.service.responseIO.metadata = this.eAppPreviewHtmlPages.metadata;
      if (this.eAppPreviewHtmlPages.lookups != undefined)
        this.service.responseIO.lookups = this.eAppPreviewHtmlPages.lookups;
    }

    setTimeout(() => {
      for (let i = 0; i < newServiceSignatureList.length; i++) {
        if (
          newServiceSignatureList[i] != null &&
          newServiceSignatureList[i] != undefined &&
          newServiceSignatureList[i].guid &&
          newServiceSignatureList[i].guid != undefined &&
          newServiceSignatureList[i].guid != null
        ) {
          if (
            document.getElementById(newServiceSignatureList[i].guid) != undefined &&
            document.getElementById(newServiceSignatureList[i].guid) != null
          ) {
            document
              .getElementById(newServiceSignatureList[i].guid)
              .addEventListener('click', this.onCapture.bind(newServiceSignatureList[i].guid), false);
          }
          if (
            this.service.responseIO.data.Entity.statusCd == 'SUBMITTED_UWCUSTOMERINPUT' &&
            this.selectedStep.id == 'step_submitStatus'
          ) {
            this.service.setFieldReadOnly(newServiceSignatureList[i], 'signature', 'YES');
          }
        }
      }
    }, 15);
  }
}
