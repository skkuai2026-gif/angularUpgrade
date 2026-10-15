import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from './../services/policy.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { Component, OnInit, OnChanges, SimpleChanges, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyDocumentImageHandlerComponent extends BaseComponent<PolicyService> implements OnChanges {
  public imageModelList: any;
  public document: any;
  public uiImageModelList = [];
  public max_FileSize: number;
  public allowed_FileTypes: string[];
  public imageExtension: string[];
  public currViewImageModel: any;
  public isClearFileName: boolean;
  public acceptExtensionType: string;
  public captureCameraValue: string;
  public supportsFileExtMsg: string;
  protected isSelectCheckBoxReq: boolean;

  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService);
    this.isSelectCheckBoxReq = true;
    this.allowed_FileTypes = this.service.getApplicationPropertyValue('DOCUMENT_EXTENSIONS').split(',');
    this.imageExtension = this.service.getApplicationPropertyValue('IMAGE_EXTENSIONS').split(',');
    this.max_FileSize = parseInt(this.service.getApplicationPropertyValue('IMAGE_SIZE_LIMIT'));
    this.isClearFileName = false;
    this.acceptExtensionType = '';
    this.captureCameraValue = null;
    this.supportsFileExtMsg = this.allowed_FileTypes.toString();
  }

  ngOnInit() {
    this.loadUIImageModelList();
    this.checkExtensionType();
  }

  private loadUIImageModelList() {
    this.uiImageModelList = [];
    if (this.imageModelList != null && this.imageModelList.length > 0) {
      for (let i = 0; i < this.imageModelList.length; i++) {
        let fileDataType = this.getFileDataType(this.imageModelList[i].fileLocation);
        if (fileDataType != undefined) this.uiImageModelList.push(this.imageModelList[i]);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['imageModelList'] && changes['imageModelList'].currentValue) {
      this.loadUIImageModelList();
    }
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        let fileName = event.target.files[i].name;
        let ext = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
        if (!this.isValueAvailableInList(this.allowed_FileTypes, ext)) {
          this.error(
            this.service.getMultilingualMessage('fileTypeAllowed', [this.allowed_FileTypes.toString()]),
            undefined,
            true
          );

          return false;
        }

        if (this.max_FileSize != null && Math.round(event.target.files[i].size / 1024) > this.max_FileSize) {
          this.error(
            this.service.getMultilingualMessage('maxFileSize', [this.max_FileSize.toString()]),
            undefined,
            true
          );
          this.isClearFileName = true;
          return false;
        }
        if (
          this.service.getApplicationPropertyValue('IMAGE_EXTENSIONS') != undefined &&
          this.service.getApplicationPropertyValue('IMAGE_EXTENSIONS').includes(ext)
        ) {
          this.compressImage(event.target.files[i], fileName, 'addImage');
        } else {
          //for pdf we dont need to compress
          // file upload other than image file.
          var reader = new FileReader();
          reader.onload = (event: any) => {
            this.addImage(event.target.result, fileName);
          };
          reader.readAsDataURL(event.target.files[i]);
        }

        //   var reader = new FileReader();
        //   reader.onload = (event: any) => {
        //     //console.log(event.target.result);
        //     this.addImage(event, fileName);
        //   };

        //   reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  onBrowseClick(event) {
    $('#serviceDocUploadFiles_' + this.document.guid).trigger('click');
  }

  onCameraClick(event) {
    this.info('Work in Progress', undefined, true);
  }

  addImage(event, fileName: string) {
    let respData: any;
    let imageContent = event; // event.target.result;
    let fileDataType = this.getFileDataType(fileName);
    imageContent = imageContent.replace('data:' + fileDataType + ';base64,', '');
    let byPassOCR: boolean = false;
    this.service.addImage(imageContent, fileName, this.document).subscribe(
      (successResponse) => {
        if (successResponse['success'] == false) {
          if (
            successResponse['data']['File_Validation'] != undefined &&
            successResponse['data']['File_Validation'] == false
          ) {
            this.error(successResponse['message']);
          } else {
            this.warningConfirm(
              this.settingService.getLabelValue('ocrFailMessage') +
                '. \n' +
                successResponse['message'] +
                '\n' +
                this.settingService.getLabelValue('uploadFileConfirmation'),
              () => {
                this.document.disableOcrFl = 'YES';
                byPassOCR = true;
                this.afterOCRChanges(successResponse, respData, byPassOCR, imageContent, fileName);
              },
              () => {
                this.isClearFileName = true;
                this.afterOCRChanges(successResponse, respData, byPassOCR, imageContent, fileName);
              }
            );
          }
        } else if (successResponse['success'] == true) {
          this.afterOCRChanges(successResponse, respData, byPassOCR, imageContent, fileName);
        }
      },
      (error) => {
        console.log('Image added failed.');
        console.log('Error:', error);
      }
    );
  }

  afterOCRChanges(successResponse, respData, byPassOCR, imageContent, fileName) {
    this.document.selected = 'YES';
    if (successResponse['success'] == true || byPassOCR) {
      respData = JSON.parse(JSON.stringify(successResponse));
      respData.data.DocumentImage.fileContents = imageContent;
      respData.data.DocumentImage.fileLocation = fileName;
      if (respData.data.DocumentImage.status && respData.data.DocumentImage.status === 'N') {
        respData.data.DocumentImage.status = 'I';
      }
      this.imageModelList.push(respData.data.DocumentImage);
      this.uiImageModelList.push(respData.data.DocumentImage);
      console.log('Image added  successful.');
    }
  }

  onClickImage(event, imageModel: any) {
    this.currViewImageModel = undefined;
    setTimeout(() => {
      let ext = imageModel.fileLocation
        .substring(imageModel.fileLocation.lastIndexOf('.') + 1, imageModel.fileLocation.length)
        .toLowerCase();
      if (this.isImageExtension(imageModel.fileLocation)) {
        this.currViewImageModel = imageModel;
        setTimeout(() => {
          this.openModal('viewImage_' + imageModel.guid);
        }, 5);
      } else {
        this.onImageViewError(imageModel);
      }
    }, 5);
  }

  onImageViewError(imageModel) {
    setTimeout(() => {
      let ext = imageModel.fileLocation
        .substring(imageModel.fileLocation.lastIndexOf('.') + 1, imageModel.fileLocation.length)
        .toLowerCase();
      this.downloadOrOpenContent(imageModel.fileContents, ext, imageModel.fileLocation, false); // this.
    }, 10);
  }

  onDeleteImageClick(index, imageModel) {
    this.uiImageModelList.splice(index, 1);
    /*Deleting from Image Model list since the response is not getting updated after delete */
    this.imageModelList.splice(index, 1);
    this.service.setDeleted(imageModel);
    if (
      !this.isSelectCheckBoxReq &&
      (this.uiImageModelList == null || (this.uiImageModelList != null && this.uiImageModelList.length == 0))
    ) {
      this.document.selected = 'NO';
      this.document.disableOcrFl = 'NO';
    }
  }

  isImageExtension(fileName: string): boolean {
    if (fileName == null) return false;
    let ext = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
    // let validExtensions:string[]=["jpg","bmp","gif","png"];
    return this.imageExtension.includes(ext);
  }

  viewFile(fileContents: string, fileName: string) {
    this.downloadOrOpenContent(fileContents, undefined, fileName, true, { width: 400, height: 400 });
  }

  onInputFileClick(event) {
    event.target.value = '';
    if (this.isClearFileName) {
      // event.target.value = '';
      this.isClearFileName = false;
    }
    //Added to prevent the default functionality of file selection dialog box popup being opened if the acceptExtensionType is null.
    //This should not be done in Mobile, to allow capture image/video.
    if (this.allowed_FileTypes.includes('@camera') && !this.service.isMobileViewRendered()) {
      event.preventDefault();
    }
  }

  private checkExtensionType() {
    //Added to directly open the camera on the Mobile/IPad on click of the add file in document when added in the allowedFileTypes in the Application table.
    if (this.allowed_FileTypes.includes('@camera')) {
      this.captureCameraValue = 'environment';
      this.supportsFileExtMsg = this.allowed_FileTypes
        .filter((fileType) => fileType !== '@camera') // Exclude '@camera' for the message
        .toString();
    }
    this.allowed_FileTypes.forEach((ext) => {
      this.acceptExtensionType += ',' + this.service.getValueFromLookup('FILEDATATYPE', ext);
    });
  }
}
