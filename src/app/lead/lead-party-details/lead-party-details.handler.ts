import { Component, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { ResponseIO } from 'src/app/models/responseIO';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { LeadService } from '../services/lead.service';
import { NavigationLink } from './../../models/common/navigation-link';
import { SettingService } from 'src/app/system-common/services/setting.service';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadPartyDetailsHandlerComponent extends BaseComponent<LeadService> implements OnChanges {
  public model: any;
  public modelPath: string;
  navigationLinkList: NavigationLink[];
  max_FileSize: number;
  allowed_FileTypes: string[];
  imageExtension: string[];
  isOCRReq: boolean;

  constructor(leadService: LeadService) {
    super(leadService);

    this.allowed_FileTypes = this.service.getApplicationPropertyValue('IMAGE_EXTENSIONS').split(',');
    //this.imageExtension = this.service.getApplicationPropertyValue('IMAGE_EXTENSIONS').split(',');
    this.max_FileSize = parseInt(this.service.getApplicationPropertyValue('IMAGE_SIZE_LIMIT'));
    this.isOCRReq = SettingService.getApplicationPropertiesValue('OCR_ENABLED') == 'YES' ? true : false;
  }

  ngOnInit() {
    this.modelPath = 'LeadParty';
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this.loadNavigationLinkList();
  }

  protected titleCd_change(item: FieldItem) {
    this.service.getGenderForTitle(item.model);
  }

  protected birthDt_change(item: FieldItem) {
    // item.model.age = undefined;
    this.service.computeAge(item.model);
  }

  // protected age_change(item: FieldItem) {
  //   //only if editable trigger compute birtdate since it gets recursive
  //   if (this.service.getFieldMetadataPropertyValue(item.model, 'age', 'ENABLED') != 'NO') {
  //     item.model.birthDt = undefined;
  //     this.service.computeAge(item.model);
  //   }
  // }
  public age_keyDown(item: FieldItem) {
    this.service.setModelFieldValue(item?.model, 'birthDt', undefined);
  }
  protected genderCd_change(item: FieldItem) {
    item.model.relationCd = '';
  }

  protected relationCd_focus(item: FieldItem) {
    this.service.getRelationForGender(item);
  }

  protected coverageCountryCd_change(item: FieldItem) {
    // item.model.coverageCityCd = '';
    this.service.setModelFieldValue(item.model, 'coverageCityCd', '');
  }
  protected coverageCityCd_focus(item: FieldItem) {
    this.service.getCoverageCityCd(item);
  }
  protected partyTypeCd_change() {
    this.loadNavigationLinkList();
  }

  onButtonOCRClick(event) {
    $('#docUploadFiles').trigger('click');
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        let fileName = event.target.files[i].name;
        let ext = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
        if (this.allowed_FileTypes != null && !this.allowed_FileTypes.includes(ext)) {
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

          return false;
        }
        var reader = new FileReader();
        reader.onload = (event: any) => {
          //console.log(event.target.result);
          this.populateOCRData(event, fileName);
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  populateOCRData(event, fileName: string) {
    let respData: any;
    let imageContent = event.target.result;
    let fileDataType = this.getFileDataType(fileName);
    imageContent = imageContent.replace('data:' + fileDataType + ';base64,', '');
    this.service.populateOCRData(imageContent).subscribe(
      (successResponse) => {
        if (successResponse['success'] == true) {
          respData = JSON.parse(JSON.stringify(successResponse));
          //console.log("Party: "+ respData.data.Party);
          this.service.responseIO.data.LeadParty = respData.data.Party;
          //Need to clone the responseIO since it should get updated for the components
          //to detect the changes and reflect on UI.
          let clonedRespIO: ResponseIO = new ResponseIO();
          clonedRespIO = clonedRespIO.copyFrom(this.service.responseIO);
          this.service.responseIO = clonedRespIO;
          // this.service.responseIO.callOnChange = true;
          //the array variables are not refreshed
          // let identList = JSON.parse(JSON.stringify(this.service.responseIO.data.LeadParty.IdentityList));

          this.model = this.service.responseIO.data.LeadParty;
          //Call callValidation method in postPopulateOCRData if need to trigger on change of other fields
          //this.callValidation();
          this.postPopulateOCRData();
          console.log('Populate OCR data successful.');
        } else {
          this.error(successResponse['message'], undefined, true);
        }
      },
      (error) => {
        console.log('Populate OCR data failed.');
        console.log('Error:', error);
      }
    );
  }

  //need to override post populate ocr data...if you want to do something
  protected postPopulateOCRData() {
    this.callValidation();
  }

  getFileDataType(fileName: string) {
    let ext = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
    let fileDataType = this.service.getValueFromLookup('FILEDATATYPE', ext);
    return fileDataType;
  }

  protected loadNavigationLinkList() {
    if (this.model != null) {
      this.navigationLinkList = [];
      let nav = new NavigationLink();
      if (this.model.partyTypeCd === 'INDIVIDUAL') {
        nav.link = 'basic_Details_Body';
        nav.labelKey = 'PartyDetails';
      } else {
        nav.link = 'basic_Details_Body';
        nav.labelKey = 'corporateDetails';
      }
      this.navigationLinkList.push(nav);

      nav = new NavigationLink();
      nav.link = 'address_Details_Body';
      nav.labelKey = 'ADDRESSINFORMATION';

      this.navigationLinkList.push(nav);

      nav = new NavigationLink();
      nav.link = 'contact_Details_Body';
      nav.labelKey = 'CONTACTDETAILS';
      this.navigationLinkList.push(nav);

      if (this.model.partyTypeCd === 'INDIVIDUAL') {
        if (this.model.Employment != undefined) {
          nav = new NavigationLink();
          nav.link = 'Employment_Body';
          nav.labelKey = 'employmentHeader';
          this.navigationLinkList.push(nav);
        }
        if (this.model.IdentityList != undefined) {
          nav = new NavigationLink();
          nav.link = 'IdentityList_Body';
          nav.labelKey = 'identityHeader';

          this.navigationLinkList.push(nav);
        }

        if (this.model.OtherIncomeList != undefined) {
          nav = new NavigationLink();
          nav.link = 'OtherIncomeList_Body';
          nav.labelKey = 'otherSourceIncome';
          this.navigationLinkList.push(nav);
        }
        nav = new NavigationLink();
        nav.link = 'nationalityDetails_Body';
        nav.labelKey = 'nationalityDetails';

        this.navigationLinkList.push(nav);
      }
    }
  }
}
