import { SettingService } from '../../system-common/services/setting.service';
import { OfflineService } from '../../offline/offline.service';
import { ResponseIO } from '../../models/responseIO';
import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { CSASLGFIService } from '../service/csa-slgfi-service.service';
// import { CsaPreviewHandlerComponent } from './csa-preview.handler';
import { Router } from '@angular/router';
// import * as data from '../../../assets/config/url-config.json';
// import { PolicypolicyEAppPreviewHandlerComponent } from './policy-e-app-preview.handler';

declare const setScrollAndScreenHeight: any;

@Component({
  selector: 'sym-csa-slgfi-preview',
  templateUrl: './csa-slgfi-preview.component.html',
  styleUrls: ['./csa-slgfi-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CSASLGFIPreviewComponent extends BaseComponent<CSASLGFIService> implements OnChanges {
  public eAppPreviewHtmlPages: ResponseIO;
  public eAppPreviewHtmlPagesProperty;
  public signtureMapObject = new Map();
  public signatureKey = [];
  public triggerBtnID;
  public currServiceSignature: any;
  public triggerBtnClick = false;
  @Input() responseUpdated: boolean;
  searchCriteriaforProposal: any;
  settingService: SettingService;
  router: Router;
  offlineService: OfflineService;
  constructor(
    csaslgfiservice: CSASLGFIService,
    router: Router,
    offlineService: OfflineService,
    settingService: SettingService
  ) {
    super(csaslgfiservice);
    this.searchCriteriaforProposal = {
      'SearchProspectDO.fnaId': this.service.responseIO.data.Entity.fnaNum,
    };
  }
  ngOnInit() {
    //super.ngOnInit();
    this.displayIllustration();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes['responseUpdated'] &&
        changes['responseUpdated'].currentValue &&
        changes['responseUpdated'].currentValue == true) ||
      (changes['responseUpdated'] && changes['responseUpdated'].firstChange == true)
    ) {
      this.displayIllustration();
    }
  }

  getElement() {
    this.triggerBtnID = undefined;
    this.triggerBtnClick = false;
    setTimeout(() => {
      this.triggerBtnID = $('#eAappButtonGUID').text();
      // console.log($('#eAappButtonGUID').text());
      this.triggerBtnClick = true;
      let serviceSignatureDO = this.service.responseIO.data.ServiceSignatureList.find(
        (existServiceSignature: any) => existServiceSignature.guid === this.triggerBtnID
      );
      if (serviceSignatureDO != null && serviceSignatureDO != undefined) {
        this.currServiceSignature = serviceSignatureDO;
      }
    }, 10);

    // setTimeout(() => {
    //   this.triggerBtnClick = false;
    // }, 550);
    // console.log($('#buttonGUID').text());
  }

  displayIllustration() {
    this.service.getCSAPreview().subscribe(
      (body) => {
        this.eAppPreviewHtmlPages = new ResponseIO();
        // console.log(JSON.stringify(body));
        this.eAppPreviewHtmlPages = JSON.parse(JSON.stringify(body));
        if (
          this.eAppPreviewHtmlPages.data['signatureList'] != undefined &&
          this.eAppPreviewHtmlPages.data['signatureList'] != null &&
          this.eAppPreviewHtmlPages.data['signatureList'].length > 0
        ) {
          for (let i = 0; i < this.eAppPreviewHtmlPages.data['signatureList'].length; i++) {
            if (this.eAppPreviewHtmlPages.data['signatureList'][i].signature == null) {
              let id = this.eAppPreviewHtmlPages.data['signatureList'][i].guid;
              setTimeout(() => {
                let displaySignatureImg = document.getElementById('signature' + id + '_img');
                $(displaySignatureImg).attr('src', ' ');
                $(displaySignatureImg).css('opacity', '0');
              }, 10);
            }
          }
        }
        if (this.eAppPreviewHtmlPages.data && this.eAppPreviewHtmlPages.data.CSAPreview != undefined) {
          this.csaPreviewInOld();
        } else if (this.eAppPreviewHtmlPages.data.CSAHTMLPreview != undefined) {
          this.csaPreviewInNew();
        }
        setTimeout(() => {
          setScrollAndScreenHeight();
          // this.service.loadScroll();
        }, 15);
        console.log('Data loaded successful.');
      },
      (error) => {
        console.log('Data load failed.');
        console.log('Error:', error);
      }
    );
  }

  csaPreviewInOld() {
    this.eAppPreviewHtmlPagesProperty = [];
    this.eAppPreviewHtmlPagesProperty = Object.keys(this.eAppPreviewHtmlPages.data.CSAPreview);
    let newServiceSignatureList = [];
    this.eAppPreviewHtmlPagesProperty.forEach((item) => {
      if (this.eAppPreviewHtmlPages.data.CSAPreview[item].signature != null) {
        this.signatureKey = [];
        this.signatureKey = Object.keys(this.eAppPreviewHtmlPages.data.CSAPreview[item].signature);
        this.signatureKey.filter((sign, index) => {
          let currServiceSignature = this.eAppPreviewHtmlPages.data.CSAPreview[item].signature[sign];

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
      this.service.responseIO.data.ServiceSignatureList = [];
      this.service.responseIO.data.ServiceSignatureList = newServiceSignatureList;
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
            var buttonObj = document.getElementById(newServiceSignatureList[i].guid);
            console.log('buttonObj', buttonObj);
            if (buttonObj != undefined) buttonObj.addEventListener('click', this.onCapture.bind(event), false);
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

  onCapture(element) {
    // console.log(element.srcElement.id);
    let guid = element.srcElement.id;
    // console.log(this);
    $('#eAappButtonGUID').text(guid);
    $('#eAappButtonGUID').trigger('click');
    // this.getElement(guid);
    // this.triggerBtnID = guid;
    // alert('Test td' + id);
  }
  public onSignatureDone(signatureObject?: any) {
    this.triggerBtnClick = false;
  }

  csaPreviewInNew() {
    this.eAppPreviewHtmlPagesProperty = this.eAppPreviewHtmlPages.data.CSAHTMLPreview;
    let newServiceSignatureList = [];
    //loop through all api signture list
    this.eAppPreviewHtmlPages.data.signatureList.forEach((currServiceSignature) => {
      //find out if there is any existing signature
      if (this.service.responseIO.data.ServiceSignatureList.length > 0) {
        let serviceSignatureDO = this.service.responseIO.data.ServiceSignatureList.find(
          (existServiceSignature) => existServiceSignature.guid === currServiceSignature.guid
        );
        if (serviceSignatureDO != null && serviceSignatureDO != undefined) {
          currServiceSignature = serviceSignatureDO;
        }
      }
      //in uw flow,make read only signature object
      if (
        currServiceSignature != undefined &&
        currServiceSignature.status != 'I' &&
        this.selectedStep.id == 'step_submitStatus'
      ) {
        this.service.setFieldReadOnly(currServiceSignature, 'signature', 'YES');
      }
      newServiceSignatureList.push(currServiceSignature);
      //add current signature list into responseIO
      if (newServiceSignatureList.length > 0) {
        this.service.responseIO.data.ServiceSignatureList = [];
        this.service.responseIO.data.ServiceSignatureList = newServiceSignatureList;
      }
    });
    setTimeout(() => {
      this.service.responseIO.data.ServiceSignatureList.forEach((serviceSignature) => {
        var buttonObj = document.getElementById(serviceSignature.guid);
        if (buttonObj != undefined) buttonObj.addEventListener('click', this.onCapture.bind(event), false);
      });
    }, 100);
  }

  downloadPDF() {
    let respData: any;
    this.service.getCSAPreviewPdf().subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        if (this.settingService.isRhosimulator === true) {
          this.downloadOrOpenContent(
            respData.data.pdfFileContents,
            'pdf',
            this.service.responseIO.data.Entity.proposalNum != undefined
              ? this.service.responseIO.data.Entity.proposalNum
              : 'download'
          );
        } else {
          //open pdf in offline
          this.offlineService.openPdf(respData.data.pdfFileContents);
        }
      },
      (error) => {
        console.log('PDF Generate failed.');
        console.log('Error:', error);
      }
    );
  }

  onDownloadPDFClick(event) {
    this.downloadPDF();
  }

  public onCSALinkSISearchSelected(selectedOption) {
    console.log('on csa link si search seleected');
    this.service.setModelFieldValue(
      this.service.responseIO.data.Entity,
      'addtnField2Str',
      selectedOption['quotationRefNum']
    );
    setTimeout(() => {
      this.linkSI();
    }, 5);
  }

  ngOnDestroy(): void {
    this.closeModal('viewProposalList');
  }

  protected linkSI() {
    console.log('csalinksi');
    let respData: any;
    this.service.linkSI().subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        if (respData.data.Entity.quotationSeq != null)
          this.router.navigate(['quotation/' + respData.data.Entity.quotationSeq]);
        else this.error('CSA LINK quotation failed.');
      },
      (error) => {
        this.error('CSA LINK quotation failed.');
        console.log('Error:', error);
      }
    );
  }
}
