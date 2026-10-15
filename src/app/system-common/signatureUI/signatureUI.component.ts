import { BaseComponent } from 'src/app/system-common/base/base.component';
import { SettingService } from 'src/app/system-common/services/setting.service';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  ViewChild,
  SimpleChanges,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SignaturePadComponent } from '@almothafar/angular-signature-pad';
import { ResponseIO } from 'src/app/models/responseIO';
import { AimlService } from 'src/app/business-common/service/aiml.service';
import { FieldItem } from 'src/app/models/common/field-item';
import { SystemCommonService } from '../services/system-common.service';

@Component({
  selector: 'sym-signatureUI',
  templateUrl: './signatureUI.component.html',
  styleUrls: ['./signatureUI.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SignatureUIComponent extends BaseComponent<SystemCommonService> implements OnChanges, OnInit {
  /**
   * It expects the model from which the signature are to be renderd.
   */
  @Input() model: any;

  /**
   * It expects that signature button trigger or not.It used in SI old pdf generation ie section details.
   */
  @Input() triggerBtnClick: boolean;
  /**
   * It expects that responseIO from which signature related fields display.
   */
  @Input() responseIO: ResponseIO;
  /**
   * It expects that signature button required to display or not.This is required in si old pdf generation ie section details.
   */
  @Input() isSignatureButtonReq: boolean;
  /**
   * It expects that signature image is required to display outside poup or not.This is required when single signature component used.
   */
  @Input() displaySignatureImage: boolean;
  /**
   * It expects that signature display in popup or not.This is required in non face to face component.
   */
  @Input() isPopView: boolean;

  @Input() canvasWidth: number;
  @Input() canvasHeight: number;

  /**
   * It expects a boolean value to display the upload signature option or not. Default value is set to true
   */
  @Input() showUploadSignatureOption: boolean;

  /**
   * It expects a boolean value to check if geo location needs to be checked.
   * By default value is false.
   */
  @Input() locationEnabled: boolean;

  /**
   * It expects a string value to display declaration text on signature pad.
   */
  @Input() signatureDeclarationText: string;

  @ViewChild('signature')
  public signaturePad: SignaturePadComponent;
  public signatureCaptureOptionType: string;
  public max_FileSize: number;
  public allowed_FileTypes: string[];
  public signatureImgSrc: any;
  public originalSignatureObj: any;
  public originalSignatureSrc: any;
  public openSignaturePopup: boolean;
  public disableSignature: boolean;

  public isLocationEnabled: boolean;

  /**
   * It return signature object which is modify.
   */
  @Output() notifySignatureDone = new EventEmitter();

  /**
   * Will emit true if the quoteIllustration(Preview) is successfully Loaded.
   */
  @Output() isSignatureCleared = new EventEmitter<boolean>();

  public signaturePadOptions: any = {};
  constructor(
    systemCommonService: SystemCommonService,
    public settingService: SettingService,
    public aimlService: AimlService
  ) {
    super(systemCommonService);
    this.isSignatureButtonReq = false;
    this.openSignaturePopup = false;
    this.displaySignatureImage = false;
    this.isPopView = true;
    this.allowed_FileTypes =
      this.service.getApplicationPropertyValue('IMAGE_EXTENSIONS') != undefined &&
      this.service.getApplicationPropertyValue('IMAGE_EXTENSIONS') != ' '
        ? this.service.getApplicationPropertyValue('IMAGE_EXTENSIONS').split(',')
        : undefined;
    this.max_FileSize =
      this.service.getApplicationPropertyValue('SIGN_IMAGE_SIZE_LIMIT') != undefined &&
      this.service.getApplicationPropertyValue('SIGN_IMAGE_SIZE_LIMIT') != ''
        ? parseInt(this.service.getApplicationPropertyValue('SIGN_IMAGE_SIZE_LIMIT'))
        : undefined;
    this.showUploadSignatureOption = true;

    this.locationEnabled = this.service.getApplicationPropertyValue('locationEnabled') === 'YES' ? true : false;
  }

  ngOnInit() {
    /**Initialize signature pad
     */
    //to get place of signature lookup value need service response IO
    this.service.responseIO = this.responseIO;

    this.signaturePadOptions = {
      minWidth: 5,
      canvasWidth: this.canvasWidth != undefined ? this.canvasWidth : 625,
      canvasHeight: this.canvasHeight != undefined ? this.canvasHeight : 250,
      border: '50px solid black',
    };
    if (this.displaySignatureImage) {
      this.initSignature(false);
    }
    this.validateLocation();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['model'] && changes['model'].currentValue) {
      this.initSignature(true);
    }
    if (
      changes['triggerBtnClick'] &&
      changes['triggerBtnClick'].currentValue &&
      changes['triggerBtnClick'].currentValue == true
    ) {
      //open signature popup
      this.initSignature(true);
      this.openSignaturePopupFunc();
    }

    // after save when signature not in popup then need to update originalSignatureObj
    if (changes['responseUpdated'] && changes['responseUpdated'].currentValue) {
      if (this.responseUpdated && !this.isPopView) {
        this.initSignature(true);
      }
    }

    if (changes['isPopView'] && changes['isPopView'].currentValue) {
      if (!this.isPopView) {
        this.validateLocation();
      }
    }
  }

  private initSignature(isModelCloneReq: boolean) {
    // clone input original signature object so that opertion perform on that object itself.
    //Display existing signature image.If existing signature is not there then select signature option as Signature pad by default.
    if (isModelCloneReq) this.originalSignatureObj = this.service.clone(this.model);
    else this.originalSignatureObj = this.model;
    this.setSignatureImgSrc();
    //To disable the Signature Pad when the Signature is disabled via Metadata, if not then the existing logic
    //of setting the Type to SIGNATUREPAD or undefined will be used
    this.signatureCaptureOptionType = this.disableSignature
      ? undefined
      : this.originalSignatureObj?.signature != undefined
      ? undefined
      : 'SIGNATUREPAD';

    this.setTimeoutPromise(() => {
      //This will disable the Signature Type Selection (Signature Pad and Upload Signature), Signature Pad and hide the clear button
      //When set to true (The value is being set via Metadata)
      if (this.originalSignatureObj != undefined)
        this.disableSignature =
          this.service.getFieldMetadataPropertyValue(this.originalSignatureObj, 'signature', 'ENABLED') == 'NO';
      if (!this.disableSignature)
        this.disableSignature = this.signatureImgSrc != undefined || !this.signaturePad?.isEmpty() ? false : true;
    }, 10);
  }

  onCaptureSignClick(event) {
    //on click of capture signature button ,open signature popup
    this.initSignature(true);
    this.openSignaturePopupFunc();
  }

  private openSignaturePopupFunc() {
    //open signature popup.If existing signature is not there then select signature option as Signature pad by default.
    this.openSignaturePopup = true;
    this.openModal('signaturePopup_' + this.originalSignatureObj.guid);

    this.validateLocation();
  }

  onSignatureOptionClick(event) {
    //console.log(event.target.value);
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }

  drawComplete() {
    if (!this.isPopView) this.onSaveClick();
    this.disableSignature = this.signatureImgSrc != undefined || !this.signaturePad.isEmpty() ? false : true;
    this.validateLocation();
  }

  onUploadInputFileClick(event) {
    event.target.value = '';
    this.signatureCaptureOptionType = null;
    this.signatureImgSrc = null;
    this.validateLocation();
  }

  onUploadCancel(event) {
    event.target.value = '';
    this.signatureCaptureOptionType = null;
    this.signatureImgSrc = null;
  }

  /**
   * It will upload image of signature.
   */
  async onUploadFileChange(event: File[]) {
    this.validateLocation();
    //check file type and max file size validation before uploading image
    this.signatureImgSrc = undefined;
    if (event[0]) {
      let fileName = event[0].name;
      let ext = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
      if (this.allowed_FileTypes != undefined) {
        if (!this.isValueAvailableInList(this.allowed_FileTypes, ext)) {
          this.signatureCaptureOptionType = null;
          this.signatureImgSrc = null;
          this.error(
            this.service.getMultilingualMessage('fileTypeAllowed', [this.allowed_FileTypes.toString()]),
            undefined,
            true
          );
          return false;
        }
      }
      if (this.max_FileSize != undefined)
        if (this.max_FileSize != null && Math.round(event[0].size / 1024) > this.max_FileSize) {
          this.signatureCaptureOptionType = null;
          this.signatureImgSrc = null;
          this.error(
            this.service.getMultilingualMessage('maxFileSize', [this.max_FileSize.toString()]),
            undefined,
            true
          );
          return false;
        } else {
          this.signatureCaptureOptionType = 'SIGNATUREUPLOAD';
          var reader = new FileReader();
          await reader.readAsDataURL(event[0]);
          reader.onload = (event: any) => {
            this.signatureImgSrc = event.target.result;
            this.drawComplete();
          };
        }
    }
  }

  onCancelClick() {
    //Revert all these changes done in the popup and
    //Emit the original signature object itself to the calling program and close the popup
    this.closePopup('signaturePopup_' + this.originalSignatureObj.guid);
    this.notifySignatureDone.emit(this.model);
    this.signatureImgSrc = this.originalSignatureSrc;
  }

  onClearClick() {
    //On confirm on continue message clear the signature from popup. Popup will not be closed
    this.confirm(this.service.getMultilingualLabel('clearSignatureMessage'), () => {
      if (this.signaturePad != undefined) this.signaturePad.clear();
      this.signatureCaptureOptionType = 'SIGNATUREPAD';
      this.signatureImgSrc = undefined;
      this.service.setModelFieldValue(this.originalSignatureObj, 'signatureDt', undefined);
      //signature not get clear from signature object when signature not in popup
      if (!this.isPopView) {
        this.originalSignatureObj.signature = null;
        this.saveSignature();
      }
      this.isSignatureCleared.emit(true);
    });
  }

  onSaveClick() {
    //If no signature is existing in Pad or from the upload File picker then
    //Give warning message that there is no signature. Are you sure you want to continue ?
    //If Continue then close the signature popup and Emit signature object to calling program
    //set empty signature on output html and rest all signature compoent elemets.
    if (
      (this.signatureCaptureOptionType == 'SIGNATUREPAD' && this.signaturePad.isEmpty()) ||
      ((this.signatureCaptureOptionType == 'SIGNATUREUPLOAD' || this.signatureCaptureOptionType == undefined) &&
        this.signatureImgSrc == undefined)
    ) {
      this.confirm(this.service.getMultilingualLabel('noSignatureMessage'), () => {
        this.originalSignatureObj.signature = null;
        this.saveSignature();
      });
    } else if (
      this.originalSignatureObj != undefined &&
      ((this.signatureCaptureOptionType == 'SIGNATUREPAD' && !this.signaturePad.isEmpty()) ||
        ((this.signatureCaptureOptionType == 'SIGNATUREUPLOAD' || this.signatureCaptureOptionType == undefined) &&
          this.signatureImgSrc != undefined))
    ) {
      if (this.signatureCaptureOptionType == 'SIGNATUREPAD')
        this.originalSignatureObj.signature = this.signaturePad.toDataURL();
      else this.originalSignatureObj.signature = this.signatureImgSrc;

      //aiml function start here
      if (this.service.getURLValue('AIML') != undefined) {
        this.verifySignature();
      } else {
        this.saveSignature();
      }
    }
  }

  protected verifySignature() {
    let signature = this.originalSignatureObj.signature != undefined ? this.originalSignatureObj.signature : null;
    if (signature != null && signature.indexOf('base64,') > -1)
      signature = signature.substring(signature.indexOf('base64,') + 7, signature.length);

    this.aimlService.detectSignature(null, signature).subscribe(
      (body) => {
        // console.log(body);
        if (body['Percentage_validity'] > 5) {
          this.saveSignature();
        } else {
          this.error('Invalid signature!');
          if (this.signaturePad != undefined) this.signaturePad.clear();
        }
      },
      (error) => {
        console.log('Signature detection failed.');
        this.confirm(
          'Error in signature verification:' + error.message + ' .Do you want to continue without aiml ?',
          () => {
            this.saveSignature();
          },
          () => {
            return false;
          }
        );
        // alert('Error:' + error);
        console.log('Error:', error);
      }
    );
  }

  protected saveSignature() {
    //If signature added then close the signature popup and Emit signature object to calling program
    //set updated signature on output html and rest all signature compoent elemets.
    this.service.setUpdated(this.originalSignatureObj);
    let systemDate = SettingService.getApplicationPropertiesValue('SYSTEMDATE');

    if (systemDate) {
      let timestamp = new Date(systemDate).getTime();
      this.originalSignatureObj.signatureDt = timestamp;
    }
    if (this.isPopView) this.closePopup('signaturePopup_' + this.originalSignatureObj.guid);
    Object.assign(this.model, this.originalSignatureObj);
    console.log('model================', this.model);
    if (this.originalSignatureObj?.signature) this.notifySignatureDone.emit(this.model);
    this.setSigntureDataOnOutputHtml();
    if (this.isPopView) this.resetSignatureCompElement();
  }

  /**
   * set signature image sorce ,so that after signature upload it show on popup
   */
  private setSignatureImgSrc(): string {
    if (this.originalSignatureObj != undefined) {
      if (
        this.originalSignatureObj.signature != undefined &&
        this.originalSignatureObj.signature.startsWith('ZLIBCMP')
      ) {
        var signatureImageObject = $('#signature' + this.originalSignatureObj.guid + '_img');
        if (signatureImageObject[0] == undefined)
          signatureImageObject = $('#signature' + this.originalSignatureObj.signatureTypeCd + '_img');
        if (signatureImageObject != null) this.signatureImgSrc = signatureImageObject.attr('src');
      } else {
        this.signatureImgSrc = this.originalSignatureObj.signature;
        this.originalSignatureSrc = this.signatureImgSrc;
      }
      return this.signatureImgSrc;
    }
  }

  //reset all signature compent elements.
  private resetSignatureCompElement() {
    //this.model = undefined;
    //this.originalSignatureObj = undefined;
    //this.triggerBtnClick = undefined;
    //this.responseIO = undefined;
    this.signatureCaptureOptionType = undefined;
    //this.openSignaturePopup = false;
    //this.signatureImgSrc = undefined;
    if (this.signaturePad != undefined) this.signaturePad.clear();
  }

  //this function used to update and modified signature display back to html output.also modifed signature date also.
  private setSigntureDataOnOutputHtml() {
    var signatureImageObject = $('#signature' + this.originalSignatureObj.guid + '_img');
    if (signatureImageObject[0] == undefined)
      signatureImageObject = $('#signature' + this.originalSignatureObj.signatureTypeCd + '_img');
    let signature = this.originalSignatureObj.signature != null ? this.originalSignatureObj.signature : null;
    if (signatureImageObject[0] != undefined) {
      signatureImageObject.attr('src', signature).show();
      if (signature != null) signatureImageObject.css('opacity', '1');
      else signatureImageObject.css('opacity', '0');
    }
    var signatureDtObject = $('#signature' + this.originalSignatureObj.guid + '_dt');
    if (signatureDtObject[0] == undefined)
      signatureDtObject = $('#signature' + this.originalSignatureObj.signatureTypeCd + '_dt');
    if (signatureDtObject[0] != undefined) {
      console.log('427 signatureDtObject', signatureDtObject);
      let systemDate = SettingService.getApplicationPropertiesValue('SYSTEMDATE');
      if (systemDate != undefined && signatureDtObject != undefined) signatureDtObject.text(systemDate);
    }
    //placeOfSignatureObject also copy into html
    var placeOfSignatureObject = $('#signature' + this.originalSignatureObj.guid + '_placeOfSignature');
    if (placeOfSignatureObject[0] != undefined && this.originalSignatureObj.placeOfSignature != undefined) {
      console.log('4333 if conditon ...... ');
      placeOfSignatureObject.text(
        this.service.getModelFieldDataDesc(this.originalSignatureObj, 'placeOfSignature')
      );
    }
  }

  protected placeOfSignature_change(item: FieldItem) {
    //if not poup then need to save this place of signature by emiiting signature model.
    if (!this.isPopView) this.saveSignature();
  }

  validateLocation() {
    if (this.locationEnabled) {
      if (!navigator.geolocation) {
        console.log('Location is not supported'); // key needed
      }
      this.service
        .getPosition()
        .then((pos) => {
          //  console.log(`Positon: Lang: ${pos.lng} Lat ${pos.lat}`);
          this.isLocationEnabled = true;
          let val = this.service.validateLocationRange(pos);
          if (!val) {
            this.onCancelClick();
          }
        })
        .catch((error) => {
          this.isLocationEnabled = false;
          this.openSignaturePopup = false;
          this.setTimeoutPromise(() => {
            this.onCancelClick();
          }, 10);
        });
    }
  }
}
