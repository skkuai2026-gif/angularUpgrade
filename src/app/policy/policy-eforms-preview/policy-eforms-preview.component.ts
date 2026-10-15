import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { PolicyDocumentFormHandler } from '../policy-document-form/policy-document-form.component.handler';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: 'sym-policy-eforms-preview',
  templateUrl: './policy-eforms-preview.component.html',
  styleUrls: ['./policy-eforms-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyEformsPreviewComponent extends PolicyDocumentFormHandler implements OnInit, OnChanges {
  public signDocsRoleCd: string;
  public captureSign: boolean = false;
  documentRoleMap: { [key: string]: string[] } = {};
  currentRoleDocumentStatus: { [key: string]: { checked: boolean; visible: boolean } } = {};
  documentServiceDocumentMap: { [key: string]: any } = {};
  previewClicked: boolean = false;
  currRoleCodeDocsList: string[] = [];
  currentSelectedDoc: string;
  public triggerBtnClick = false;
  public isSIPreviewed = false;
  fnaServiceSignatureList: any;
  @Output() onSignatureClear = new EventEmitter<boolean>();

  public newSignatureUIReqd = false;
  public triggerBtnID;
  public currServiceSignature: any;

  constructor(policyService: PolicyService) {
    super(policyService);
    this.captureSign = true;
  }
  ngOnInit() {
    this.loadOneSignatureDocumentForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  loadOneSignatureDocumentForm() {
    this.getDefaultDocument();
    this.initializeCurrentRoleDocumentStatus();
    this.populateCurrentRoleStatus();
  }
  getDefaultDocument() {
    this.currRoleCodeDocsList = [];

    const partyDocumentFormList = this.service.responseIO.data?.PartyDocumentFormList || [];
    partyDocumentFormList.forEach((form: any) => {
      form.DocumentCategoryList?.forEach((category: any) => {
        category.DocumentList?.forEach((doc: any) => {
          if (doc.documentCd) {
            this.currRoleCodeDocsList.push(doc.documentCd);
          }
        });
      });
    });
    console.log('currRoleCodeDocsList', this.currRoleCodeDocsList);
  }

  initializeCurrentRoleDocumentStatus() {
    if (
      this.service.responseIO.data.PartyDocumentFormList != undefined &&
      this.service.responseIO.data.PartyDocumentFormList.length > 0
    ) {
      this.service.responseIO.data.PartyDocumentFormList[0].DocumentFormCategoryList.forEach(
        (documentFormCategory) => {
          if (documentFormCategory.DocumentList) {
            documentFormCategory.DocumentList.forEach((documentList) => {
              if (documentList.selected == 'YES') {
                this.documentServiceDocumentMap[documentList.documentCd] = documentList;
                this.currRoleCodeDocsList.push(documentList.documentCd);
              }
            });
          }
        }
      );
    }
    this.currRoleCodeDocsList.forEach((documentCd, index) => {
      this.currentRoleDocumentStatus[documentCd] = {
        checked: false,
        visible: index === 0,
      };
    });
  }

  populateCurrentRoleStatus() {
    this.currRoleCodeDocsList.forEach((documentCd, index) => {
      const roles = this.documentRoleMap[documentCd];
      if (roles != undefined && roles != null && roles.includes(this.signDocsRoleCd)) {
        this.currentRoleDocumentStatus[documentCd].checked = true;
      }

      if (index > 0) {
        this.currentRoleDocumentStatus[this.currRoleCodeDocsList[index]].visible =
          this.currentRoleDocumentStatus[this.currRoleCodeDocsList[index - 1]].checked &&
          this.currentRoleDocumentStatus[this.currRoleCodeDocsList[index - 1]].visible;
      }
    });
  }

  // checkAllFormCompleted(): boolean {
  //   let allFormComplete = true;
  //   if (this.currRoleCodeDocsList == undefined || this.currRoleCodeDocsList.length == 0) allFormComplete = false;
  //   this.currRoleCodeDocsList.forEach((documentCd) => {
  //     if (this.currentRoleDocumentStatus[documentCd].checked != true) {
  //       allFormComplete = false;
  //       return;
  //     }
  //   });
  //   return allFormComplete;
  // }

  public loadPreview(documentCd: string, viewType: string, displayLoader?: boolean) {
    // if (
    //   this.service.responseIO.data.Entity.statusCd == 'SIGNED' ||
    //   this.service.responseIO.data.Entity.statusCd == 'SUBMITTED'
    // ) {
    //   this.captureSign = false;
    // } else {
    //   this.captureSign = this.currentRoleDocumentStatus[documentCd].visible;
    // }
    this.captureSign = true;
    this.currentSelectedDoc = documentCd;
    const roles = this.documentRoleMap[this.currentSelectedDoc];
    if (roles?.includes(this.signDocsRoleCd)) {
      this.documentRoleMap[this.currentSelectedDoc] = roles.filter((role) => role !== this.signDocsRoleCd);
      this.documentRoleMap[this.currentSelectedDoc].push(this.signDocsRoleCd);
      // if (this.signDocsRoleCd != 'TRADITIONALSIGNATURETAB')
      //   this.service.responseIO.data.OtherAdditionalFields.field3 = JSON.stringify(this.documentRoleMap);
      // else this.service.responseIO.data.OtherAdditionalFields.field4 = JSON.stringify(this.documentRoleMap);
    }

    let serviceDocument;
    if (
      this.documentServiceDocumentMap[documentCd] != undefined &&
      this.documentServiceDocumentMap[documentCd] != null
    )
      serviceDocument = this.documentServiceDocumentMap[documentCd];
    if (serviceDocument != undefined && serviceDocument != null) {
      this.previewClicked = true;
      this.loadPreviewEforms(serviceDocument, viewType);
    } else this.error('Service document missing');
  }

  public loadPreviewEforms(serviceDocument: any, viewType: string, displayLoader?: boolean) {
    let buttonId = viewType == 'pdf' ? 'download_eForm_' : 'preview_eForm_';
    this.service.displayLoader(true);
    this.eFormPreviewHtmlMap.clear();
    this.service.eFormPreview(serviceDocument, viewType, displayLoader, false, this.captureSign).subscribe(
      (successResponse) => {
        this.service.hideLoader(true);
        let previewContents: any;
        let respData: any = JSON.parse(JSON.stringify(successResponse));
        if (respData.data?.EFormPreviewHtml != undefined) {
          previewContents = {
            html: respData.data.EFormPreviewHtml,
            css: respData.data.EFormPreviewHtmlStyles,
          };
          this.selectedServiceDocument = serviceDocument;
          let newServiceSignatureList = [];
          if (respData.data.signatureList) {
            respData.data.signatureList.forEach((currServiceSignature) => {
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
              if (
                currServiceSignature != undefined &&
                currServiceSignature.status != 'I' &&
                this.selectedStep.id == 'step_submitStatus'
              ) {
                this.service.setFieldReadOnly(currServiceSignature, 'signature', 'YES');
              }
              newServiceSignatureList.push(currServiceSignature);
            });
            if (newServiceSignatureList.length > 0) {
              const existingGuids = new Set(newServiceSignatureList.map((item) => item.guid));
              this.service.responseIO.data.ServiceSignatureList.forEach((serviceSignature) => {
                if (!existingGuids.has(serviceSignature.guid)) newServiceSignatureList.push(serviceSignature);
              });
              this.service.responseIO.data.ServiceSignatureList = [];
              this.service.responseIO.data.ServiceSignatureList = newServiceSignatureList;
            }
          }
          setTimeout(() => {
            if (this.service.responseIO.data.ServiceSignatureList) {
              this.service.responseIO.data.ServiceSignatureList.forEach((serviceSignature) => {
                var buttonObj = document.getElementById(serviceSignature.guid);
                if (buttonObj != undefined) buttonObj.addEventListener('click', this.onCapture.bind(event), false);
              });
            }
          }, 100);
          if (viewType == 'html') {
            this.openModal('eFormPreviewModal');
          }
        } else if (respData.data?.pdfFileContents != undefined) {
          previewContents = respData.data.pdfFileContents;
          this.downloadOrOpenContent(
            previewContents,
            'pdf',
            this.service.getMultilingualLabel(this.service.getFieldLookupDesc(serviceDocument, 'documentCd'))
          );
        }
        this.eFormPreviewHtmlMap.set(serviceDocument.documentCd + '_' + viewType, previewContents);
        if (viewType == 'htmlEntry') {
          setTimeout(() => {
            this.setEventListener();
          }, 100);
        }
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  postClearSignature(event: boolean) {
    if (event) {
      this.onSignatureClear.emit(true);
    }
  }

  public previewPopupClosed() {
    let signDone = true;
    if (this.currentRoleDocumentStatus[this.currentSelectedDoc].checked == false) {
      this.service.responseIO.data.ServiceSignatureList.forEach((serviceSignature) => {
        if (
          serviceSignature.roleCd === this.currentSelectedDoc &&
          (serviceSignature.signature === undefined || serviceSignature.signature === null)
        ) {
          signDone = false;
        }
      });
    }
    if (!signDone) {
      this.confirm(
        this.service.getMultilingualLabel('ERR_PLZCOMPLETE_SIGNATURE'),
        () => {
          this.previewClicked = false;
        },
        () => {
          this.openModal('eFormPreviewModal');
        }
      );
    } else if (this.currentRoleDocumentStatus[this.currentSelectedDoc]?.visible) {
      this.previewClicked = false;

      if (!this.documentRoleMap[this.currentSelectedDoc]) {
        this.documentRoleMap[this.currentSelectedDoc] = [this.signDocsRoleCd];
      } else if (!this.documentRoleMap[this.currentSelectedDoc].includes(this.signDocsRoleCd)) {
        this.documentRoleMap[this.currentSelectedDoc].push(this.signDocsRoleCd);
      }

      // if (this.signDocsRoleCd != 'TRADITIONALSIGNATURETAB')
      // this.service.responseIO.data.OtherAdditionalFields.field3 = JSON.stringify(this.documentRoleMap);
      // else this.service.responseIO.data.OtherAdditionalFields.field4 = JSON.stringify(this.documentRoleMap);

      this.populateCurrentRoleStatus();
      // this.setButtonListForConfirmSignTab();
    }
  }
  public onSignatureDone(signatureObject?: any) {
    this.triggerBtnClick = false;
  }
  // setButtonListForConfirmSignTab() {
  //   if (this.service.responseIO.data.Entity.statusCd === 'ACCEPTED') {
  //     if (this.checkAllFormCompleted() && this.signDocsRoleCd == 'TRADITIONALSIGNATURETAB') {
  //       this.selectedStep.buttonList = ['but_Back', 'but_Doc_DraftSave', 'but_Trad_Sign'];
  //     } else if (this.service.checkForSigndPartyDocuments()) {
  //       this.selectedStep.buttonList = ['but_Back', 'but_Doc_DraftSave'];
  //     } else {
  //       this.selectedStep.buttonList = ['but_Back', 'but_Doc_DraftSave'];
  //     }
  //   }
  // }

  getEformsLabel(documentCd: string): string {
    // const basePlan = this.service.responseIO?.data?.BasePlan;

    // if (basePlan?.productId && basePlan?.productPlanOptionCd) {
    //   const key = `${documentCd}_${basePlan.productId}`;
    //   const label = this.service.getMultilingualLabel(key);

    //   if (label !== key) {
    //     return label;
    //   }
    // }

    return this.service.getMultilingualLabel(documentCd);
  }
  onCapture(element) {
    let guid = element.srcElement.id;
    $('#eAappButtonGUID').text(guid);
    $('#eAappButtonGUID').trigger('click');
  }
  getElement() {
    this.triggerBtnID = undefined;
    this.triggerBtnClick = false;
    setTimeout(() => {
      this.triggerBtnID = $('#eAappButtonGUID').text();
      this.triggerBtnClick = true;
      let serviceSignatureDO;
      if (this.service.responseIO.data.ServiceSignatureList) {
        serviceSignatureDO = this.service.responseIO.data.ServiceSignatureList.find(
          (existServiceSignature: any) => existServiceSignature.guid === this.triggerBtnID
        );
      }
      if (serviceSignatureDO != null && serviceSignatureDO != undefined) {
        this.currServiceSignature = serviceSignatureDO;
      }
    }, 10);
  }
}
