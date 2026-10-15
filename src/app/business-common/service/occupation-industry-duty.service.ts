import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseService } from 'src/app/system-common/services/base.service';
import { FieldItem } from 'src/app/models/common/field-item';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class OccupationIndustryDutyService extends BaseService {
  public industrySelectedOption: any;
  public industryFieldItems: any;
  public model: any;

  constructor(http: HttpClient, settingService: SettingService) {
    super(http, settingService);
    this.industrySelectedOption = undefined;
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
    return this.getOccupationIndustryDutySearch(executeSearch, searchCriteriaData);
  }

  public getOccupationIndustryDutySearch(executeSearch?: boolean, searchCriteriaData?: any) {
    return this.getSearchList('SearchIndustryOccupation', executeSearch, searchCriteriaData);
  }

  getNatureOfDutyObject(item: FieldItem, selectedOption?: any): Observable<Object> {
    let industryCd =
      selectedOption != undefined && selectedOption['industryCd'] != undefined
        ? selectedOption['industryCd']
        : item.model.industryCd != undefined
        ? item.model.industryCd
        : undefined;

    let body = {
      onlineLookupKey: 'NATUREOFDUTY',
      onlineFilterCond: {
        industryCd: industryCd,
      },
      offlineLookupKey: 'NATUREOFDUTY',
      offlineFilterCond: {
        industryCd: industryCd,
      },
    };
    return this.httpPost(`${this.getURLValue('LOOKUP')}/loadLookupData`, body, undefined, false);
  }
  getOccupationCdObject(item: FieldItem, selectedOption?: any): Observable<Object> {
    let natureOfDuty =
      selectedOption != undefined && selectedOption['natureOfDuty'] != undefined
        ? selectedOption['natureOfDuty']
        : item.model.natureOfDuty != undefined
        ? item.model.natureOfDuty
        : undefined;
    let industryCd =
      selectedOption != undefined && selectedOption['industryCd'] != undefined
        ? selectedOption['industryCd']
        : item.model.industryCd
        ? item.model.industryCd
        : undefined;

    let body = {
      onlineLookupKey: 'OCCUPATION',
      onlineFilterCond: {
        natureOfDutyCd: natureOfDuty,
        industryCd: industryCd,
      },
      offlineLookupKey: 'INDUSTRYOCCUPATION',
      offlineFilterCond: {
        natureOfDutyCd: natureOfDuty,
        industryCd: industryCd,
      },
    };
    return this.httpPost(`${this.getURLValue('LOOKUP')}/loadLookupData`, body, undefined, false);
  }

  public industryCd_change(item: FieldItem) {
    this.setModelFieldValue(item.model, 'natureOfDuty', undefined);
    this.setModelFieldValue(item.model, 'occupationCd', undefined);
    if (this.industryFieldItems != undefined) {
      let natureOfDutyFieldItem: FieldItem;
      this.industryFieldItems.filter((industryFieldItem: FieldItem) => {
        if (industryFieldItem.fieldCd == 'natureOfDuty') natureOfDutyFieldItem = industryFieldItem;
      });
      if (natureOfDutyFieldItem != undefined) this.getNatureOfDuty();
      // if (item != undefined && natureOfDutyFieldItem != undefined) this.getNatureOfDuty();
    }
  }

  public natureOfDuty_change(item: FieldItem) {
    if (this.industryFieldItems != undefined) {
      let occupationCdFieldItem: FieldItem;
      this.industryFieldItems.filter((industryFieldItem: FieldItem) => {
        if (industryFieldItem.fieldCd == 'occupationCd') occupationCdFieldItem = industryFieldItem;
      });
      if (occupationCdFieldItem != undefined) this.getOccupationCd(occupationCdFieldItem);
    }
  }

  public onOccupationIndustrySearchSelected(selectedOption) {
    //here copy the industry, occupation , nature of duty from selected options and copy to the model
    //since property names match written in for loop.
    // Object.keys(selectedOption).forEach((item) => {
    //     if (this.model.hasOwnProperty(item))
    //         this.model[item] = selectedOption[item];
    // });
    this.industrySelectedOption = selectedOption;
    this.setModelFieldValue(this.model, 'industryCd', selectedOption['industryCd']);
    setTimeout(() => {
      this.getNatureOfDuty();
    }, 5);
  }

  getNatureOfDuty(item?: FieldItem) {
    let natureOfDutyItem =
      item != undefined
        ? item
        : this.industryFieldItems.find((field: FieldItem) => field.fieldCd === 'natureOfDuty');
    this.getNatureOfDutyObject(natureOfDutyItem, this.industrySelectedOption).subscribe(
      (body) => {
        let respNatureOfDuty: any;
        respNatureOfDuty = JSON.parse(JSON.stringify(body));

        if (this.industrySelectedOption != undefined) {
          if (natureOfDutyItem.fieldCd === 'natureOfDuty')
            this.setItemOptions(natureOfDutyItem, respNatureOfDuty.data.values, true);
          this.setModelFieldValue(
            natureOfDutyItem.model,
            'natureOfDuty',
            this.industrySelectedOption['natureOfDuty']
          );
          this.getOccupationCd();
        } else {
          setTimeout(() => {
            // this.setItemOptions(natureOfDutyItem, respNatureOfDuty.data.values, false);
            setTimeout(() => {
              this.setItemOptions(natureOfDutyItem, respNatureOfDuty.data.values, true);
              this.getOccupationCd();
            }, 10);
          }, 50);
        }
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  getOccupationCd(item?: FieldItem) {
    let occupationItem =
      item != undefined
        ? item
        : this.industryFieldItems.find((field: FieldItem) => field.fieldCd === 'occupationCd');
    if (occupationItem != undefined) {
      this.getOccupationCdObject(occupationItem, this.industrySelectedOption).subscribe(
        (body) => {
          let respOccupationCd: any;
          respOccupationCd = JSON.parse(JSON.stringify(body));
          setTimeout(() => {
            if (occupationItem.fieldCd === 'occupationCd')
              this.setItemOptions(occupationItem, respOccupationCd.data.values, true);
            if (this.industrySelectedOption != undefined) {
              this.setModelFieldValue(this.model, 'industryCd', this.industrySelectedOption['industryCd']);
              this.setModelFieldValue(this.model, 'natureOfDuty', this.industrySelectedOption['natureOfDuty']);
              this.setModelFieldValue(this.model, 'occupationCd', this.industrySelectedOption['occupationCd']);
            }
          }, 10);
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    }
  }
}
