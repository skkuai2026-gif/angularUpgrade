import { SettingService } from './../../system-common/services/setting.service';
import { OfflineService } from './../../offline/offline.service';
import { ResponseIO } from '../../models/responseIO';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';
// import * as data from '../../../assets/config/url-config.json';

declare const setScrollAndScreenHeight: any;

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicypolicyEAppPreviewHandlerComponent extends BaseComponent<PolicyService> implements OnChanges {
  public eAppPreviewHtmlPages: ResponseIO;
  public eAppPreviewHtmlPagesProperty;
  public signtureMapObject = new Map();
  public signatureKey = [];
  public triggerBtnID;
  public currServiceSignature: any;
  public triggerBtnClick = false;
  isOutputPreferenceReq: boolean;
  nullState: boolean;
  public newSignatureUIReqd = false;

  /**
   * Will emit true if the eAppIllustration(Preview) is successfully Loaded.
   */
  @Output() eAppIllustrationLoaded = new EventEmitter<boolean>();

  //public triggerBtnClickMap: Map<string, boolean> = new Map<string, boolean>();
  // @Input() responseUpdated: boolean;
  constructor(
    policyService: PolicyService,
    public offlineService: OfflineService,
    public settingService: SettingService
  ) {
    super(policyService);

    // console.log(this.service.responseIO.data.ServiceSignatureList);
    this.isOutputPreferenceReq =
      this.service.companyFacets != undefined &&
      this.service.companyFacets.data.EAPPOUTPUTPREFERENCESREQ === 'YES';
    this.nullState = true;
    if (this.service.getCompanyFacetValue('NEWSIGNATUREUIREQD') != null) {
      this.newSignatureUIReqd = this.service.getCompanyFacetValue('NEWSIGNATUREUIREQD') == 'YES' ? true : false;
    }
  }
  ngOnInit() {
    //super.ngOnInit();
    //this.displayIllustration();
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

  displayIllustration(languageCd?: string) {
    this.service.getEAppPreview(languageCd).subscribe(
      (body) => {
        this.eAppPreviewHtmlPages = new ResponseIO();
        // console.log(JSON.stringify(body));
        this.eAppPreviewHtmlPages = JSON.parse(JSON.stringify(body));
        this.nullState = false;
        if (this.eAppPreviewHtmlPages.data && this.eAppPreviewHtmlPages.data.EappPreview != undefined) {
          this.eappPreviewInOld();
        } else if (this.eAppPreviewHtmlPages.data.EappHTMLPreview != undefined) {
          this.eappPreviewInNew();
        }
        setTimeout(() => {
          setScrollAndScreenHeight();
          // this.service.loadScroll();
          this.eAppIllustrationLoaded.emit(true);
        }, 15);
        console.log('Data loaded successful.');
      },
      (error) => {
        console.log('Data load failed.');
        console.log('Error:', error);
        this.eAppIllustrationLoaded.emit(false);
      }
    );
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

  getElement() {
    this.triggerBtnID = undefined;
    this.triggerBtnClick = false;
    setTimeout(() => {
      this.triggerBtnID = $('#eAappButtonGUID').text();
      //this.triggerBtnClickMap.set(this.triggerBtnID, true);
      //console.log(this.triggerBtnClickMap);
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

  public onSignatureDone(signatureObject?: any) {
    //console.log(signatureObject);
    this.triggerBtnClick = false;
    // this.triggerBtnClickMap.set(this.triggerBtnID, false);
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

  replaceHtmlCss() {
    let css = this.eAppPreviewHtmlPages.data.htmlStyles;
    if (css != undefined) {
      //alert(css);
      const head = document.getElementsByTagName('head')[0];
      const style = document.createElement('style');
      style.setAttribute('id', 'outputStyle');
      //style.id = 'outputStyle';
      style.type = 'text/css';
      style.appendChild(document.createTextNode(css));
      head.appendChild(style);
    }
  }

  ngOnDestroy(): void {
    if (document.getElementById('outputStyle') != undefined) document.getElementById('outputStyle').remove();
  }

  eappPreviewInNew() {
    this.replaceHtmlCss();
    this.eAppPreviewHtmlPagesProperty = this.eAppPreviewHtmlPages.data.EappHTMLPreview;
    let newServiceSignatureList = [];
    //loop through all api signture list
    this.eAppPreviewHtmlPages.data.signatureList.forEach((currServiceSignature) => {
      //find out if there is any existing signature
      if (currServiceSignature.signature == null) {
        let id = currServiceSignature.guid;
        setTimeout(() => {
          let displaySignatureImg = document.getElementById('signature' + id + '_img');
          $(displaySignatureImg).attr('src', ' ');
          $(displaySignatureImg).css('opacity', '0');
        }, 10);
      } else {
        let id = currServiceSignature.guid;
        setTimeout(() => {
          let displaySignatureImg = document.getElementById('signature' + id + '_img');
          $(displaySignatureImg).css('display', 'block');
          $(displaySignatureImg).css('opacity', '1');
        }, 10);
      }
      if (
        this.service.responseIO.data.ServiceSignatureList.length != undefined &&
        this.service.responseIO.data.ServiceSignatureList.length > 0
      ) {
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
        if (this.eAppPreviewHtmlPages.metadata != undefined)
          this.service.responseIO.metadata = this.eAppPreviewHtmlPages.metadata;
        if (this.eAppPreviewHtmlPages.lookups != undefined)
          this.service.responseIO.lookups = this.eAppPreviewHtmlPages.lookups;
      }
    });
    setTimeout(() => {
      this.service.responseIO.data.ServiceSignatureList.forEach((serviceSignature) => {
        var buttonObj = document.getElementById(serviceSignature.guid);
        if (buttonObj != undefined) buttonObj.addEventListener('click', this.onCapture.bind(event), false);
      });
    }, 100);
  }

  downloadPDF(languageCd?: string) {
    let respData: any;
    this.service.getEAppPreviewPdf(languageCd).subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        if (this.settingService.isRhosimulator === true || this.settingService.getApplicationMode() === 'online') {
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
  onEditPreference() {
    this.nullState = true;
  }
}
