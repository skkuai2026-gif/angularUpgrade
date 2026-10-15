import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Inject,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BaseService } from '../services/base.service';
import { ResponseIO } from 'src/app/models/responseIO';
import { FieldItem } from 'src/app/models/common/field-item';
import { activeStepComponent } from '../step/step.component';
import { StepItem } from 'src/app/models/common/step-item';

import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.vfs = (pdfFonts as any).pdfMake?.vfs ?? (pdfFonts as any).vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { TabItem } from 'src/app/models/common/tab-items';
declare const responsiveBehaviour: any;

declare const openModal: any;
declare const closeModal: any;
declare const openPopup: any;
declare const closePopup: any;
declare const scrollToTop: any;
declare const setFocus: any;
declare const removeActiveElmFocus: any;

@Component({
  selector: 'sym-base',
  template: ``,
  styleUrls: ['./base.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export abstract class BaseComponent<S extends BaseService> implements OnInit, OnChanges {
  /**
   * This is a optional Object. It expects XML DOM format Object
   * e.g: This would be a HTMLCollection type.
   */
  @Input() xmlDom;
  @Input() responseUpdated: boolean = true;
  @Output() notifyReloadStep = new EventEmitter<any>();
  @Output() notifyInputModify = new EventEmitter<FieldItem>();

  @ViewChild('convertToPDFTemplate') convertToPDFTemplate: ElementRef;
  public selectedStep: StepItem;
  protected altService: BaseService;

  constructor(@Inject('service') public service: S) {
    if (activeStepComponent != undefined) {
      this.selectedStep = activeStepComponent.stepItem;
      if (this.service != undefined && this.selectedStep != undefined) {
        this.service.currentActiveStep = this.selectedStep.id;
        this.service.currentActiveStepObj = this.selectedStep;
      }
    }

    //alert(this.selectedStep.buttonList);
  }

  ngOnInit() {
    // this.service.fieldItemObservable.subscribe((item) => {
    //   if (!this.service.isfieldItemCalled && item) {
    //     this.setVisitedTabs(this.service.currentActiveTab);
    //     this.callCustomOnChange(item);
    //     // console.log(item.fieldCd);
    //   }
    // });
  }

  ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   * @param item expects the item updated.
   * invokes when the input fields are updated and check if there is any methods to be triggered.
   */
  public onInputChanged(item: FieldItem) {
    // console.log(item);
    let service = this.altService != undefined ? this.altService : this.service;
    let isMetadataHelpReqd = service.responseIO['isMetadataHelpReqd'];
    if (item != undefined) {
      service.currentActiveField = item.fieldCd;
      item.isOnChangeTriggered = true;
    }
    let isCallCustomOnChangeFun: boolean = true;
    //console.log('ctxenabled:' + item.fieldCd + ':' + item.fieldMetadata.ISCTXENABLED + 'event: ' + item.event);

    // Added the VALIDATEFLD check to prevent the validate API and fetchMetadata API being called together. Now, when this flag is set to YES, the validate API will be invoked instead of directly calling the fetchMetadata API.
    //P.s. Override the functions where validate API is invoked (To avoid multiple API calls)
    if (item.fieldMetadata.ISCTXENABLED && item.fieldMetadata.VALIDATEFLD == undefined) {
      // alert('is context enabled');
      isCallCustomOnChangeFun = false;
      let respData: any;
      if (item != undefined)
        console.log('call for context enabled field: ' + item.model.objName + '.' + item.fieldCd);
      // let modelNameListArray = this.selectedTab.modelList;
      // console.log(item.fieldCd);
      service.fetchMetadata().subscribe(
        (successResponse) => {
          respData = JSON.parse(JSON.stringify(successResponse));
          //console.log('returned from ctx fetchmetadata' + item.fieldCd);

          let responseIO = new ResponseIO();
          responseIO.data = service.responseIO.data;
          responseIO.lookupkeyFOptionList = service.responseIO.lookupkeyFOptionList;

          if (isMetadataHelpReqd != undefined) responseIO['isMetadataHelpReqd'] = isMetadataHelpReqd;
          //responseIO.callOnChange = this.service.responseIO.callOnChange;
          //assign instead of replace since certain objects metadata is not returned
          //const returnedTarget = Object.assign(target, source);
          responseIO.metadata = Object.assign(service.responseIO.metadata, respData.metadata);
          responseIO.lookups = Object.assign(service.responseIO.lookups, respData.lookups);
          //responseIO.lookups = respData.lookups;
          //responseIO.metadata = respData.metadata;
          responseIO.validationerrors = service.responseIO.validationerrors;
          service.responseIO = responseIO;
          //set the current items metadata as well
          item.fieldMetadata = service.getFieldMetadata(item.model, item.fieldCd);
          // this.setNextFieldFocus(item.model, item.fieldCd);
          // setTimeout(() => {
          //   this.setFieldFocus(item.model, item.fieldCd);
          // }, 150);
          //Call custom on change here after the metadata is refreshed.
          setTimeout(() => {
            //it is possible that due to metadata refreshed some fields may now have the valdiate property set . in that case need to call the validate function
            this.callValidation(item);
            // this.callCustomOnChange(item, true);
          }, 10);
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    } else if (item.fieldMetadata.VALIDATEFLD && item.fieldMetadata.VALIDATEFLD == 'YES') {
      isCallCustomOnChangeFun = false;
      this.callValidation(item);
    }
    if (isCallCustomOnChangeFun) {
      // this.setNextFieldFocus(item.model, item.fieldCd);
      this.callCustomOnChange(item, true);
    }
    setTimeout(() => {
      service.setFieldFocusForDisabledScroll();
    }, 10);

    // updating the current selected step
    if (service.currentActiveStepObj != undefined) {
      for (let i = 0; i < service.currentActiveStepObj.tabList.length; i++) {
        if (
          service.currentActiveStepObj.tabList[i].dependentFields?.includes(
            item.path != undefined ? item.path : item.model.objName + '.' + item.fieldCd
          )
        ) {
          if (
            service.currentActiveStepObj.tabList[i].xmlIfExpression != undefined &&
            this.service.responseIO != undefined
          ) {
            service.currentActiveStepObj.tabList[i].visible = this.service.isApplicable(
              service.currentActiveStepObj.tabList[i].xmlIfExpression,
              this.service.responseIO
            );
          }
          this.refreshStepList();
        }
      }
    }
    this.notifyInputModify.emit(item);
  }

  protected callValidation(item?: FieldItem) {
    //item.event is undefined when called from validate function itself.
    //this is to avoid recursive calling of the validate function on change of the functions
    //in some cases need to call recursively like populate ocr data hence setting
    //in new variable callOnChange
    if (
      item == undefined ||
      (item.fieldMetadata.VALIDATEFLD && item.fieldMetadata.VALIDATEFLD == 'YES' && item.event != undefined)
    ) {
      if (item != undefined)
        console.log('call for validate enabled field: ' + item.model.objName + '.' + item.fieldCd);
      // if (true && item.event != undefined) {
      let isMetadataHelpReqd = this.service.responseIO['isMetadataHelpReqd'];
      this.service.validate().subscribe(
        (successResponse) => {
          let successRespData = JSON.parse(JSON.stringify(successResponse));
          let newResponseIO = new ResponseIO();
          newResponseIO.data = successRespData.data;
          if (isMetadataHelpReqd != undefined) newResponseIO['isMetadataHelpReqd'] = isMetadataHelpReqd;
          //assign instead of replace since certain objects metadata is not returned
          //const returnedTarget = Object.assign(target, source);
          newResponseIO.metadata = successRespData.metadata;
          newResponseIO.lookups = successRespData.lookups;
          //  console.log('error', successRespData.validationerrors);
          //Commented call to mergeValidationerrors since was raising validation errors on tab out itself which is not required
          // if (item != undefined)
          //   this.mergeValidationerrors(successRespData, newResponseIO, item.model.guid, item.fieldCd);
          this.service.responseIO = newResponseIO;
          //this.service.refreshLookups(newResponseIO.lookups, this.service.responseIO);
          this.setVisitedTabs(this.service.currentActiveTab);
          //emit to the base step from the component and call the merge step list. Also, resolve the issue of tab visibility based on the symif condition
          this.refreshStepList();

          //Call custom on change here after the metadata is refreshed.
          if (item != undefined) {
            setTimeout(() => {
              if (item.path != undefined) item.model = this.service.getModel(item.path);
              this.callCustomOnChange(item, true);
              setTimeout(() => {
                this.service.setFieldFocusForDisabledScroll();
              }, 150);
            }, 10);
          }
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    } else {
      //Call custom on change here after the metadata is refreshed.
      if (item != undefined) {
        setTimeout(() => {
          this.callCustomOnChange(item, true);
          setTimeout(() => {
            this.service.setFieldFocusForDisabledScroll();
          }, 150);
        }, 10);
      }
    }
  }

  private mergeValidationerrors(
    successRespData: ResponseIO,
    newResponseIO: ResponseIO,
    modelGuid: string,
    fieldCd: string
  ) {
    //copy existing validation into new response io
    newResponseIO.validationerrors = this.service.responseIO.validationerrors;
    //first check success response validation contain any current model,current field error
    if (
      successRespData.validationerrors != undefined &&
      successRespData.validationerrors[this.service.currentActiveTab] != undefined &&
      successRespData.validationerrors[this.service.currentActiveTab][modelGuid] != undefined &&
      successRespData.validationerrors[this.service.currentActiveTab][modelGuid][fieldCd] != undefined
    ) {
      //if new response doesn't have validation or current tab validation then add entire validation json body into new response io
      if (
        newResponseIO.validationerrors == undefined ||
        newResponseIO.validationerrors[this.service.currentActiveTab] == undefined
      ) {
        //newResponseIO.validationerrors = successRespData.validationerrors;
        let validationerrors = {
          [this.service.currentActiveTab]: {
            [modelGuid]: {
              [fieldCd]: successRespData.validationerrors[this.service.currentActiveTab][modelGuid][fieldCd],
            },
          },
        };
        //console.log('validationerrors-', validationerrors);
        newResponseIO.validationerrors = validationerrors;
      }
      //if new response doesn't have current model validation then add only model validation json body into new response io
      else if (
        newResponseIO.validationerrors[this.service.currentActiveTab] != undefined &&
        newResponseIO.validationerrors[this.service.currentActiveTab][modelGuid] == undefined
      ) {
        let validationerrors = {
          [modelGuid]: {
            [fieldCd]: successRespData.validationerrors[this.service.currentActiveTab][modelGuid][fieldCd],
          },
        };

        //console.log('validationerrors with currentActiveTab-', validationerrors);
        Object.assign(newResponseIO.validationerrors[this.service.currentActiveTab], validationerrors);
      }
      //if new response doesn't have current field validation then add only field validation json body into new response io
      else if (
        newResponseIO.validationerrors[this.service.currentActiveTab][modelGuid] != undefined &&
        newResponseIO.validationerrors[this.service.currentActiveTab][modelGuid][fieldCd] == undefined
      ) {
        let validationerrors = {
          [fieldCd]: successRespData.validationerrors[this.service.currentActiveTab][modelGuid][fieldCd],
        };
        //console.log('validationerrors with model guid-', validationerrors);
        Object.assign(newResponseIO.validationerrors[this.service.currentActiveTab][modelGuid], validationerrors);
      }
      //if new response contain current field validation then add current field validation json body into new response io
      else if (
        newResponseIO.validationerrors[this.service.currentActiveTab][modelGuid] != undefined &&
        newResponseIO.validationerrors[this.service.currentActiveTab][modelGuid][fieldCd] != undefined
      ) {
        let validationerrors = [
          successRespData.validationerrors[this.service.currentActiveTab][modelGuid][fieldCd],
        ];

        //console.log('validationerrors with fieldCd-', validationerrors);
        newResponseIO.validationerrors[this.service.currentActiveTab][modelGuid][fieldCd] = validationerrors;
      }
    }
    // if successRespData doesn't contain current field validation then remove validation from
    //newResponseIO
    else if (
      newResponseIO.validationerrors != undefined &&
      newResponseIO.validationerrors[this.service.currentActiveTab] != undefined &&
      newResponseIO.validationerrors[this.service.currentActiveTab][modelGuid] != undefined &&
      newResponseIO.validationerrors[this.service.currentActiveTab][modelGuid][fieldCd] != undefined
    ) {
      delete newResponseIO.validationerrors[this.service.currentActiveTab][modelGuid][fieldCd];
    }
  }
  /**
   *
   * @ignore
   */
  private callCustomOnChange(item: FieldItem, isFocusCalled?: boolean) {
    let functionName;
    this.service.responseFieldChanged.next(item);
    functionName = item.fieldCd + '_change';
    if (typeof this[functionName] === 'function') {
      // this.service.isfieldItemCalled = true;
      eval('this.' + functionName + '(item)');
      setTimeout(() => {
        this.service.setFieldFocusForDisabledScroll();
      }, 150);
    }
    if (isFocusCalled) {
      setTimeout(() => {
        let focused = $(':focus');
        if (focused && focused.length === 0) {
          //Added focus on next field for context enabled fields on tab out of current field
          // const inputTypeCd =
          //   item.fieldMetadata?.INPUTTYPECD == undefined ? 'TEXT' : item.fieldMetadata?.INPUTTYPECD;
          // const inputTypes = ['DATE', 'TEXT', 'DATETIME'];
          // if (inputTypes.includes(inputTypeCd)) {
          //   this.setNextFieldFocus(item.model, item.fieldCd);
          // } else {
          //   this.setNextFieldFocus(item.model, item.fieldCd);
          // }
          this.setNextFieldFocus(item.model, item.fieldCd);
        }
      }, 1000);
    }

    // setTimeout(() => {
    //   this.service.clearSubscribe();
    // }, 10);
  }

  /**
   *
   * @param item expects the item updated.
   * invokes when the input fields are updated and check if there is any methods to be triggered.
   */
  public onInputFocused(item: FieldItem) {
    let functionName;
    // if(item.index != undefined && item.index != null){
    // functionName = item.fieldID.replace('_'+ item.index, '') +'_change'
    // }else{
    functionName = item.fieldCd + '_focus';
    // }
    //   console.log(functionName)
    if (typeof this[functionName] === 'function') {
      eval('this.' + functionName + '(item)');
    }
  }

  /**
   * Sets the visited tabs in the Entity object of the service based on the tab visited
   * @param tabId - optional tabId .. if one needs to set a fixed tabid even if not visited
   */
  protected setVisitedTabs(tabId?: string): void {
    let service = this.altService != undefined ? this.altService : this.service;
    let selectedTabId: string = this.selectedStep.selectedTab == undefined ? '' : this.selectedStep.selectedTab.id;
    if (tabId != undefined) selectedTabId = tabId;
    //check if the visitedTabs already contains the current selected tab id if not then add
    //as comma separated values.

    let visitedTabs: string = '';
    if (
      service.responseIO.data.Entity.visitedTabs != undefined &&
      service.responseIO.data.Entity.visitedTabs != null
    )
      visitedTabs = service.responseIO.data.Entity.visitedTabs;
    let visitedTabsArr = visitedTabs.split(',');
    if (!visitedTabsArr.includes(selectedTabId)) {
      visitedTabs = visitedTabs + ',' + selectedTabId;
    }
    service.responseIO.data.Entity.visitedTabs = visitedTabs;
  }

  /**
   * This will set focus on the given fieldCd
   e.g: setFieldFocus(model, 'payerPartyRefGuid');
   * @param model The model in which the field is to be set e.g:this.service.responseIO.data.EmailRequest
   * @param fieldCd Model's field code in which focus is to be set e.g: 'toEmail'
   * @param id this is a optional parameter. If model or fieldCd is not available we can pass the id itself in this parameter.
   */
  public setFieldFocus(model: any, fieldCd: string, id?: string): void {
    if (this.service.settingService.getApplicationMode() === 'offline') return;
    return;
    if (id != undefined) {
      setTimeout(() => {
        $('#' + id).focus();
      }, 2);
    }
    //alert('#' + model.guid + '_' + fieldCd);
    if (model == undefined || model == null || fieldCd == undefined) return;
    setTimeout(() => {
      if (
        this.service.getFieldMetadata(model, fieldCd)['INPUTTYPECD'] == 'RADIOIMAGE' &&
        $(
          '#' +
            model.guid +
            '_' +
            fieldCd +
            '_' +
            this.service.getCodeFromLookupDesc(
              this.service.getFieldMetadata(model, fieldCd)['LOOKUPCD'],
              model[fieldCd]
            )
        ) != undefined
      ) {
        $(
          '#' +
            model.guid +
            '_' +
            fieldCd +
            '_' +
            this.service.getCodeFromLookupDesc(
              this.service.getFieldMetadata(model, fieldCd)['LOOKUPCD'],
              model[fieldCd]
            )
        ).focus();
      } else if ($('#' + model.guid + '_' + fieldCd) != undefined) {
        $('#' + model.guid + '_' + fieldCd).focus();
      }
      //document.getElementById(model.guid + '_' + fieldCd).scrollIntoView(false);
      // var scrollDiv = document.getElementById(model.guid + '_' + fieldCd).offsetTop;
      // window.scrollTo({ top: scrollDiv, behavior: 'smooth' });
    }, 2);
  }

  /**
   * This will set focus to the nearest field of given field and model
   e.g: setNextFieldFocus(model, 'payerPartyRefGuid');
   * @param model The model in which the field is to be set e.g:this.service.responseIO.data.EmailRequest
   * @param fieldCd Model's field code in which focus is to be set e.g: 'toEmail'
   * @param currentElement this is a optional parameter. If model or fieldcd is not available we can pass
   * the element itself in this parameter.
   *  eg:  $('#btn_subTab_' + this.tabList[0].id).closest('.innerHorizontalTab').find('.form-group')
   */
  /*fieldItem?: FieldItem --> If id definition changes, we will need to add field item as an optional parameter. for eg. uncomment the below for radioImage**/
  public setNextFieldFocus(model: any, fieldCd: string, currentElement?: any): void {
    setTimeout(() => {
      let fieldSelector = model != undefined ? '#' + model.guid + '_' + fieldCd : '';
      // if ( fieldItem !== undefined && fieldItem.type === "RADIOIMAGE" )
      // {
      //   fieldSelector = '#' + model[fieldCd] + '_' +  model.guid + '_' + fieldCd;
      // }
      let formGroup = $('.form-group');

      let currentIndex =
        currentElement != undefined
          ? formGroup.index(currentElement)
          : formGroup.index($(fieldSelector).closest('.form-group'));
      let targetIndex = currentElement != undefined ? currentIndex : (currentIndex + 1) % formGroup.length;

      if (targetIndex == 0) {
        this.setFieldFocus(model, fieldCd);
        return;
      }
      if (formGroup.eq(targetIndex).find('.form-control').length > 0) {
        formGroup.eq(targetIndex).find('.form-control').focus();
      } else if (formGroup.eq(targetIndex).find('.ng-select').length > 0) {
        formGroup.eq(targetIndex).find('.ng-select').addClass('ng-select-focused');
      } else {
        formGroup.eq(targetIndex).find('.form-check-input').focus();
      }
    }, 20);
  }

  /**
   * It opens the popup implemented in HTML
   * @param id expects string popupid value e.g.: 'OccupationIndustryDutySearch' + model.guid
   */
  public openModal(id: string) {
    openModal(id);
  }

  /**
   * It close the popup implemented in HTML
   * @param id expects string popupid value e.g.: 'OccupationIndustryDutySearch' + model.guid
   */
  public closeModal(id: string) {
    closeModal(id);
  }

  /**
   * This close the pop up without back-drop feature.
   * @param id  expects string popupid value e.g.: 'apiRequest'
   */
  public closePopup(id: string) {
    closePopup(id);
  }

  /**
   * This open the pop up without back-drop feature.
   * @param id  expects string popupid value e.g.: 'apiRequest'
   */
  public openPopup(id: string) {
    openPopup(id);
  }

  /**
   * This is called to display a sucess alert
   * @param message message to be displayed on the alert
   * @param callbackMethod is a optional parameter. It expects a callback method.
   * e.g.:  this.onSuccessDisplayed()
   * @param autoClose if true will automatically close the alert after a while
   */
  success(message: string, callbackMethod?, autoClose?: boolean) {
    let options = {
      okCallBack: callbackMethod,
      autoClose: autoClose,
    };
    this.service.settingService.alertService.success(message, options);
  }

  /**
   * This is called to display a warning alert
   * @param message message to be displayed on the alert
   * @param callbackMethod is a optional parameter. It expects a callback method.
   * e.g.:   () => {  after ok click logic needs to be written inside here }
   * @param autoClose  if true will automatically close the alert after a while
   */
  warn(message: string, callbackMethod?, autoClose?: boolean) {
    let options = {
      okCallBack: callbackMethod,
      autoClose: autoClose,
    };
    this.service.settingService.alertService.warn(message, options);
  }

  /**
   * This is called to display a error alert
   * @param message message to be displayed on the alert
   * @param callbackMethod is a optional parameter. It expects a callback method.
   * e.g.:   () => {  after ok click logic needs to be written inside here }
   * @param autoClose  if true will automatically close the alert after a while
   */
  error(message: string, callbackMethod?, autoClose?: boolean) {
    let options = {
      okCallBack: callbackMethod,
      autoClose: autoClose,
    };
    this.service.settingService.alertService.error(message, options);
  }

  /**
   * This is called to display an info alert
   * @param message message to be displayed on the alert
   * @param callbackMethod is a optional parameter. It expects a callback method.
   * e.g.:    () => {  after ok click logic needs to be written inside here }
   * @param autoClose  if true will automatically close the alert after a while
   */
  info(message: string, callbackMethod?, autoClose?: boolean) {
    let options = {
      okCallBack: callbackMethod,
      autoClose: autoClose,
    };
    this.service.settingService.alertService.info(message, options);
  }

  /**
   * This is called to display confirm
   * @param message  message to be displayed on the alert
   * @param okCallbackMethod is a optional parameter. It expects a callback method.
   * e.g.:  () => {  after ok click logic needs to be written inside here }
   * @param cancelCallBackMethodis a optional parameter. It expects a callback method.
   * e.g.:   () => {  return; }
   */
  confirm(message: string, okCallbackMethod?, cancelCallBackMethod?) {
    let options = {
      okCallBack: okCallbackMethod,
      cancelCallBack: cancelCallBackMethod,
      isConfirmationAlert: true,
    };
    this.service.settingService.alertService.confirm(message, options);
  }

  /**
   * This is called to display confirmation box with a warning display
   * @param message  message to be displayed on the alert
   * @param okCallbackMethod is a optional parameter. It expects a callback method.
   * e.g.:  () => {  after ok click logic needs to be written inside here }
   * @param cancelCallBackMethodis a optional parameter. It expects a callback method.
   * e.g.:   () => {  return; }
   *  @param okButLabel  label key to be used for the Ok button
   *  @param cancelButLabel  label key to be used for the Cancel button
   */
  warningConfirm(
    message: string,
    okCallbackMethod?,
    cancelCallBackMethod?,
    okButLabel?: string,
    cancelButLabel?: string
  ) {
    let options = {
      okCallBack: okCallbackMethod,
      cancelCallBack: cancelCallBackMethod,
      isConfirmationAlert: true,
      okButLabel: okButLabel,
      cancelButLabel: cancelButLabel,
    };
    this.service.settingService.alertService.warningConfirm(message, options);
  }

  /**
   * This gives the ui content converted to pdf format
   * @param callbackMethod this expects call back method object. e.g: this.getPDFContnet
   * @param styleJSON this expects JSON object for css styles. e.g: {h4:{color: #000}}
   * @param newConvertToPDFTemplate this expects additional view child template if any. e.g: pdfContentTemplate
   */
  public getPDFContent(callbackMethod, styleJSON?: any, newConvertToPDFTemplate?: ElementRef) {
    let doc = new jsPDF();
    let pdfTable =
      newConvertToPDFTemplate != undefined ? newConvertToPDFTemplate : this.convertToPDFTemplate.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    let documentDefinition = {
      content: html,
    };
    if (styleJSON != undefined) {
      documentDefinition['styles'] = styleJSON;
    }

    if (typeof this[callbackMethod] === 'function') {
      pdfMake.createPdf(documentDefinition).getBase64((obj) => {
        this.onCallBackMethodTriggered(callbackMethod, this.downloadOrOpenContent(obj, 'pdf', undefined));
      });
    } else {
      this.error('Callback method not found!');
    }
  }

  onCallBackMethodTriggered(callbackMethod, obj) {
    eval('this.' + callbackMethod + '(obj)');
  }

  /**
   * This needs to be invoked when we need to open the ui displayed in PDF format.It opens in a new tab.
   * @param styleJSON this expects JSON object for css styles. e.g: {h4:{color: #000}}
   * @param newConvertToPDFTemplate this expects additional view child template if any. e.g: pdfContentTemplate
   */
  openPDF(styleJSON?: any, newConvertToPDFTemplate?: ElementRef) {
    let doc = new jsPDF();
    let pdfTable =
      newConvertToPDFTemplate != undefined ? newConvertToPDFTemplate : this.convertToPDFTemplate.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    let documentDefinition = {
      content: html,
    };
    if (styleJSON != undefined) {
      documentDefinition['styles'] = styleJSON;
    }
    pdfMake.createPdf(documentDefinition).open();
  }

  /**
   * This needs to be invoked when we need to download the ui displayed  in PDF format.
   *  @param styleJSON this expects JSON object for css styles. e.g: {h4:{color: #000}}
   * @param newConvertToPDFTemplate this expects additional view child template if any. e.g: pdfContentTemplate
   */
  downloadPDF(styleJSON?: any, newConvertToPDFTemplate?: ElementRef) {
    let doc = new jsPDF();
    let pdfTable =
      newConvertToPDFTemplate != undefined ? newConvertToPDFTemplate : this.convertToPDFTemplate.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    let documentDefinition = {
      content: html,
    };
    if (styleJSON != undefined) {
      documentDefinition['styles'] = styleJSON;
    }
    pdfMake.createPdf(documentDefinition).download();
  }

  /**
   * This needs to be invoked when we need to print the ui displayed.
   * @param styleJSON this expects JSON object for css styles. e.g: {h4:{color: #000}}
   * @param newConvertToPDFTemplate this expects additional view child template if any. e.g: pdfContentTemplate
   */
  printPDF(styleJSON?: any, newConvertToPDFTemplate?: ElementRef) {
    let doc = new jsPDF();
    let pdfTable =
      newConvertToPDFTemplate != undefined ? newConvertToPDFTemplate : this.convertToPDFTemplate.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    let documentDefinition = {
      content: html,
    };
    if (styleJSON != undefined) {
      documentDefinition['styles'] = styleJSON;
    }
    pdfMake.createPdf(documentDefinition).print();
  }

  /**
   * Function to check for null values and return an empty string
   * @param objValue - Value to check for null and return
   * @returns the value if not null else returns empty string
   */
  getStringValue(objValue: any): string {
    let val = '';
    if (objValue != undefined && objValue != null) val = objValue;
    return val;
  }

  /**
   * This will force the user out of the application.
   * Will sign out the user if already signed in
   * and will redirect the user to an invalid page url if required
   * @param isInvalidLink - if true will redirect user to invalid page url else to the login page
   */
  public exitApplication(isInvalidLink?: boolean) {
    //this does not work since only windows opened by system can be closed
    //self.close();
    if (this.service.settingService.isUserLoggedIN()) this.service.settingService.logoutUser();
    if (isInvalidLink)
      setTimeout(() => {
        this.service.settingService.router.navigate(['/page-not-found']);
      }, 1000);
  }

  /**
   *
   * @param fileContents
   * @param applicationType
   * @param fileName
   * @param openFile
   * @param winOption
   */
  public downloadOrOpenContent(
    fileContents,
    applicationType: string,
    fileName: string,
    openFile?: boolean,
    winOption?: { width: number; height: number; windowTarget?: string }
  ) {
    let fileDataType;
    if (openFile != undefined && openFile) {
      fileDataType = this.getFileDataType(fileName);
      fileContents = fileContents.replace('data:' + fileDataType + ';base64,', '');
    }
    const byteArray = new Uint8Array(
      atob(fileContents)
        .split('')
        .map((char) => char.charCodeAt(0))
    );
    let blob = new Blob([byteArray], {
      type: applicationType == 'pdf' ? 'application/' + applicationType : fileDataType,
    });
    let url = window.URL.createObjectURL(blob);
    if (openFile != undefined && openFile) {
      if (winOption == undefined) winOption = { width: 400, height: 400 };
      let winHeight = $(window).height() - winOption.width != undefined ? winOption.width : 200;
      let winWidth = $(window).width() - winOption.height != undefined ? winOption.height : 600;
      let windowOptions =
        'toolbar=0,location=0,directories=0,status=1,menubar=0,scrollbars=1,resizable=1,width=' +
        winWidth +
        ',height=' +
        winHeight +
        ',left=100,top=100';
      //window.open( url, 'win', windowOptions );
      var newWindow = window.open(
        url,
        winOption != undefined && winOption.windowTarget != undefined ? winOption.windowTarget : 'win',
        windowOptions
      );
      if (newWindow == null) this.info('Please check popup.It is blocked.', undefined, true);
      //set the title same as file name.
      setTimeout(function () {
        newWindow.document.title = fileName;
      }, 1000);
    } else {
      let linkElement = document.createElement('a');
      linkElement.setAttribute('href', url);
      linkElement.setAttribute(
        'download',
        fileName.substring(0, fileName.lastIndexOf('.')) +
          '.' +
          fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length)
      );
      let clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: false,
      });
      linkElement.dispatchEvent(clickEvent);
    }
    console.log('File generated successful.');
  }

  /**
   * This returns media files data type e.g. png
   * @param fileName
   * @returns
   */
  getFileDataType(fileName: string) {
    if (fileName == null) return undefined;
    let ext = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
    let fileDataType = this.service.getValueFromLookup('FILEDATATYPE', ext);
    return fileDataType;
  }

  /**
   * This check if the value is available in the given list
   * @param list expects the list of string array
   * @param value expects a string to match the value given in the list
   * @returns true if value is present and false if the value is not available
   */
  isValueAvailableInList(list: string[], value: string): boolean {
    let result = list.findIndex((item) => value.toLowerCase() === item.toLowerCase());
    if (result !== -1) {
      return true;
    }
    return false;
  }

  /**
   * This will compress the image given
   * @param image expects the image which will be compressed
   * @param fileName expects string value for image name
   * @param callbackMethod expects string name of the call back method which will have parameter of commpressed image and filename
   */
  async compressImage(image, fileName: string, callbackMethod: string) {
    let compressedFile = await this.service.compressImage(image);
    var reader = new FileReader();
    if (compressedFile != undefined) reader.readAsDataURL(compressedFile);
    else reader.readAsDataURL(image);
    reader.onload = (event: any) => {
      var fileContent = reader.result;
      this.onCallbackFromImage(callbackMethod, fileContent, fileName);
    };
  }
  /**
   * This callback method which is passed @compressAndAddImage()
   * @param callbackMethod expects the strig name of the callback method
   * @param image this will contain compressed image
   * @param filename expects string name of the image file
   */
  onCallbackFromImage(callbackMethod, image: any, filename: string) {
    if (typeof this[callbackMethod] === 'function') eval('this.' + callbackMethod + '(image, filename)');
  }

  /**
   * This callbacks the method after added is clicked.
   * @param modelName expects string value.
   */
  onGridRowAdded(item: any) {
    let modelName = undefined;
    if (item != undefined && item.objName != undefined) {
      modelName = item.objName;
    } else if (item != undefined) {
      modelName = item;
    }
    let functionName = 'on_' + modelName + '_RowAdded';
    if (typeof this[functionName] === 'function') {
      eval('this.' + functionName + '(item)');
    }
  }

  /**
   * This function is used to call popup.
   * @param url.
   * @param height specify height of popup.
   * @param width specify width of popup
   */

  protected showWindow(url: any, height: number, width: number) {
    var winHeight = $(window).height() - height;
    var winWidth = $(window).width() - width;
    var windowOptions =
      'toolbar=0,location=0,directories=0,status=1,menubar=0,scrollbars=1,resizable=1,width=' +
      winWidth +
      ',height=' +
      winHeight +
      ',left=100,top=100';
    window.open(url, 'win', windowOptions);
  }

  /**
   * This will freeze the entire window if parameter passed is true else will unfreeze the window. No click event would be allowed while window is frozen
   * @param freeze - true/false to freeae/unfreeze the pane.
   */
  public freezePane(freeze: boolean) {
    this.service.settingService.setFreezePane(freeze);
  }

  /**
   *
   * @ignore
   */
  public onInputSearchClick(item: FieldItem) {
    let functionName = item.fieldCd + '_searchClick';
    if (typeof this[functionName] === 'function') {
      eval('this.' + functionName + '(item)');
    }
  }

  /**
   * It will scroll to start of the page of DOM.
   */
  public scrollToTop() {
    scrollToTop();
  }

  /**
   * It will remove the focused Element of DOM.
   */
  public removeActiveElmFocus() {
    removeActiveElmFocus();
  }

  /**
   * This will set the mapped components to componentListToDisplay
   * from module .
   * @param value expects list of component which is loaded in
   *  individual module and can be set at step
   * eg: this.setComponentListToDisplay(QuotationModule.componentMap);
   */
  protected setComponentListToDisplay(value: any) {
    this.service.componentListToDisplay = value;
  }

  /**
   * It will fetch the Insurance Type code
   * @returns Insurance Typecode ex: LIFE/HEALTH/AUTO etc
   */
  public getInsuranceType(): string {
    return this.service.getSessionStorageValue('insuranceTypeCd') != undefined
      ? this.service.getSessionStorageValue('insuranceTypeCd')
      : 'LIFE';
  }

  /**
   * This is invoked when XML HTML element is clicked
   * @param elementID expects id of element which is clicked in XML
   */
  onHTMLElementClick(elementID: string) {
    let functionName;
    functionName = elementID + '_click';
    if (typeof this[functionName] === 'function') {
      // this.service.isfieldItemCalled = true;
      eval('this.' + functionName + '()');
      setTimeout(() => {
        this.service.setFieldFocusForDisabledScroll();
      }, 150);
    }
  }

  /**
   * This is used instead of settimeout. add await while calling this method
   * @param callback method which needs to be excuted after timeout
   * @param ms time in millisecond
   * @returns promise call. e.g: this.setTimeoutPromise(()=>{console.log('')},5)
   */
  setTimeoutPromise(callback: () => void, ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms)).then(callback);
  }

  /**
   * This is called to get the element based on id | class
   * @param id expects id o get the element. This is a optional parameter if classname is given.
   * @param className expects class name to get the element. This is a optional parameter given ID is
   *  passed as parameter
   * @returns elemeent
   */
  getElement(id: string, className: string) {
    if (id != undefined || className != undefined) {
      let ele;
      if (id != undefined) ele = document.getElementById(id);
      if (className != undefined) ele = $(className);
      if (ele == undefined || ele.length == 0) {
        this.getElement(id, className);
      } else {
        // await this.setTimeoutPromise(() => , 10);
        return ele;
      }
    } else {
      console.warn('Both id and classname is undefined ID Value: ' + id + ', className: ' + className);
    }
  }

  /**
   * This will set focus on the given element using the id
   e.g: setFieldFocus('disagreeClicked');
   * @param id this is a parameter.
   */
  public setFocus(id: string): void {
    if (id != undefined && id != null) setFocus(id);
  }

  refreshStepList() {
    this.notifyReloadStep.emit();
  }

  /**
   * It will evaluate the function created on key down
   * i.e age_keyDown()
   * @param item this is required to fetch the fielCd
   */
  public onKeyDown(item: FieldItem) {
    let functionName = item.fieldCd + '_keyDown';
    if (typeof this[functionName] === 'function') {
      eval('this.' + functionName + '(item)');
    }
  }

  public selectTab(tabId: String) {
    if (tabId != undefined) {
      let tabItem: TabItem;
      let tabItemList: TabItem[] = this.selectedStep?.tabList ?? [];
      for (let item of tabItemList) {
        if (item.id == tabId) {
          tabItem = item;
          break;
        }
      }
      if (tabItem != undefined) activeStepComponent.onTabChange(tabItem);
    }
  }
}
