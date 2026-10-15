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
import { BaseService } from '../services/base.service';
//import { SignaturePad } from 'angular2-signaturepad';
import { ResponseIO } from 'src/app/models/responseIO';
import { SignaturePadComponent } from '@almothafar/angular-signature-pad';
import { AimlService } from 'src/app/business-common/service/aiml.service';

@Component({
  selector: 'sym-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SignatureComponent extends BaseComponent<BaseService> implements OnChanges, OnInit {
  @Input() responseIO: ResponseIO;
  @Input() serviceSignature: any;
  @Input() isPopView: boolean;
  @Input() triggerBtnID: string;
  @Input() canvasWidth: number;
  @Input() canvasHeight: number;
  @Input() isSignatureButtonReq: boolean;
  @Input() triggerBtnClick: boolean;
  @Input() model: any;
  @Input() displaySignatureImage: boolean;
  @Input() showUploadSignatureOption: boolean;
  @Input() hideHeaderText: boolean;

  @ViewChild('signature')
  public signaturePad: SignaturePadComponent;
  @Output() isSignatureDone = new EventEmitter();

  displaySignatureDiv: boolean;

  public signaturePadOptions: Object = {};
  hideSignatureBlock: boolean;
  isSignatureDrawn: boolean;
  public previousSignature: any;
  iscloseBtnClicked: boolean;
  public max_FileSize: number;
  public allowed_FileTypes: string[];
  public isSignatureUploadClicked: boolean;
  public signatureUploadPic;
  public signatureNotPresent: boolean;
  // isSignatureClear;
  constructor(
    public baseService: BaseService,
    public settingService: SettingService,
    public aimlService: AimlService
  ) {
    super(baseService);
    this.isPopView = true;
    this.isSignatureButtonReq = true;
    this.displaySignatureDiv = false;
    (this.canvasWidth = 975), (this.canvasHeight = 320);
    this.isSignatureDrawn = false;
    this.iscloseBtnClicked = false;
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
    this.hideSignatureBlock = true;
  }

  ngOnInit() {
    this.signaturePadOptions = {
      minWidth: 5,
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      border: '50px solid black',
    };
    if (this.model != undefined && this.serviceSignature == undefined) {
      this.serviceSignature = this.model;
      //need to find object from array and set it back in array since it doesn't set
      let currServiceSignature;
      if (this.service.responseIO != undefined && this.service.responseIO.data[this.model.objName] != undefined) {
        currServiceSignature = this.service.responseIO.data[this.model.objName].find(
          (existServiceSignature: any) => existServiceSignature.guid === this.model.guid
        );
      }
      if (currServiceSignature != undefined) this.serviceSignature = currServiceSignature;
    }
  }

  ngAfterViewInit() {
    if (this.signaturePad != undefined) {
      this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
      this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    }

    if (
      this.signaturePad != undefined &&
      this.serviceSignature != undefined &&
      this.serviceSignature.signature != undefined &&
      !this.serviceSignature.signature.startsWith('ZLIBCMP')
    )
      this.signaturePad?.fromDataURL(this.serviceSignature.signature);

    setTimeout(() => {
      var signatureImageObject = $('#signature' + this.serviceSignature.guid + '_img');
      this.getPreviousSignature();
      if (signatureImageObject[0] != undefined)
        // signatureImageObject = $('#signature' + this.serviceSignature.signatureTypeCd + '_img');
        //signatureImageObject.attr('src', this.previousSignature).show();
        // if (this.signaturePad != undefined) this.signaturePad.fromDataURL(this.serviceSignature.signature);
        signatureImageObject.attr('src', this.previousSignature).show();
      if (
        this.serviceSignature != undefined &&
        this.serviceSignature.signature != undefined &&
        !this.serviceSignature.signature.startsWith('ZLIBCMP')
      )
        this.signaturePad?.fromDataURL(this.serviceSignature.signature);
    }, 10);
    // $('#signatureButton_' + this.serviceSignature.guid).trigger('click');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['serviceSignature'] && changes['serviceSignature'].currentValue) {
      //if (this.signaturePad != undefined) this.signaturePad.clear();
      this.getPreviousSignature();
      this.hideSignatureBlock = true;
      if (
        this.responseIO != undefined &&
        this.serviceSignature != undefined &&
        this.responseIO.metadata[this.serviceSignature.guid] != undefined &&
        this.responseIO.metadata[this.serviceSignature.guid]['signature'] != undefined &&
        this.responseIO.metadata[this.serviceSignature.guid]['signature']['ENABLED'] === 'NO' &&
        this.signaturePad != undefined &&
        this.isPopView
      ) {
        this.signaturePad.off();
      }
      if (!this.isPopView) {
        setTimeout(() => {
          var signatureImageObject = $('#signature' + this.serviceSignature.guid + '_img');
          if (signatureImageObject[0] != undefined)
            // signatureImageObject = $('#signature' + this.serviceSignature.signatureTypeCd + '_img');
            signatureImageObject.attr('src', this.serviceSignature.signature).show();

          this.signaturePad?.fromDataURL(this.serviceSignature.signature);
        }, 10);
      }
    }

    if (changes['triggerBtnID'] && this.triggerBtnID != undefined && this.triggerBtnID != null) {
      // console.log(this.triggerBtnID);
      this.getPreviousSignature();
      this.hideSignatureBlock = true;
      setTimeout(() => {
        $('#signatureButton_' + this.triggerBtnID).trigger('click');
      }, 10);
    }

    if (changes['responseIO'] && changes['responseIO'].currentValue) {
      this.getPreviousSignature();

      // console.log(this.responseIO);
    }
    if (changes['triggerBtnClick'] && changes['triggerBtnClick'].currentValue) {
      this.getPreviousSignature();
      if (this.isSignatureUploadClicked || this.isSignatureUploadClicked == undefined)
        this.isSignatureUploadClicked = false;
      this.hideSignatureBlock = true;
      // console.log(this.responseIO);
      if (this.triggerBtnClick) {
        setTimeout(() => {
          if (this.signaturePad != undefined) this.signaturePad.clear();
          if (
            this.signaturePad != undefined &&
            this.serviceSignature != undefined &&
            this.serviceSignature.signature != undefined &&
            !this.serviceSignature.signature.startsWith('ZLIBCMP')
          ) {
            this.signaturePad?.fromDataURL(this.serviceSignature.signature);
          }
          $('#signatureButton_' + this.serviceSignature.guid).trigger('click');
        }, 10);
      }
    }
  }

  onEditClick() {
    this.displaySignatureDiv = true;
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    if (this.serviceSignature != undefined) {
      if (this.serviceSignature.status && this.serviceSignature.status === 'N') {
        this.serviceSignature.status = 'I';
      } else if (this.serviceSignature.status && this.serviceSignature.status === 'X') {
        this.serviceSignature.status = 'U';
      }
      this.serviceSignature.signature = this.signaturePad.toDataURL();
      //xml configuration signtaure lost so added back to service responseio
      if (this.model != undefined) {
        this.model = this.serviceSignature;
        if (
          this.service.responseIO != undefined &&
          this.service.responseIO.data[this.serviceSignature.objName] != undefined
        ) {
          let index = 0;
          this.responseIO.data[this.serviceSignature.objName].forEach((existServiceSignature) => {
            if (existServiceSignature.guid == this.serviceSignature.guid)
              this.service.responseIO.data[this.serviceSignature.objName][index] = this.serviceSignature;
            index++;
          });
        }
      }
    }
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    //console.log('begin drawing');
    this.isSignatureDrawn = true;
    console.log(this.isSignatureDrawn);
  }
  clear(): void {
    this.iscloseBtnClicked = false;
    if (this.isSignatureUploadClicked) {
      this.signatureUploadPic = null;
      this.isSignatureUploadClicked = false;
    } else this.signaturePad.clear();
    this.isSignatureDrawn = false;
    if (this.serviceSignature != undefined) {
      this.serviceSignature.signature = null;
      this.service.setUpdated(this.serviceSignature);
    }
    setTimeout(() => {
      let id = this.triggerBtnID != undefined ? this.triggerBtnID : this.serviceSignature.guid;
      var signatureImageObject = $('#signature' + id + '_img');
      if (this.previousSignature != undefined && !this.iscloseBtnClicked) {
        signatureImageObject.attr('src', this.previousSignature).show();
      }

      /**
       * commented because when we click on clear button it was clearing the signature and showing      * blank signature on screen.
       */
      // if (signatureImageObject[0] == undefined) {
      //   signatureImageObject = $('#signature' + this.serviceSignature.signatureTypeCd + '_img');
      // }
      // let emptySignatureUrl =
      //   this.signaturePad.toDataURL() != undefined && !this.isSignatureDrawn
      //     ? this.signaturePad.toDataURL()
      //     : null;
      // signatureImageObject.attr('src', emptySignatureUrl).show();
    }, 10);
  }

  onCaptureSignClick(event) {
    if (
      this.responseIO != undefined &&
      this.serviceSignature.guid != undefined &&
      this.responseIO.metadata[this.serviceSignature.guid] != undefined &&
      this.responseIO.metadata[this.serviceSignature.guid]['signature']['ENABLED'] === 'NO'
    ) {
      // console.log(this.responseIO.metadata[this.serviceSignature.guid]['signature']['ENABLED']);
      // console.log('test');
      return;
    }
    $('#signatureButton_' + this.serviceSignature.guid).trigger('click');
    this.openModal('signaturePad_' + this.serviceSignature.guid);
    this.hideSignatureBlock = true;
    this.signatureNotPresent = this.signaturePad?.isEmpty() && this.signatureUploadPic == undefined ? true : false;
  }
  onClickOKbutton() {
    this.iscloseBtnClicked = true;
    if (this.serviceSignature != undefined) {
      this.serviceSignature.signature = this.isSignatureUploadClicked
        ? this.signatureUploadPic
        : this.signaturePad.toDataURL();
      // console.log(this.serviceSignature.signature);
      //signature image object,get based upon signature obj guid or signature type.
      let id = this.triggerBtnID != undefined ? this.triggerBtnID : this.serviceSignature.guid;
      if (!this.isPopView && this.displaySignatureDiv) {
        this.displaySignatureDiv = !this.displaySignatureDiv;
      }
      let isAIMLAPIAvailable = this.service.getURLValue('AIML') != undefined ? true : false;
      if (isAIMLAPIAvailable) {
        this.aimlService
          .detectSignature(
            null,
            this.serviceSignature.signature != undefined
              ? this.serviceSignature.signature.substring(
                  this.serviceSignature.signature.indexOf('base64,') + 7,
                  this.serviceSignature.signature.length
                )
              : null
          )
          .subscribe(
            (body) => {
              // console.log(body);
              if (body['Percentage_validity'] > 50) {
                this.setSignature(id);
              } else if (body['Percentage_validity'] < 50) {
                this.error('Error: Not a signature!');
                this.clear();
              }
            },
            (error) => {
              console.log('Signature detection failed.');
              this.error('Error:' + error.error || error.statusText, undefined, true);
              // alert('Error:' + error);
              console.log('Error:', error);
            }
          );
      } else {
        this.setSignature(id);
      }
    }
  }

  setSignature(id) {
    setTimeout(() => {
      var signatureImageObject = $('#signature' + id + '_img');
      if (signatureImageObject[0] == undefined)
        signatureImageObject = $('#signature' + this.serviceSignature.signatureTypeCd + '_img');
      signatureImageObject.attr('src', this.serviceSignature.signature).show();

      var signatureDtObject = $('#signature' + id + '_dt');
      if (signatureDtObject[0] == undefined)
        signatureDtObject = $('#signature' + this.serviceSignature.signatureTypeCd + '_dt');
      let systemDate = SettingService.getApplicationPropertiesValue('SYSTEMDATE');
      if (systemDate != undefined) {
        this.previousSignature = this.serviceSignature.signature;
        signatureDtObject.text(systemDate);
      }
    }, 10);
    var signatureImageObject = $('#signature' + id + '_img');
    if (signatureImageObject[0] == undefined)
      signatureImageObject = $('#signature' + this.serviceSignature.signatureTypeCd + '_img');
    signatureImageObject.attr('src', this.serviceSignature.signature).show();
    signatureImageObject.css('opacity', '1');
    if (this.signatureUploadPic != undefined) this.isSignatureDrawn = true;
    this.isSignatureDone.emit();
    if (!this.isSignatureDrawn) {
      // when we click on the ok button for 2 times it will null the signature.
      let signature = this.serviceSignature.signature != null ? this.serviceSignature.signature : null;
      var signatureImageObject = $('#signature' + this.serviceSignature.guid + '_img');
      if (signatureImageObject != undefined) {
        signatureImageObject.attr('src', signature).show();
        if (signature != undefined) {
          signatureImageObject.css('opacity', '1');
        } else {
          this.serviceSignature.signature = null;
          signatureImageObject.css('opacity', '0');
        }
      }
      this.service.setUpdated(this.serviceSignature);
    }
    if (!this.isSignatureButtonReq) this.hideSignatureBlock = false;
    this.isSignatureDrawn = false;
    // this.closePopup('signatureModal' + this.serviceSignature.guid);

    this.closePopup('signaturePad_' + this.serviceSignature.guid);
  }

  closeSignaturePopup() {
    let id = this.triggerBtnID != undefined ? this.triggerBtnID : this.serviceSignature.guid;
    var signatureImageObject = $('#signature' + id + '_img');
    if (this.serviceSignature.signature != undefined && this.previousSignature != undefined) {
      signatureImageObject.attr('src', this.previousSignature).show();
    }

    /**
     * commented because when we click on close button it was showing blank signature on screen.
     */

    // if (this.serviceSignature.signature == null || this.serviceSignature.signature.startsWith('ZLIBCMP')) {
    //   let emptySignatureUrl = this.signaturePad.toDataURL() != undefined ? this.signaturePad.toDataURL() : null;
    //   signatureImageObject.attr('src', emptySignatureUrl).show();
    // } else if (!this.serviceSignature.signature.startsWith('ZLIBCMP')) {
    //   signatureImageObject.css('opacity', '0');
    // }
    this.isSignatureDone.emit();
    if (!this.isSignatureButtonReq) {
      this.hideSignatureBlock = false;
    }
    this.closePopup('signatureModal' + this.serviceSignature.guid);
  }

  /**
   * It will return the previous signature.
   * @returns - String value.
   */
  private getPreviousSignature(): string {
    if (this.serviceSignature != undefined) {
      var signatureImageObject = $('#signature' + this.serviceSignature.guid + '_img');
      this.previousSignature = signatureImageObject.attr('src');
      return this.previousSignature;
    }
  }

  onInputFileClick(event) {
    event.target.value = '';
  }
  /**
   * It will upload image of signature.
   */
  async onFileChange(event: File[]) {
    this.isSignatureUploadClicked = true;
    if (event[0]) {
      let fileName = event[0].name;
      let ext = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
      if (this.allowed_FileTypes != undefined) {
        if (!this.isValueAvailableInList(this.allowed_FileTypes, ext)) {
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
          this.error(
            this.service.getMultilingualMessage('maxFileSize', [this.max_FileSize.toString()]),
            undefined,
            true
          );
          return false;
        } else {
          var reader = new FileReader();
          await reader.readAsDataURL(event[0]);
          reader.onload = (event: any) => {
            this.isSignatureDrawn = true;
            // this.signatureUploadPic =
            //   'data:image/png;base64,' + event.target.result.substr(event.target.result.indexOf(',') + 1);
            this.signatureUploadPic = event.target.result;
            this.serviceSignature.signature = this.signatureUploadPic;
            this.service.setUpdated(this.serviceSignature);
          };
        }
    }
  }
}
