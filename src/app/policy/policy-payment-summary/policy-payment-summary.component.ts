import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';
import { OfflineService } from 'src/app/offline/offline.service';
import { PolicyPaymentSummaryHandlerComponent } from './policy-payment-summary.handler';
import { FieldItem } from 'src/app/models/common/field-item';
import { NavigationLink } from 'src/app/models/common/navigation-link';

@Component({
  selector: 'sym-policy-payment-summary',
  templateUrl: './policy-payment-summary.component.html',
  styleUrls: ['./policy-payment-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPaymentSummaryComponent extends PolicyPaymentSummaryHandlerComponent implements OnChanges {
  navigationLinkList: NavigationLink[];
  viewPaymentListDisplayed: boolean;
  paymnetTableHtml: any;
  isPartyDocumentValid: boolean;

  constructor(
    policyService: PolicyService,
    public settingService: SettingService,
    protected offlineService: OfflineService
  ) {
    super(policyService, settingService, offlineService);
    // console.log(this.service.responseIO);
  }

  ngOnInit() {
    //Used for Offline
    if (this.settingService.getApplicationMode() !== 'offline') {
      setTimeout(() => {
        const payLink = document.getElementById('payLinkAcaId');

        if (payLink) {
          payLink.style.display = 'none';
        }
      });
    }
    this.loadNavigationLinkList();
    super.ngOnInit();
    this.checkPolicyField46Disabled();
    if (
      this.service.responseIO.data.PaymentAdditionalFields.policyField32 == 'PENDING' ||
      this.service.responseIO.data.PaymentAdditionalFields.policyField32 == 'CONFIRMED' ||
      this.service.responseIO.data.PaymentAdditionalFields.policyField32 == 'SUCCESS'
    ) {
      this.disableEnrollNowBtn();
      //  this.service.setFieldReadOnly(
      //           this.service.responseIO.data.PaymentAdditionalFields,
      //           'policyField46',
      //           'NO'
      //         );
      //  this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyField46', 'YES');
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      this.checkPolicyField46Disabled();
      if (
        this.service.responseIO.data.PaymentAdditionalFields.policyField32 == 'PENDING' ||
        this.service.responseIO.data.PaymentAdditionalFields.policyField32 == 'CONFIRMED' ||
        this.service.responseIO.data.PaymentAdditionalFields.policyField32 == 'SUCCESS'
      ) {
        this.disableEnrollNowBtn();
        // this.service.setFieldReadOnly(
        //           this.service.responseIO.data.PaymentAdditionalFields,
        //           'policyField46',
        //           'NO'
        //         );
        //  this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyField46', 'YES');
      }

      if (
        changes.responseIO.currentValue.data.PaymentAdditionalFields.field15 == 'YES' &&
        changes.responseIO.currentValue.data.Entity.statusCd != 'ACCEPTED'
      ) {
        this.disablePayNowBtn();
        // this.disablePayNowViaEmailBtn();
      }
      if (
        this.service.responseIO.data.PaymentAdditionalFields.policyField46 == 'YES' &&
        this.service.responseIO.data.Entity.statusCd != 'ACCEPTED'
      ) {
        this.disableEnrollNowBtn();
      }
    }, 100);
    super.ngOnChanges(changes);
  }
  checkPolicyField46Disabled() {
    setTimeout(() => {
      if (
        this.service.responseIO.data.PolicyAdditionalFields.field2 != '' &&
        this.service.responseIO.data.PolicyAdditionalFields.field2 != null &&
        this.service.responseIO.data.Entity.statusCd == 'ACCEPTED'
      ) {
        const partyDocs = this.service.responseIO?.data?.PartyDocumentList ?? [];
        this.isPartyDocumentValid = false;

        partyDocs.forEach((partyDoc: any) => {
          const categoryList = partyDoc.DocumentCategoryList ?? [];

          categoryList.forEach((category: any) => {
            const documentList = category.DocumentList ?? [];

            documentList.forEach((doc: any) => {
              const code = doc.documentCd;

              if (code === 'ADA' || code === 'BDIA') {
                const hasValidImage = doc.DocumentImageList?.some((image: any) => image.fileContents?.trim());

                if (hasValidImage) {
                  this.isPartyDocumentValid = true;
                }
              }

              if (this.isPartyDocumentValid) {
                this.service.setFieldReadOnly(
                  this.service.responseIO.data.PaymentAdditionalFields,
                  'policyField46',
                  'NO'
                );
              } else {
                this.service.setFieldReadOnly(
                  this.service.responseIO.data.PaymentAdditionalFields,
                  'policyField46',
                  'YES' // read-only
                );
              }
            });
          });
        });
      }
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (
        this.service.responseIO.data.PaymentAdditionalFields.policyField32 == 'PENDING' ||
        this.service.responseIO.data.PaymentAdditionalFields.policyField32 == 'SUCCESS'
      ) {
        this.disableEnrollNowBtn();
      }
      if (
        this.service.responseIO.data.PolicyAdditionalFields.field2 !== null &&
        this.service.responseIO.data.PolicyAdditionalFields.field2 !== ''
      ) {
        this.disableSPAJBtn();
      }

      if (
        this.service.responseIO.data.PaymentAdditionalFields.policyField43 == 'ADA' &&
        ((this.service.responseIO.data.PaymentAdditionalFields.policyField46 == 'YES' &&
          this.service.responseIO.data.PaymentAdditionalFields.policyField32 != 'FAILED') ||
          this.service.responseIO.data.PaymentAdditionalFields.policyField32 != null) &&
        (this.isPartyDocumentValid = true)
      ) {
        this.disableEnrollNowBtn();
      }
      if (
        this.service.responseIO.data.PaymentAdditionalFields.policyField46 == 'YES' &&
        this.service.responseIO.data.Entity.statusCd != 'ACCEPTED'
      ) {
        this.disableEnrollNowBtn();
      }
      if (
        this.service.responseIO.data.PaymentAdditionalFields.field15 == 'YES' &&
        this.service.responseIO.data.Entity.statusCd != 'ACCEPTED'
      ) {
        this.disablePayNowBtn();
        // this.disablePayNowViaEmailBtn();
      }
    }, 100);
  }

  public disableSPAJBtn() {
    const button = document.getElementById('spajId');
    if (button) {
      button.classList.add('disabled');
    }
  }

  public disablePayNowBtn() {
    const button = document.getElementById('payNow');
    const buttonViaEmail = document.getElementById('payNowViaEmail');

    if (button) {
      button.classList.add('disabled');
    }

    if (buttonViaEmail) {
      buttonViaEmail.classList.add('disabled');
    }
  }
  // public disablePayNowViaEmailBtn() {
  //   setTimeout(() => {
  //     const button = document.getElementById('payNowViaEmail');

  //     console.log('PAY NOW EMAIL BUTTON:', button);

  //     if (button) {
  //       button.classList.add('disabled');
  //       button.setAttribute('aria-disabled', 'true');
  //       (button as HTMLElement).style.pointerEvents = 'none';
  //       (button as HTMLElement).style.opacity = '0.65';
  //     }
  //   }, 1000);
  // }
  public disableEnrollNowBtn() {
    // setTimeout(() => {
    const button = document.getElementById('enrollNow');
    const buttonEnrollNowViaEmail = document.getElementById('enrollNowViaEmail');
    if (button) {
      button.classList.add('disabled');
    }
    if (buttonEnrollNowViaEmail) {
      buttonEnrollNowViaEmail.classList.add('disabled');
    }
    // });
  }

  public field15_change(item: FieldItem) {
    if (item.model.field15 == 'YES' && this.service.responseIO.data.Entity.statusCd != 'ACCEPTED') {
      setTimeout(() => {
        //  this.disablePayNowViaEmailBtn();
        this.disablePayNowBtn();
        // this.disablePayNowViaEmailBtn();
      });
    }
  }
  public policyField46_change(item: FieldItem) {
    if (item.model.policyField46 == 'YES' && this.service.responseIO.data.Entity.statusCd != 'ACCEPTED') {
      setTimeout(() => {
        this.disableEnrollNowBtn();
      });
    }
  }
  public policyField34_change(item: FieldItem) {
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyField35', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyFieldDt51', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyField37', null);
  }
  public policyField44_change(item: FieldItem) {
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyField45', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyFieldDt52', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyField47', null);
  }
  public policyField48_change(item: FieldItem) {
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyField49', null);
  }
  public field1_change(item: FieldItem) {
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'field2', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyFieldDt53', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'field14', null);
  }
  public field5_change(item: FieldItem) {
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'field6', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyFieldDt54', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'field8', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'field9', null);
  }
  public field10_change(item: FieldItem) {
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'field11', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyFieldDt55', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'field13', null);
  }
  public spajId_click() {
    let applicationType: any;
    applicationType = this.service.responseIO.data.BasePlan.addtnField1;
    let proposalNum = this.service.responseIO.data.Entity.proposalNum;
    this.service.generateApplicationNumber(applicationType, proposalNum).subscribe(
      (body) => {
        let resp = JSON.parse(JSON.stringify(body));
        console.log('applicationNum', resp.data.applicationNum);
        this.service.responseIO.data.PolicyAdditionalFields.field2 = resp.data.applicationNum;
        this.disableSPAJBtn();
        this.service.setFieldReadOnly(this.service.responseIO.data.PaymentAdditionalFields, 'field15', 'YES');
        // this.service.setFieldReadOnly(
        //   this.service.responseIO.data.PaymentAdditionalFields,
        //   'policyField46',
        //   'YES'
        // );
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  protected loadNavigationLinkList() {
    this.navigationLinkList = [];
    let nav = new NavigationLink();
    nav.link = 'initial_payment_Body';
    nav.labelKey = 'initialPayment';
    if (this.service.responseIO.data.InitialPayment != undefined) this.navigationLinkList.push(nav);

    nav = new NavigationLink();
    nav.link = 'renewal_payment_Body';
    nav.labelKey = 'renewalPayment';
    if (this.service.responseIO.data.RenewalPayment != undefined) this.navigationLinkList.push(nav);

    nav = new NavigationLink();
    nav.link = 'refund_payment_Body';
    nav.labelKey = 'refundPayment';
    if (this.service.responseIO.data.RefundPayment != undefined) this.navigationLinkList.push(nav);
  }

  payNow_click() {
    window.localStorage.setItem('POLICYSEQ', this.service.responseIO.data.Entity.id);
    window.localStorage.setItem('USERTYPE', this.service.responseIO.data.Entity.allocatedToRole);
    this.onPaymentClick();
  }
  enrollNow_click() {
    console.log('enrollnow click method callllll');
    window.localStorage.setItem('POLICYSEQ', this.service.responseIO.data.Entity.id);
    window.localStorage.setItem('USERTYPE', this.service.responseIO.data.Entity.allocatedToRole);
    this.onEntrollPaymentClick();
  }

  payNowTransfer_click() {
    window.localStorage.setItem('POLICYSEQ', this.service.responseIO.data.Entity.id);
    window.localStorage.setItem('USERTYPE', this.service.responseIO.data.Entity.allocatedToRole);
    this.onPaymentClick();
  }

  onPaymentClick() {
    this.paymentStatusCheck('PAYNOW');
  }
  onEntrollPaymentClick() {
    console.log('in onEntrollPaymentClick method called..... ');
    this.entrollPaymentStatusCheck('ENROLLNOW');
  }

  onPaymentStatusClick() {
    this.paymentStatusCheck('PAYMENTCHECK');
  }

  paymentStatusCheck(source: any) {
    if (
      this.settingService.getApplicationMode() === 'offline' &&
      (this.service.responseIO.data.Entity.statusCd === 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd === 'PAYMENTFAILED' ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === null ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === 'PENDING' ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === '')
    ) {
      this.service.checkPaymentStatus(false).subscribe(
        (body) => {
          let responseJson = JSON.parse(JSON.stringify(body));
          // this.service.responseIO = responseJson;

          if (responseJson.success) {
            this.success(
              responseJson['message'],
              () => {
                this.offlineService.reloadCurrentRoute();
              },
              false
            );
          } else {
            //this.warn('Awaiting Payment status ');
            if (source == 'PAYMENTCHECK') this.warn(responseJson['message']);
            else this.payNow();
          }
        },
        (error) => {
          console.log('Data load failed.');
          console.log('Error:', error);
        }
      );
    } else if (
      this.settingService.getApplicationMode() === 'online' &&
      (this.service.responseIO.data.Entity.statusCd === 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd === 'PAYMENTFAILED' ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === null ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === 'PENDING')
    ) {
      this.service.checkPaymentStatus(false).subscribe(
        (body) => {
          let responseJson = JSON.parse(JSON.stringify(body));
          //this.service.responseIO = responseJson;
          //console.log(responseJson);
          if (responseJson.success) {
            //this.offlineService.reloadCurrentRoute();
            this.success(
              responseJson['message'],
              () => {
                this.service.reloadCurrentRoute();
              },
              false
            );
          } else {
            //this.warn('Awaiting Payment status ');
            if (source == 'PAYMENTCHECK') this.warn(responseJson['message']);
            else this.payNow();
          }
        },
        (error) => {
          console.log('Data load failed.');
          console.log('Error:', error);
        }
      );
    }
  }
  entrollPaymentStatusCheck(source: any) {
    if (
      this.settingService.getApplicationMode() === 'offline' &&
      (this.service.responseIO.data.Entity.statusCd === 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd === 'PAYMENTFAILED' ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === null ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === 'PENDING' ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === '')
    ) {
      this.enrollNow();
      // this.service.checkPaymentStatusForEnrollNow(false).subscribe(
      //   (body) => {
      //     let responseJson = JSON.parse(JSON.stringify(body));
      //     // this.service.responseIO = responseJson;
      //     if (responseJson.success) {
      //       this.success(
      //         responseJson['message'],
      //         () => {
      //           this.offlineService.reloadCurrentRoute();
      //         },
      //         false
      //       );
      //     } else {
      //       //this.warn('Awaiting Payment status ');
      //       if (source == 'PAYMENTCHECK') this.warn(responseJson['message']);
      //       else this.enrollNow();
      //     }
      //   },
      //   (error) => {
      //     console.log('Data load failed.');
      //     console.log('Error:', error);
      //   }
      // );
    } else if (
      this.settingService.getApplicationMode() === 'online' &&
      (this.service.responseIO.data.Entity.statusCd === 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd === 'PAYMENTFAILED' ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === null ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === 'PENDING')
    ) {
      this.enrollNow();
      // this.service.checkPaymentStatusForEnrollNow(false).subscribe(
      //   (body) => {
      //     let responseJson = JSON.parse(JSON.stringify(body));
      //     //this.service.responseIO = responseJson;
      //     //console.log(responseJson);
      //     if (responseJson.success) {
      //       //this.offlineService.reloadCurrentRoute();
      //       this.success(
      //         responseJson['message'],
      //         () => {
      //           this.service.reloadCurrentRoute();
      //         },
      //         false
      //       );
      //     } else {
      //       //this.warn('Awaiting Payment status ');
      //       if (source == 'PAYMENTCHECK') this.warn(responseJson['message']);
      //       else this.enrollNow();
      //     }
      //   },
      //   (error) => {
      //     console.log('Data load failed.');
      //     console.log('Error:', error);
      //   }
      // );
    }
  }

  payNow() {
    //Login for offline Payment Gateway process
    if (
      this.settingService.getApplicationMode() === 'offline' &&
      this.settingService.isRhosimulator !== true &&
      (this.service.responseIO.data.Entity.statusCd === 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd === 'PAYMENTFAILED' ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === null ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === 'PENDING' ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === '')
    ) {
      this.offlineService.onOfflinePayment(this.service.responseIO.data.InitialPayment.id);
    } else {
      document.forms['paymentGatewayForm'].submit();
    }
  }
  enrollNow() {
    //Login for offline Payment Gateway process
    // if (
    //   this.settingService.getApplicationMode() === 'offline' &&
    //   this.settingService.isRhosimulator !== true &&
    //   (this.service.responseIO.data.Entity.statusCd === 'PAYMENTPENDING' ||
    //     this.service.responseIO.data.Entity.statusCd === 'PAYMENTFAILED' ||
    //     this.service.responseIO.data.InitialPayment.inwardStatusCd === null ||
    //     this.service.responseIO.data.InitialPayment.inwardStatusCd === 'PENDING' ||
    //     this.service.responseIO.data.InitialPayment.inwardStatusCd === '')
    // ) {
    //   this.offlineService.onOfflinePayment(this.service.responseIO.data.InitialPayment.id);
    // } else {
    document.forms['paymentGatewayForm1'].submit();
    if (
      this.service.responseIO.data.PaymentAdditionalFields.field32 != null &&
      this.service.responseIO.data.PaymentAdditionalFields.field32 != 'failed'
    ) {
      this.disableEnrollNowBtn();
    }

    // }
  }

  payLinkId_click() {
    this.viewPaymentList();
  }
  payLinkAcaId_click() {
    this.acaPaymentStatusCheck();
  }

  payLinkRsId_click() {
    this.viewPaymentList();
  }

  protected viewPaymentList() {
    this.paymentLinkStatusCheck('PAYNENTDETAILSQUERY');
  }

  public paymentLinkStatusCheck(source: any) {
    if (
      this.settingService.getApplicationMode() === 'offline' &&
      (this.service.responseIO.data.Entity.statusCd === 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd === 'PAYMENTFAILED' ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === null ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === 'PENDING' ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === '')
    ) {
      this.service.checkPaymentStatus(false, source).subscribe(
        (body) => {
          let responseJson = JSON.parse(JSON.stringify(body));
          // this.service.responseIO = responseJson;
          if (responseJson.success) {
            //this.offlineService.reloadCurrentRoute();
            if (source == 'PAYNENTDETAILSQUERY') {
              if (responseJson.data.viewPaymentData !== null && responseJson.data.viewPaymentData !== undefined) {
                this.paymnetTableHtml = responseJson.data.viewPaymentData;
                this.viewPaymentListDisplayed = true;
                this.service.hideLoader(undefined, undefined);
                this.openModal('viewPaymentList');
              }
            }
          } else {
            this.settingService.alertService.error(responseJson.message);
          }
        },
        (error) => {
          console.log('Data load failed.');
          console.log('Error:', error);
        }
      );
    } else if (
      this.settingService.getApplicationMode() === 'online' &&
      (this.service.responseIO.data.Entity.statusCd === 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd === 'PAYMENTFAILED' ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === null ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === 'PENDING')
    ) {
      this.service.checkPaymentStatus(false, source).subscribe(
        (body) => {
          let responseJson = JSON.parse(JSON.stringify(body));
          if (source == 'PAYNENTDETAILSQUERY') {
            if (responseJson.data.viewPaymentData !== null && responseJson.data.viewPaymentData !== undefined) {
              this.paymnetTableHtml = responseJson.data.viewPaymentData;
              this.viewPaymentListDisplayed = true;
              this.service.hideLoader(undefined, undefined);
              this.openModal('viewPaymentList');
            }
          }
        },
        (error) => {
          console.log('Data load failed.');
          console.log('Error:', error);
        }
      );
    }
  }
  closePaymentLinkList() {
    this.closeModal('viewPaymentList');
    if (this.selectedStep.id != undefined && this.selectedStep.id === 'step_payment') {
      this.service.reloadCurrentRoute();
    }
    this.viewPaymentListDisplayed = false;
  }
  ngOnDestroy() {
    this.closeModal('viewPaymentList');
    this.viewPaymentListDisplayed = false;
    this.service.isXMLCodeRendered = true;
  }
  protected payNowViaEmail_click() {
    this.payNowViaEmailLink_click('PAYNOW');
  }

  protected payNowViaEmailLink_click(source: any) {
    if (this.service.getFieldLookupSize(this.service.responseIO.data.Entity, 'allocationPartyGuidList') > 0) {
      // this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'field21', 'INITIATED_CPAGEMAIL');
      if (
        this.settingService.getApplicationMode() === 'offline' &&
        (this.service.responseIO.data.Entity.statusCd === 'PAYMENTPENDING' ||
          this.service.responseIO.data.Entity.statusCd === 'PAYMENTFAILED' ||
          this.service.responseIO.data.InitialPayment.inwardStatusCd === null ||
          this.service.responseIO.data.InitialPayment.inwardStatusCd === 'PENDING' ||
          this.service.responseIO.data.InitialPayment.inwardStatusCd === '')
      ) {
        this.service.checkPaymentStatus(false).subscribe(
          (body) => {
            let responseJson = JSON.parse(JSON.stringify(body));

            if (responseJson.success) {
              this.success(
                responseJson['message'],
                () => {
                  this.offlineService.reloadCurrentRoute();
                },
                false
              );
            } else {
              //this.warn('Awaiting Payment status ');
              if (source == 'PAYMENTCHECK') this.warn(responseJson['message']);
              else this.getSendCPAGPaymentLink();
            }
          },
          (error) => {
            console.log('Data load failed.');
            console.log('Error:', error);
          }
        );
      } else if (
        this.settingService.getApplicationMode() === 'online' &&
        (this.service.responseIO.data.Entity.statusCd === 'PAYMENTPENDING' ||
          this.service.responseIO.data.Entity.statusCd === 'PAYMENTFAILED' ||
          this.service.responseIO.data.InitialPayment.inwardStatusCd === null ||
          this.service.responseIO.data.InitialPayment.inwardStatusCd === 'PENDING')
      ) {
        this.service.checkPaymentStatus(false).subscribe(
          (body) => {
            let responseJson = JSON.parse(JSON.stringify(body));
            if (responseJson.success) {
              this.success(
                responseJson['message'],
                () => {
                  this.service.reloadCurrentRoute();
                },
                false
              );
            } else {
              //this.warn('Awaiting Payment status ');
              if (source == 'PAYMENTCHECK') this.warn(responseJson['message']);
              else this.getSendCPAGPaymentLink();
            }
          },
          (error) => {
            console.log('Data load failed.');
            console.log('Error:', error);
          }
        );
      }
    }
  }
  getSendCPAGPaymentLink(): void {
    let trigger = 'CPAG';
    setTimeout(() => {
      this.service.getSendCPAGPaymentLink(trigger).subscribe(
        (successResponse) => {
          if (successResponse['success'] == true) {
            this.info(successResponse['message'], () => {});
            console.log('sendCPAG payment link successful.');
          } else {
            this.error(successResponse['message'], undefined, true);
          }
          console.log(successResponse['message']);
        },
        (error) => {
          console.log('Error:123', error);
        }
      );
    }, 100);
  }

  protected enrollNowViaEmail_click(paymentType: any) {
    let trigger = 'ACA';
    if (this.service.getFieldLookupSize(this.service.responseIO.data.Entity, 'allocationPartyGuidList') > 0) {
      setTimeout(() => {
        this.service.getSendCPAGPaymentLink(trigger).subscribe(
          (successResponse) => {
            if (successResponse['success'] == true) {
              this.info(successResponse['message'], () => {});
              console.log('sendACA payment link successful.');
            } else {
              this.error(successResponse['message'], undefined, true);
            }
            console.log(successResponse['message']);
          },
          (error) => {
            console.log('Error:123', error);
          }
        );
      }, 100);
    }
  }
  acaPaymentStatusCheck() {
    if (
      this.settingService.getApplicationMode() === 'offline' &&
      (this.service.responseIO.data.Entity.statusCd === 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd === 'PAYMENTFAILED' ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === null ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === 'PENDING' ||
        this.service.responseIO.data.InitialPayment.inwardStatusCd === '')
    ) {
      let proposalNum = this.service.responseIO.data.Entity.proposalNum;
      // let applicationRefNum=this.service.responseIO.data.Entity.applicationRefNum;
      this.service.getAcaCheckPaymentStatus(proposalNum).subscribe(
        (body) => {
          let responseJson = JSON.parse(JSON.stringify(body));
          // if (responseJson.success) {
          if (responseJson['success'] == true) {
            this.info(responseJson['message'], () => {});
            console.log('sendACA payment link successful.');
          } else {
            this.error(responseJson['message'], undefined, true);
          }
          // }
        },
        (error) => {
          console.log('Data load failed.');
          console.log('Error:', error);
        }
      );
    }
  }
}
