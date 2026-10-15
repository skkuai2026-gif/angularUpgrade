import { SettingService } from 'src/app/system-common/services/setting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseIO } from './../../models/responseIO';
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
import { QuotationService } from '../services/quotation.service';
import { OfflineService } from '../../offline/offline.service';

declare const setScrollAndScreenHeight: any;

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuoteIllustrationHandlerComponent extends BaseComponent<QuotationService> implements OnChanges {
  illustrationHtmlPages: ResponseIO;
  illustrationHtmlPagesProperty;
  nullState: boolean;
  isOutputPreferenceReq: boolean;
  public signtureObjectIndex = new Map();
  shouldSendEmail: boolean;
  currServiceSignature: any;
  triggerBtnClick: boolean;
  triggerEappBtnClick: boolean;
  public newSignatureUIReqd: boolean;
  htmlOutputPreferenceModel: any;
  isResetOutputPreferenceReq: boolean;

  @Input() linkEappRequired: boolean;

  @Output() notifyApplyButtonClick = new EventEmitter<boolean>();

  /**
   * Will emit true if the quoteIllustration(Preview) is successfully Loaded.
   */
  @Output() quoteIllustrationLoaded = new EventEmitter<boolean>();

  constructor(
    public quotationService: QuotationService,
    public router: Router,
    public offlineService: OfflineService,
    public settingService: SettingService
  ) {
    super(quotationService);
    // showLoader();
    // hideLoader();
    this.nullState = true;
    this.shouldSendEmail = false;
    this.triggerBtnClick = false;
    this.triggerEappBtnClick = false;
    this.newSignatureUIReqd = false;
    this.linkEappRequired = true;

    this.isOutputPreferenceReq =
      SettingService.getApplicationPropertiesValue('ISOUTPUTPREFERENCESREQ') == 'YES' ? true : false;

    this.isResetOutputPreferenceReq =
      this.service.getCompanyFacetValue('RESETOUTPUTPREFERENCESREQ') == 'YES' ? true : false;
    if (this.service.getCompanyFacetValue('NEWSIGNATUREUIREQD') != null) {
      this.newSignatureUIReqd = this.service.getCompanyFacetValue('NEWSIGNATUREUIREQD') == 'YES' ? true : false;
    }

    // console.log(this.isOutputPreferenceReq);
  }
  ngOnInit() {
    if (this.isResetOutputPreferenceReq)
      this.htmlOutputPreferenceModel = this.service.clone(this.service.responseIO.data.OutputPreferences);
    else this.htmlOutputPreferenceModel = this.service.responseIO.data.OutputPreferences;
    if (this.nullState && !this.isOutputPreferenceReq) {
      if (this.settingService.isRhosimulator === true || this.settingService.getApplicationMode() === 'online') {
        this.displayIllustration();
      } else {
        this.displayIllustrationOffline();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  displayIllustration() {
    if (this.isResetOutputPreferenceReq)
      Object.assign(this.service.responseIO.data.OutputPreferences, this.htmlOutputPreferenceModel);
    this.notifyApplyButtonClick.emit(true);
    this.service.getQuoteIllustrationPart().subscribe(
      (body) => {
        if (body['success'] == false) {
          this.error(body['message'], undefined);
          return;
        }
        this.illustrationHtmlPages = new ResponseIO();
        this.illustrationHtmlPages = JSON.parse(JSON.stringify(body));

        // console.log('Log:', this.illustrationHtmlPages.data.viewHtmlIllustration);
        // if (
        //   this.service.isMobileViewRendeered() &&
        //   this.illustrationHtmlPages.data.viewHtmlIllustration != undefined
        // ) {
        //   // this.illustrationHtmlPages.data.viewHtmlIllustration.replace('initial-scale=1.0', 'initial-scale=0.0');
        //   // setTimeout(() => {
        //   //   document
        //   //     .querySelector('meta[name=viewport]')
        //   //     .setAttribute('content', 'width=device-width, initial-scale=0.0');
        //   // }, 100);
        // }
        if (
          this.illustrationHtmlPages &&
          this.illustrationHtmlPages != undefined &&
          this.illustrationHtmlPages.data &&
          this.illustrationHtmlPages.data != undefined
        ) {
          this.nullState = false;
          if (this.illustrationHtmlPages.data.viewIllustration != undefined) {
            this.viewIllustrationInOld();
          } else if (this.illustrationHtmlPages.data.viewHtmlIllustration != undefined) {
            this.viewIllustrationInNew();
          }
        }
        setTimeout(() => {
          setScrollAndScreenHeight();
          // this.service.loadScroll();
          this.quoteIllustrationLoaded.emit(true);
        }, 15);
        console.log('Data loaded successful.');
      },
      (error) => {
        console.log('Data load failed.');
        this.quoteIllustrationLoaded.emit(false);
        this.error('Error:' + error, undefined, true);
        // alert('Error:' + error);
        console.log('Error:', error);
      }
    );
  }
  onDownloadPDFClick(event) {
    if (this.isResetOutputPreferenceReq) this.service.clearModel(this.service.responseIO.data.OutputPreferences);
    if (!this.isOutputPreferenceReq) {
      this.downloadPDF();
    }
  }

  onEmailButtonClick(event) {
    if (this.isResetOutputPreferenceReq) this.service.clearModel(this.service.responseIO.data.OutputPreferences);
  }

  onSignatureCapture(element) {
    // console.log(element.srcElement.id);
    let guid = element.srcElement.id;
    // console.log(this);
    $('#buttonGUID').text(guid);
    $('#buttonGUID').trigger('click');
    // let capSign = () => {
    //   console.log(this);
    //   //this.triggerBtnClick = true;
    // };
    // capSign();
  }

  getElement() {
    this.triggerBtnClick = false;
    setTimeout(() => {
      let triggerBtnID = $('#buttonGUID').text();
      this.triggerBtnClick = true;
      let serviceSignatureDO = this.service.responseIO.data.ServiceSignatureList.find(
        (existServiceSignature: any) => existServiceSignature.guid === triggerBtnID
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
  }

  downloadPDF() {
    let respData: any;
    this.service.generateIllustrationPdf().subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        if (this.settingService.isRhosimulator === true || this.settingService.getApplicationMode() === 'online') {
          this.downloadOrOpenContent(
            respData.data.pdfFileContents,
            'pdf',
            this.service.responseIO.data.Entity.quotationRefNum != undefined
              ? this.service.responseIO.data.Entity.quotationRefNum
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

  sendEmail() {
    this.shouldSendEmail = false;
    if (
      this.service.responseIO.data.EmailRequest.toEmail != null &&
      this.service.responseIO.data.EmailRequest.toEmail != undefined &&
      this.service.responseIO.data.EmailRequest.toEmail != ''
    ) {
      this.service.sendEmail().subscribe(
        (emailResponse) => {
          if (emailResponse['validationerrors']) {
            this.shouldSendEmail = false;
            let responseIO = new ResponseIO();
            responseIO.data = this.service.responseIO.data;
            responseIO.metadata = this.service.responseIO.metadata;
            responseIO.lookups = this.service.responseIO.lookups;

            if (this.service.responseIO.validationerrors)
              responseIO.validationerrors = this.service.responseIO.validationerrors;
            if (responseIO.validationerrors)
              Object.assign(responseIO.validationerrors, emailResponse['validationerrors']);
            else responseIO.validationerrors = emailResponse['validationerrors'];
            this.service.responseIO = responseIO;
          } else {
            //Need to create a new responseio since if errors are cleared they
            //need to be cleared from the UI as well
            let responseIO = new ResponseIO();
            this.service.responseIO = responseIO.copyFrom(this.service.responseIO);
            this.service.responseIO.validationerrors = undefined;
            this.shouldSendEmail = true;
            this.closeModal('emailModal');
            console.log('Eamil send successful.');
          }
        },
        (error) => {
          console.log('Email send failed.');
          console.log('Error:', error);
        }
      );
    } else {
      this.shouldSendEmail = false;
      this.error(this.service.getMultilingualLabel('emailMandatoryMsg'), () => {
        this.setFieldFocus(this.service.responseIO.data.EmailRequest, 'toEmail');
      });
    }
  }

  onConvertToEappClick($event) {
    this.triggerEappBtnClick = true;
    let respData: any;
    this.service.convertToEapp().subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        if (respData.data.Entity.isInvalid && respData.data.Entity.invalidReason != null) {
          this.error(respData.data.Entity.invalidReason);
          this.triggerEappBtnClick = false;
        } else {
          this.postConvertToEapp(successResponse);
          this.router.navigate(['policy/' + respData.data.Entity.policySeq]);
          this.triggerEappBtnClick = false;
          console.log('ConvertToEapp successful.');
        }
      },
      (error) => {
        this.postConvertToEappError(error);
        this.triggerEappBtnClick = false;
        console.log('ConvertToEapp failed.');
        console.log('Error:', error);
      }
    );
  }
  postConvertToEapp(successResponse: Object) {}
  postConvertToEappError(error: any) {}
  /*
    onAcceptIllustrationClick() {
        this.service.acceptIllustration().subscribe(
            (successResponse) => {
                console.log('Accept Illustration  successful.');
            },
            (error) => {
                console.log('Accept Illustration failed.');
                console.log('Error:', error);
            }
        );
    }
    */

  onEditPreference() {
    this.nullState = true;
  }

  onRefreshEappClick($event) {
    this.triggerEappBtnClick = true;
    let respData: any;
    this.service.refreshEapp().subscribe(
      (successResponse) => {
        this.triggerEappBtnClick = false;
        if (successResponse['success'] == true) {
          respData = JSON.parse(JSON.stringify(successResponse));
          this.router.navigate(['policy/' + respData.data.Entity.policySeq]);
        } else {
          this.error(successResponse['message'], undefined, true);
        }
      },
      (error) => {
        this.triggerEappBtnClick = false;
        console.log('Refresh Eapp failed.');
        console.log('Error:', error);
      }
    );
  }

  viewIllustrationInOld() {
    this.illustrationHtmlPagesProperty = [];
    this.illustrationHtmlPagesProperty = Object.keys(this.illustrationHtmlPages.data.viewIllustration);
    let newServiceSignatureList = [];
    this.illustrationHtmlPagesProperty.forEach((item) => {
      if (this.illustrationHtmlPages.data.viewIllustration[item].signature == null) {
        let id = this.illustrationHtmlPages.data.viewIllustration[item].name - 1;
        setTimeout(() => {
          let displaySignatureImg =
            id == 0 ? 'signatureSIGNATURECAPTURE' + '_img' : 'signatureSIGNATURECAPTURE' + id + '_img';
          $(displaySignatureImg).css('src', ' ');
          $(displaySignatureImg).css('opacity', '0');
        }, 30);
      }
      if (this.illustrationHtmlPages.data.viewIllustration[item].signature != null) {
        let signatureKey = Object.keys(this.illustrationHtmlPages.data.viewIllustration[item].signature)[0];
        if (this.illustrationHtmlPages.data.viewIllustration[item].signature[signatureKey].signature != null) {
          let id = this.illustrationHtmlPages.data.viewIllustration[item].signature[signatureKey].signatureTypeCd;
          setTimeout(() => {
            let displaySignatureImg = document.getElementById(id + '_img');
            $(displaySignatureImg).css('display', 'block');
            $(displaySignatureImg).css('opacity', '1');
          }, 30);
        }
        let currServiceSignature = this.illustrationHtmlPages.data.viewIllustration[item].signature[signatureKey];
        if (this.service.responseIO.data.ServiceSignatureList.length > 0) {
          let serviceSignatureDO = this.service.responseIO.data.ServiceSignatureList.find(
            (existServiceSignature) =>
              existServiceSignature.signatureTypeCd === currServiceSignature.signatureTypeCd
          );
          if (serviceSignatureDO != null && serviceSignatureDO != undefined) {
            currServiceSignature = serviceSignatureDO;
          }
        }
        let isAlreayAdded = false;
        if (newServiceSignatureList.length > 0) {
          let serviceSignatureDO = newServiceSignatureList.find(
            (existServiceSignature) =>
              existServiceSignature.signatureTypeCd === currServiceSignature.signatureTypeCd
          );
          if (serviceSignatureDO != null && serviceSignatureDO != undefined) {
            isAlreayAdded = true;
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
        if (!isAlreayAdded) {
          newServiceSignatureList.push(currServiceSignature);
        }
        this.signtureObjectIndex.set(item, newServiceSignatureList.length - 1);
      }
    });
    if (newServiceSignatureList.length > 0) {
      this.service.responseIO.data.ServiceSignatureList = [];
      this.service.responseIO.data.ServiceSignatureList = newServiceSignatureList;
      if (this.illustrationHtmlPages.metadata != undefined)
        this.service.responseIO.metadata = this.illustrationHtmlPages.metadata;
      if (this.illustrationHtmlPages.lookups != undefined)
        this.service.responseIO.lookups = this.illustrationHtmlPages.lookups;
    }
  }

  replaceHtmlCss() {
    let css = this.illustrationHtmlPages.data.htmlStyles;
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

  viewIllustrationInNew() {
    this.replaceHtmlCss();
    this.illustrationHtmlPagesProperty = this.illustrationHtmlPages.data.viewHtmlIllustration;
    let newServiceSignatureList = [];
    //loop through all api signture list
    this.illustrationHtmlPages.data.signatureList.forEach((currServiceSignature) => {
      if (currServiceSignature.signature == null) {
        let id = currServiceSignature.guid;
        setTimeout(() => {
          let displaySignatureImg = document.getElementById('signature' + id + '_img');
          $(displaySignatureImg).css('src', ' ');
          $(displaySignatureImg).css('opacity', '0');
        }, 30);
      } else {
        let id = currServiceSignature.guid;
        setTimeout(() => {
          let displaySignatureImg = document.getElementById('signature' + id + '_img');
          $(displaySignatureImg).css('display', 'block');
          $(displaySignatureImg).css('opacity', '1');
        }, 30);
      }
      if (this.service.responseIO.data.ServiceSignatureList.length > 0) {
        //find out if there is any existing signature
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
        if (this.illustrationHtmlPages.metadata != undefined)
          this.service.responseIO.metadata = this.illustrationHtmlPages.metadata;
        if (this.illustrationHtmlPages.lookups != undefined)
          this.service.responseIO.lookups = this.illustrationHtmlPages.lookups;
      }
    });
    setTimeout(() => {
      this.service.responseIO.data.ServiceSignatureList.forEach((serviceSignature) => {
        var buttonObj = document.getElementById(serviceSignature.guid);
        if (buttonObj != undefined)
          buttonObj.addEventListener('click', this.onSignatureCapture.bind(event), false);
      });
    }, 100);
  }

  async displayIllustrationOffline() {
    this.notifyApplyButtonClick.emit(true);

    let body = await this.service.getQuoteIllustrationOfflineNative();
    if (body['success'] == false) {
      this.error(body['message'], undefined);
      return;
    }
    this.illustrationHtmlPages = new ResponseIO();
    this.illustrationHtmlPages = JSON.parse(JSON.stringify(JSON.parse(JSON.parse(JSON.stringify(body)).response)));

    if (
      this.illustrationHtmlPages &&
      this.illustrationHtmlPages != undefined &&
      this.illustrationHtmlPages.data &&
      this.illustrationHtmlPages.data != undefined
    ) {
      this.nullState = false;
      if (this.illustrationHtmlPages.data.viewIllustration != undefined) {
        this.viewIllustrationInOld();
      } else if (this.illustrationHtmlPages.data.viewHtmlIllustration != undefined) {
        this.viewIllustrationInNew();
      }
    }
    setTimeout(() => {
      setScrollAndScreenHeight();
      // this.service.loadScroll();
    }, 15);
    console.log('Data loaded successful.');
    //   },
    //   (error) => {
    //     console.log('Data load failed.');
    //     this.error('Error:' + error, undefined, true);
    //     // alert('Error:' + error);
    //     console.log('Error:', error);
    //   }
    // );
  }
}
