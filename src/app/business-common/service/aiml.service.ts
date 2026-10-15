import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/system-common/services/base.service';
import { SettingService } from 'src/app/system-common/services/setting.service';

@Injectable()
export class AimlService extends BaseService {
  constructor(http: HttpClient, settingService: SettingService) {
    super(http, settingService, 'AIML');
  }
  public init(modelNameList: string[]) {
    return null;
  }

  public load(id: any, modelNameList: string[], isMetadataReqd?: boolean) {
    return null;
  }

  public process(id: any, modelNameList: string[]) {
    return null;
  }

  public find(executeSearch?: boolean, searchCriteriaData?: any) {
    return null;
  }

  /**
   * This is used to call AIML API to compare the images
   *  @param documentImage this expects binary image
   * @param uploadedFile this expects file
   * @param capturedImage  this expects binary image
   * @returns
   */
  detectSignature(signatureUploadedFile: File, signatureBaseFormat: any) {
    let path = this.getURLValue('AIML');
    const data: FormData = new FormData();
    if (signatureUploadedFile != undefined) data.append('sign1_file', signatureUploadedFile);
    if (signatureBaseFormat != undefined) data.append('sign1_binary', signatureBaseFormat);
    return this.http.post(`${path}/detect_signature_classifier/`, data);
  }

  /**
   * This is used to call AIML API to compare the images
   *  @param documentImage this expects binary image
   * @param uploadedFile this expects file
   * @param capturedImage  this expects binary image
   * @returns
   */
  compareImage(documentImage, uploadedFile?, capturedImage?) {
    let path = this.getURLValue('AIML');
    const data: FormData = new FormData();
    if (uploadedFile != undefined) data.append('image1_file', uploadedFile);
    data.append('image2_binary', documentImage);
    if (capturedImage != undefined) data.append('image1_binary', capturedImage);

    return this.http.post(`${path}/image_comparison_binary/`, data);
  }
}
