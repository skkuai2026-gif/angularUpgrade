import { SettingService } from 'src/app/system-common/services/setting.service';
import { Component, OnChanges, OnInit, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { QuotationService } from '../services/quotation.service';
import { OccupationIndustryDutyService } from 'src/app/business-common/service/occupation-industry-duty.service';
import { QuotationModule } from '../quotation.module';
import { DynamicComponentList } from '../services/dynamic-component-list';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationPartyHandlerComponent extends BaseComponent<QuotationService> implements OnChanges {
  public model: any;
  public contactReqd: boolean;
  public isOccupationIndustryDutySearchDisplayed: boolean;
  protected industryFieldItems: FieldItem[];
  public industrySelectedOption: any;
  industryService;
  constructor(quotationService: QuotationService, public settingService: SettingService) {
    super(quotationService);
    this.contactReqd = false;
    this.industrySelectedOption = undefined;
    this.industryFieldItems = [];
  }

  ngOnInit(): void {
    this.industryFieldItems = [];
    this.industryService = new OccupationIndustryDutyService(this.service.http, this.settingService);
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  protected title_change(item: FieldItem) {
    this.service.getGenderForTitle(item.model);
  }

  protected dob_change(item: FieldItem) {
    item.model.age = undefined;
    this.service.computeAge(item.model);
  }

  protected age_change(item: FieldItem) {
    if (item.event != undefined) {
      // this.service.setModelFieldValue(item.model, 'dob', undefined, false);
      this.service.setModelFieldValue(item.model, 'dob', undefined);
      this.service.computeAge(item.model);
    }
  }

  public age_keyDown(item: FieldItem) {
    // this.service.setModelFieldValue(item.model, 'dob', undefined, false);
    this.service.setModelFieldValue(item.model, 'dob', undefined);
  }

  protected genderCd_change(item: FieldItem) {
    this.service.setModelFieldValue(item.model, 'relationCd', undefined);
  }

  protected relationCd_focus(item: FieldItem) {
    this.service.getRelationForGender(item);
  }

  protected industryCd_change(item: FieldItem) {
    this.industryService.industryCd_change(item);
  }

  protected natureOfDuty_change(item: FieldItem) {
    this.industryService.natureOfDuty_change(item);
  }

  protected coverageCountryCd_change(item: FieldItem) {
    // item.model.coverageCityCd = undefined;
    this.service.setModelFieldValue(item.model, 'coverageCityCd', undefined);
  }
  protected coverageCityCd_focus(item: FieldItem) {
    this.service.getCoverageCityCd(item);
  }

  public onOccupationIndustrySearchSelected(selectedOption) {
    this.industryService.industrySelectedOption = selectedOption;
    this.industryService.onOccupationIndustrySearchSelected(selectedOption);
  }

  public onOccupationIndustryDutySearchClick(field: FieldItem) {
    this.industrySelectedOption = undefined;
    this.isOccupationIndustryDutySearchDisplayed = true;
    setTimeout(() => {
      let id = this.model == undefined ? field.model.guid : this.model.guid;
      this.openModal('OccupationIndustryDutySearch' + id);
    }, 20);
  }

  public onIndustryFieldsCreated(fieldItemArray: FieldItem[]) {
    if (this.industryFieldItems != undefined) {
      fieldItemArray.filter((item) => {
        let index = this.industryFieldItems.findIndex((field: FieldItem) => field.fieldCd == item.fieldCd);
        let isAvailable = this.industryFieldItems.find((field: FieldItem) => field.fieldCd == item.fieldCd);
        if (!isAvailable) this.industryFieldItems.push(item);
        if (isAvailable) this.industryFieldItems[index] = item;
      });
    } else {
      this.industryFieldItems = fieldItemArray;
    }
    this.industryService.industryFieldItems = this.industryFieldItems;
    this.industryService.model = this.model;
  }
}
