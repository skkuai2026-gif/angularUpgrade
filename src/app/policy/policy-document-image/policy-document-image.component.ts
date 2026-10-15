import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from './../services/policy.service';
import { Component, OnInit, OnChanges, SimpleChanges, Input, ChangeDetectionStrategy } from '@angular/core';
import { PolicyDocumentImageHandlerComponent } from './policy-document-image.handler';

@Component({
  selector: 'sym-policy-document-image',
  templateUrl: './policy-document-image.component.html',
  styleUrls: ['./policy-document-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyDocumentImageComponent extends PolicyDocumentImageHandlerComponent implements OnChanges {
  @Input() imageModelList: any;
  @Input() document: any;
  @Input() isSelectCheckBoxReq: boolean;
  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService, settingService);
  }

  ngOnInit() {
    super.ngOnInit();
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
  addImage(event, fileName: string) {
    let respData: any;
    let imageContent = event; // event.target.result;
    let fileDataType = this.getFileDataType(fileName);
    let pdfCount = 0;
    let isSameFileExtension = true;
    if (fileDataType.match('pdf')) {
      pdfCount++;
    }
    if (this.imageModelList != null && this.imageModelList.length > 0) {
      for (let i = 0; i < this.imageModelList.length; i++) {
        let fileDataTypeImage = this.getFileDataType(this.imageModelList[i].fileLocation);
        if (fileDataTypeImage != undefined && fileDataTypeImage.match('pdf')) {
          pdfCount++;
        }
        if (fileDataTypeImage != undefined && fileDataTypeImage != fileDataType) {
          isSameFileExtension = false;
        }
      }
    }
    if (pdfCount > 1) {
      // this.error( `You cannot upload more than one file with pdf extension.`);
      this.error(this.settingService.getLabelValue('MULTIPLEPDFUI'));
      return;
    }
    if (!isSameFileExtension) {
      // this.error( `You cannot upload image/pdf with different extension.`);
      this.error(this.settingService.getLabelValue('DIFF_FILE_TYPE_CHECK_UI'));
      return;
    }
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
            if (successResponse['data']['error'] === 'ERR_DATAMISMATCH') {
              this.warningConfirm(
                this.settingService.getLabelValue('ocrFailMessage_dataMismatch') +
                  '. \n' +
                  successResponse['message'] +
                  '\n\n' +
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
  // isSelectCheckBoxReq this condition is removed in product code so overiding this method.
  onDeleteImageClick(index, imageModel) {
    this.uiImageModelList.splice(index, 1);
    /*Deleting from Image Model list since the response is not getting updated after delete */
    this.imageModelList.splice(index, 1);
    this.service.setDeleted(imageModel);
    if (this.uiImageModelList == null || (this.uiImageModelList != null && this.uiImageModelList.length == 0)) {
      this.document.selected = 'NO';
      this.document.disableOcrFl = 'NO';
    }
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      var files = event.target.files;

      let pdfCount = 0;
      let firstFileType = null;
      let isSameFileExtension = true;

      for (let i = 0; i < filesAmount; i++) {
        let fileDataType = this.getFileDataType(files[i].name);

        if (fileDataType && fileDataType.match('pdf')) {
          pdfCount++;
        }

        if (!firstFileType) {
          firstFileType = fileDataType;
        } else if (firstFileType != fileDataType) {
          isSameFileExtension = false;
        }
      }

      if (pdfCount > 1) {
        this.error(this.settingService.getLabelValue('MULTIPLEPDFUI'));
        return false;
      }

      if (!isSameFileExtension) {
        this.error(this.settingService.getLabelValue('DIFF_FILE_TYPE_CHECK_UI'));
        return false;
      }

      super.onFileChange(event);
    }
  }
}
