import { ActivatedRoute, Router } from '@angular/router';
import { ResponseIO } from './../../models/responseIO';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  output,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { QuotationService } from '../services/quotation.service';
import { QuoteIllustrationHandlerComponent } from './quote-illustration.handler';
import { OfflineService } from '../../offline/offline.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { DatePipe } from '@angular/common';
declare const setScrollAndScreenHeight: any;
import { BaseStepFormComponent } from 'src/app/system-common/base-step-form/base-step-form.component';
@Component({
  selector: 'sym-quote-illustration',
  templateUrl: './quote-illustration.component.html',
  styleUrls: ['./quote-illustration.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class QuoteIllustrationComponent extends QuoteIllustrationHandlerComponent {
  @Input() showOnlyIllustration: boolean;
  @Input() showSign: boolean;
  constructor(
    quotationService: QuotationService,
    router: Router,
    offlineService: OfflineService,
    settingService: SettingService
  ) {
    super(quotationService, router, offlineService, settingService);
    this.showOnlyIllustration = false;
    this.newSignatureUIReqd = true;
  }
  // ngOnInit() {
  //   if (this.showSign == true) {
  //     setTimeout(() => {
  //       this.displayIllustration();
  //     }, 1000);
  //   } else super.ngOnInit();
  // }
  private policyApplyTriggered = false;
  public isPolicyOutputPreferenceLoading = false;

  ngOnInit() {
    if (this.showSign === true) {
      // Policy Preview:
      // Always keep Output Preference fields readonly/disabled.
      // This does not depend on responseIO.data.Entity.
      this.isPolicyOutputPreferenceLoading = true;

      // Wait until the policy model is ready before auto-applying.
      setTimeout(() => {
        this.autoApplyPolicyWhenReady();
      }, 0);
    } else {
      // Quotation Preview: keep Output Preferences manual.
      super.ngOnInit();
    }
  }

  private autoApplyPolicyWhenReady(retryCount: number = 0): void {
    const MAX_RETRIES = 50;
    const RETRY_DELAY = 100;
    const entity = this.service?.responseIO?.data?.Entity;

    if (!entity) {
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => {
          this.autoApplyPolicyWhenReady(retryCount + 1);
        }, RETRY_DELAY);
      } else {
        // Policy model never became available.
        // Keep all Output Preference fields readonly/disabled,
        // but keep the Apply button enabled so the user can retry.
        this.isPolicyOutputPreferenceLoading = true;
        this.policyApplyTriggered = false;

        console.error(
          'Policy Output Preference auto-Apply failed: responseIO.data.Entity was not available.'
        );
      }
      return;
    }

    if (this.policyApplyTriggered) {
      return;
    }

    this.policyApplyTriggered = true;

    // Disable only Output Preferences while the policy illustration loads.
    // The Apply button remains enabled.
    this.isPolicyOutputPreferenceLoading = true;

    if (
      this.settingService.isRhosimulator === true ||
      this.settingService.getApplicationMode() === 'online'
    ) {
      this.displayIllustration();
    } else {
      this.displayIllustrationOffline();
    }
  }

  viewIllustrationInOld() {
    this.illustrationHtmlPagesProperty = [];
    this.illustrationHtmlPagesProperty = Object.keys(
      this.illustrationHtmlPages.data.viewIllustration
    );
    let newServiceSignatureList = [];
    this.illustrationHtmlPagesProperty.forEach((item) => {
      if (
        this.illustrationHtmlPages.data.viewIllustration[item].signature == null
      ) {
        let id =
          this.illustrationHtmlPages.data.viewIllustration[item].name - 1;
        setTimeout(() => {
          let displaySignatureImg =
            id == 0
              ? 'signatureSIGNATURECAPTURE' + '_img'
              : 'signatureSIGNATURECAPTURE' + id + '_img';
          $(displaySignatureImg).css('src', ' ');
          $(displaySignatureImg).css('opacity', '0');
        }, 30);
      }
      if (
        this.illustrationHtmlPages.data.viewIllustration[item].signature !=
          null &&
        this.illustrationHtmlPages.data.viewIllustration[item].signature !=
          undefined &&
        this.illustrationHtmlPages.data.viewIllustration[item].signature != ''
      ) {
        let signatureKey = Object.keys(
          this.illustrationHtmlPages.data.viewIllustration[item].signature
        )[0];
        if (
          this.illustrationHtmlPages.data.viewIllustration[item].signature[
            signatureKey
          ] != undefined &&
          this.illustrationHtmlPages.data.viewIllustration[item].signature[
            signatureKey
          ] != '' &&
          this.illustrationHtmlPages.data.viewIllustration[item].signature[
            signatureKey
          ].signature != null
        ) {
          let id =
            this.illustrationHtmlPages.data.viewIllustration[item].signature[
              signatureKey
            ].signatureTypeCd;
          setTimeout(() => {
            let displaySignatureImg = document.getElementById(id + '_img');
            $(displaySignatureImg).css('display', 'block');
            $(displaySignatureImg).css('opacity', '1');
          }, 30);
        }
        let currServiceSignature =
          this.illustrationHtmlPages.data.viewIllustration[item].signature[
            signatureKey
          ];
        if (this.service?.responseIO?.data?.ServiceSignatureList?.length > 0) {
          let serviceSignatureDO =
            this.service.responseIO.data.ServiceSignatureList.find(
              (existServiceSignature) =>
                existServiceSignature.signatureTypeCd ===
                currServiceSignature.signatureTypeCd
            );
          if (serviceSignatureDO != null && serviceSignatureDO != undefined) {
            currServiceSignature = serviceSignatureDO;
          }
        }
        let isAlreayAdded = false;
        if (newServiceSignatureList.length > 0) {
          let serviceSignatureDO = newServiceSignatureList.find(
            (existServiceSignature) =>
              existServiceSignature.signatureTypeCd ===
              currServiceSignature.signatureTypeCd
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
          this.service.setFieldReadOnly(
            currServiceSignature,
            'signature',
            'YES'
          );
        }
        if (!isAlreayAdded) {
          newServiceSignatureList.push(currServiceSignature);
        }
        this.signtureObjectIndex.set(item, newServiceSignatureList.length - 1);
        if (newServiceSignatureList.length > 0) {
          this.service.responseIO.data.ServiceSignatureList = [];
          this.service.responseIO.data.ServiceSignatureList =
            newServiceSignatureList;
          if (this.illustrationHtmlPages.metadata != undefined)
            this.service.responseIO.metadata =
              this.illustrationHtmlPages.metadata;
        }
      }
    });
    setTimeout(() => {
      this.service.responseIO.data.ServiceSignatureList.forEach(
        (serviceSignature) => {
          var buttonObj = document.getElementById(serviceSignature.guid);
          if (buttonObj != undefined && buttonObj != null)
            buttonObj.addEventListener(
              'click',
              this.onSignatureCapture.bind(event),
              false
            );
        }
      );
    }, 100);
  }

  async displayIllustrationOffline() {
    const entity = this.service?.responseIO?.data?.Entity;

    if (!entity) {
      console.error(
        'displayIllustrationOffline called before responseIO.data.Entity was available.'
      );
      return;
    }

    if (this.showSign === true) {
      this.service.setModelFieldValue(entity, 'autoMakeCd', 'ENABLESIGN');
    } else {
      this.service.setModelFieldValue(entity, 'autoMakeCd', undefined);
    }

    let body = await this.service.getQuoteIllustrationOfflineNative();
    if (body['success'] == false) {
      this.error(body['message'], undefined);
      return;
    }
    this.illustrationHtmlPages = new ResponseIO();
    this.illustrationHtmlPages = JSON.parse(
      JSON.stringify(JSON.parse(JSON.parse(JSON.stringify(body)).response))
    );

    if (
      this.illustrationHtmlPages &&
      this.illustrationHtmlPages != undefined &&
      this.illustrationHtmlPages.data &&
      this.illustrationHtmlPages.data != undefined
    ) {
      this.nullState = false;
      if (this.illustrationHtmlPages.data.viewIllustration != undefined) {
        this.viewIllustrationInOld();
      } else if (
        this.illustrationHtmlPages.data.viewHtmlIllustration != undefined
      ) {
        this.viewIllustrationInNew();
      }
    }
    setTimeout(() => {
      setScrollAndScreenHeight();
      this.quoteIllustrationLoaded.emit(true);
      // Notify the parent only after the illustration has loaded successfully.
      this.notifyApplyButtonClick.emit(true);
      // this.service.loadScroll();
    }, 150);

    //   },
    //   (error) => {

    //     this.error('Error:' + error, undefined, true);
    //     // alert('Error:' + error);

    //   }
    // );
  }

  displayIllustration() {
    const entity = this.service?.responseIO?.data?.Entity;

    if (!entity) {
      if (this.showSign === true) {
        // Keep policy Output Preferences readonly, but leave Apply enabled.
        this.isPolicyOutputPreferenceLoading = true;
        this.policyApplyTriggered = false;
      }
      console.error(
        'displayIllustration called before responseIO.data.Entity was available.'
      );
      return;
    }

    if (this.showSign === true) {
      this.service.setModelFieldValue(entity, 'autoMakeCd', 'ENABLESIGN');
    } else {
      this.service.setModelFieldValue(entity, 'autoMakeCd', undefined);
    }

    this.service.getQuoteIllustrationPart().subscribe(
      (body) => {
        if (body['success'] == false) {
          this.error(body['message'], undefined);
          return;
        }
        this.illustrationHtmlPages = new ResponseIO();
        this.illustrationHtmlPages = JSON.parse(JSON.stringify(body));
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
          } else if (
            this.illustrationHtmlPages.data.viewHtmlIllustration != undefined
          ) {
            this.viewIllustrationInNew();
          }
        }
        setTimeout(() => {
          setScrollAndScreenHeight();
          // this.service.loadScroll();
          this.isPolicyOutputPreferenceLoading = false;
          this.quoteIllustrationLoaded.emit(true);
          // Notify the parent only after the illustration has loaded successfully.
          this.notifyApplyButtonClick.emit(true);
        }, 15);
      },
      (error) => {
        this.isPolicyOutputPreferenceLoading = false;
        this.policyApplyTriggered = false;
        this.error('Error:' + error, undefined, true);
        // alert('Error:' + error);
      }
    );
  }
  //pdf name
  onDownloadPDFClick(event) {
    if (!this.isOutputPreferenceReq) {
      this.downloadPDF();
    }
  }
  downloadPDF() {
    let FileName;
    let pdfMode;
    let respData: any;
    let leadId = this.service.responseIO.data.Entity.leadId;
    this.service.generateIllustrationPdf().subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        FileName = respData.data.FileName;
        pdfMode = respData.data.pdfMode;
        if (
          this.settingService.isRhosimulator === true ||
          this.settingService.getApplicationMode() === 'online'
        ) {
          this.downloadOrOpenContent(
            respData.data.pdfFileContents,
            'pdf',
            this.service.responseIO.data.Entity.quotationRefNum != undefined
              ? FileName
              : 'download'
          );
          // open model for password format message for online
          if (
            SettingService.getApplicationPropertiesValue(
              'IS_ENCRYPTEDDOWNLOADPDF_REQD'
            ) == 'YES'
          ) {
            if (leadId != null) {
              this.info(
                this.settingService.getLabelValue(
                  'pdfDownloadpasswordMessageProposer'
                ),
                () => {
                  let responseIO = new ResponseIO();
                  this.service.responseIO = responseIO.copyFrom(
                    this.service.responseIO
                  );

                  this.service.responseIO.validationerrors = undefined;
                  this.closeModal('downloadPDFModal');
                }
              );
            } else if (leadId == null) {
              this.info(
                this.settingService.getLabelValue(
                  'pdfDownloadpasswordMessageQuickQuote'
                ),
                () => {
                  let responseIO = new ResponseIO();
                  this.service.responseIO = responseIO.copyFrom(
                    this.service.responseIO
                  );

                  this.service.responseIO.validationerrors = undefined;
                  this.closeModal('downloadPDFModal');
                }
              );
            }
          }
        } else if (pdfMode === 'offlinePDFGeneration') {
          // open model for password format message for online
          if (
            SettingService.getApplicationPropertiesValue(
              'IS_ENCRYPTEDDOWNLOADPDF_REQD'
            ) == 'YES'
          ) {
            if (leadId == null || leadId == '') {
              this.info(
                this.settingService.getLabelValue(
                  'pdfDownloadpasswordMessageQuickQuote'
                ),
                () => {
                  let responseIO = new ResponseIO();
                  this.service.responseIO = responseIO.copyFrom(
                    this.service.responseIO
                  );

                  this.service.responseIO.validationerrors = undefined;
                  this.closeModal('downloadPDFModal');
                }
              );
            } else if (leadId != null && leadId != '') {
              this.info(
                this.settingService.getLabelValue(
                  'pdfDownloadpasswordMessageProposer'
                ),
                () => {
                  let responseIO = new ResponseIO();
                  this.service.responseIO = responseIO.copyFrom(
                    this.service.responseIO
                  );

                  this.service.responseIO.validationerrors = undefined;
                  this.closeModal('downloadPDFModal');
                }
              );
            }
          }
          //open pdf in offline
          this.offlineService.openPdfURL(FileName);
        } else {
          //create pdf from content and open in offline
          this.offlineService.openPdf(respData.data.pdfFileContents);
        }
      },
      (error) => {}
    );
  }
  openLinkToEappPopup() {
    //this.openPopup('submitPolicyModal');
    let event: any;
    this.onConvertToEappClick(event);
  }
  closeSubmitPolicyModal() {
    this.closeModal('submitPolicyModal');
  }
  onRefreshEappClick($event) {
    this.triggerEappBtnClick = true;
    let respData: any;
    this.service.refreshEapp().subscribe(
      (successResponse) => {
        this.info(
          this.service.getMultilingualLabel('refreshEappconfirmation'),
          () => {
            this.triggerEappBtnClick = false;
            if (successResponse['success'] == true) {
              respData = JSON.parse(JSON.stringify(successResponse));
              this.router.navigate([
                'policy/' + respData.data.Entity.policySeq
              ]);
            } else {
              this.error(successResponse['message'], undefined, true);
            }
          }
        );
      },

      (error) => {
        this.triggerEappBtnClick = false;
      }
    );
  }
  onviewEappClick($event) {
    if (
      this.service.responseIO.data.Entity.policySeq != undefined ||
      this.service.responseIO.data.Entity.policySeq != null
    ) {
      this.router.navigate([
        'policy/' + this.service.responseIO.data.Entity.policySeq
      ]);
    }
  }
  // sendEmail() {
  //   this.shouldSendEmail = false;
  //   if (
  //     this.service.responseIO.data.EmailRequest.toEmail != null &&
  //     this.service.responseIO.data.EmailRequest.toEmail != undefined &&
  //     this.service.responseIO.data.EmailRequest.toEmail != ''
  //   ) {
  //     this.service.sendEmail().subscribe(
  //       (emailResponse) => {
  //         if (emailResponse['validationerrors']) {
  //           this.shouldSendEmail = false;
  //           let responseIO = new ResponseIO();
  //           responseIO.data = this.service.responseIO.data;
  //           responseIO.metadata = this.service.responseIO.metadata;
  //           responseIO.lookups = this.service.responseIO.lookups;

  //           if (this.service.responseIO.validationerrors)
  //             responseIO.validationerrors = this.service.responseIO.validationerrors;
  //           if (responseIO.validationerrors)
  //             Object.assign(responseIO.validationerrors, emailResponse['validationerrors']);
  //           else responseIO.validationerrors = emailResponse['validationerrors'];

  //           this.service.responseIO = responseIO;
  //         } else {
  //           this.info(this.service.getMultilingualLabel('Email sent successfully'), () => {
  //             // Need to create a new responseIO since if errors are cleared they
  //             // need to be cleared from the UI as well
  //             let responseIO = new ResponseIO();
  //             this.service.responseIO = responseIO.copyFrom(this.service.responseIO);
  //             this.service.responseIO.validationerrors = undefined;
  //             this.shouldSendEmail = true;
  //             this.closeModal('emailModal');

  //           });
  //         }
  //       },
  //       (error) => {
  //         // Move this block inside the subscribe method

  //       }
  //     );
  //   } else {
  //     this.shouldSendEmail = false;
  //     this.error(this.service.getMultilingualLabel('emailMandatoryMsg'), () => {
  //       this.setFieldFocus(this.service.responseIO.data.EmailRequest, 'toEmail');
  //     });
  //   }
  // }
  isSendingEmail: boolean = false; // Flag to track if email is being sent
  shouldSendEmail: boolean = false; // Flag to control modal dismissal

  sendEmail() {
    if (this.isSendingEmail) return; // Prevent further clicks
    this.isSendingEmail = true; // Set flag to true

    if (this.service.responseIO.data.EmailRequest.toEmail) {
      this.service.sendEmail().subscribe(
        (emailResponse) => {
          this.isSendingEmail = false; // Reset flag
          this.shouldSendEmail = true; // Set to true to allow modal dismissal
          if (emailResponse['validationerrors']) {
            // Handle validation errors
            this.shouldSendEmail = false;
            let responseIO = new ResponseIO();
            responseIO.data = this.service.responseIO.data;
            responseIO.metadata = this.service.responseIO.metadata;
            responseIO.lookups = this.service.responseIO.lookups;

            if (this.service.responseIO.validationerrors)
              responseIO.validationerrors =
                this.service.responseIO.validationerrors;
            if (responseIO.validationerrors)
              Object.assign(
                responseIO.validationerrors,
                emailResponse['validationerrors']
              );
            else
              responseIO.validationerrors = emailResponse['validationerrors'];

            this.service.responseIO = responseIO;
          } else {
            if (emailResponse['success'] == true) {
              this.info(
                this.service.getMultilingualLabel('Email sent successfully'),
                () => {
                  // Need to create a new responseIO since if errors are cleared they
                  // need to be cleared from the UI as well
                  let responseIO = new ResponseIO();
                  this.service.responseIO = responseIO.copyFrom(
                    this.service.responseIO
                  );
                  this.service.responseIO.validationerrors = undefined;
                  this.shouldSendEmail = true;
                  this.closeModal('emailModal');
                }
              );
            } else {
              this.info(emailResponse['message'], () => {
                this.shouldSendEmail = false;
                this.closeModal('emailModal');
              });
              // this.error(emailResponse['message']), undefined, true;
            }
          }
        },
        (error) => {
          // <-- This was the incorrect placement in your code
          this.isSendingEmail = false; // Reset flag
        }
      );
    } else {
      this.shouldSendEmail = false; // Ensure shouldSendEmail is false
      this.isSendingEmail = false; // Reset flag
      this.error(this.service.getMultilingualLabel('emailMandatoryMsg'), () => {
        this.setFieldFocus(
          this.service.responseIO.data.EmailRequest,
          'toEmail'
        );
      });
    }
  }
  onswitchProposalPurpose(event) {
    this.openModal('switchProposalPurpose');
  }
  onSwitckProposalOk() {
    this.closeModal('switchProposalPurpose');
    const entity = this.service.responseIO?.data?.Entity;

    this.service.setModelFieldValue(entity, 'uploadFlag', 'NO');
    this.service.setModelFieldValue(entity, 'step', 0);
    this.service.setModelFieldValue(entity, 'visitedTabs', null);
    this.service.setModelFieldValue(entity, 'quoteStatusCd', 'PENDING');

    const isOnline = this.settingService.getApplicationMode() === 'online';
    const quotationId = isOnline ? entity.id : entity.object;

    const modelNameBodyList = this.service.getModelNameBodyList(
      this.service.currentActiveStepObj.selectedTab.modelList
    );

    if (!isOnline) {
      // Navigate first for offline mode
      this.router.navigate(['quotation/' + quotationId]);
    }

    this.service.process(quotationId, modelNameBodyList).subscribe(
      (response) => {
        this.service.responseIO = JSON.parse(JSON.stringify(response));

        if (isOnline) {
          // Navigate after process for online mode
          this.router.navigate(['quotation/' + quotationId]);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
