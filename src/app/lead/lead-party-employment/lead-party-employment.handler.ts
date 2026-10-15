import { Component, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { LeadService } from '../services/lead.service';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadPartyEmploymentHandlerComponent extends BaseComponent<LeadService> implements OnChanges {
  public model: any;
  protected industryFieldItems: FieldItem[];
  public isOccupationIndustryDutySearchDisplayed: boolean;
  public industrySelectedOption: any;
  constructor(leadService: LeadService) {
    super(leadService);
    this.industrySelectedOption = undefined;
    this.industryFieldItems = [];
  }

  ngOnInit(): void {
    this.industryFieldItems = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['model'] && changes['model'].currentValue) {
      this.model = this.model;
    }
  }

  /*
  protected industryCd_change(item: FieldItem) {
    item.model.natureOfDuty = undefined;
    item.model.occupationCd = undefined;
  }

  protected natureOfDuty_change(item: FieldItem) {
    item.model.occupationCd = undefined;
  }
  */

  public onOccupationIndustrySearchSelected(selectedOption) {
    //here copy the industry, occupation , nature of duty from selected options and copy to the model
    //since property names match written in for loop.
    // Object.keys(selectedOption).forEach((item) => {
    //     if (this.model.hasOwnProperty(item))
    //         this.model[item] = selectedOption[item];
    // });
    this.industrySelectedOption = selectedOption;
    this.service.setModelFieldValue(this.model, 'industryCd', selectedOption['industryCd']);
    // this.service.setModelFieldValue(this.model, 'natureOfDuty', selectedOption['natureOfDuty']);
    // this.service.setModelFieldValue(this.model, 'occupationCd', selectedOption['occupationCd']);

    // let natureOfDutyItem = new FieldItem();
    // natureOfDutyItem = this.industryFieldItems.find((field: FieldItem) => field.fieldCd == 'natureOfDuty');
    // let occupationItem = new FieldItem();
    // occupationItem = this.industryFieldItems.find((field: FieldItem) => field.fieldCd == 'occupationCd');

    // this.service.setModelFieldValue(natureOfDutyItem.model, 'natureOfDuty', selectedOption['natureOfDuty']);
    // this.service.setModelFieldValue(occupationItem.model, 'occupationCd', selectedOption['occupationCd']);

    setTimeout(() => {
      this.getNatureOfDuty();
    }, 5);
  }

  getNatureOfDuty(item?: FieldItem) {
    let natureOfDutyItem =
      item != undefined
        ? item
        : this.industryFieldItems.find((field: FieldItem) => field.fieldCd == 'natureOfDuty');
    this.service.getNatureOfDuty(natureOfDutyItem, this.industrySelectedOption).subscribe(
      (body) => {
        let respNatureOfDuty: any;
        respNatureOfDuty = JSON.parse(JSON.stringify(body));

        if (this.industrySelectedOption != undefined) {
          this.service.setItemOptions(natureOfDutyItem, respNatureOfDuty.data.values, true);
          this.service.setModelFieldValue(
            natureOfDutyItem.model,
            'natureOfDuty',
            this.industrySelectedOption['natureOfDuty']
          );

          this.getOccupationCd();
        } else {
          setTimeout(() => {
            this.service.setItemOptions(natureOfDutyItem, respNatureOfDuty.data.values, true);
            this.getOccupationCd();
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
        : this.industryFieldItems.find((field: FieldItem) => field.fieldCd == 'occupationCd');
    if (occupationItem != undefined) {
      this.service.getOccupationCd(occupationItem, this.industrySelectedOption).subscribe(
        (body) => {
          let respOccupationCd: any;
          respOccupationCd = JSON.parse(JSON.stringify(body));
          setTimeout(() => {
            this.service.setItemOptions(occupationItem, respOccupationCd.data.values, true);
            if (this.industrySelectedOption != undefined) {
              this.service.setModelFieldValue(this.model, 'industryCd', this.industrySelectedOption['industryCd']);
              this.service.setModelFieldValue(
                this.model,
                'natureOfDuty',
                this.industrySelectedOption['natureOfDuty']
              );
              this.service.setModelFieldValue(
                this.model,
                'occupationCd',
                this.industrySelectedOption['occupationCd']
              );
            }
            // if (this.industryFieldItems != undefined) this.onIndustryFieldsCreated(this.industryFieldItems);
            // let model = this.model;
            // this.model = undefined;
            // setTimeout(() => {
            //   this.model = model;
            // }, 5);
          }, 10);
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    }
  }

  public onOccupationIndustryDutySearchClick(field: FieldItem) {
    this.industrySelectedOption = undefined;
    this.isOccupationIndustryDutySearchDisplayed = true;
    setTimeout(() => {
      this.openModal('OccupationIndustryDutySearch');
    }, 10);
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
  }

  public onPopupClose() {
    this.isOccupationIndustryDutySearchDisplayed = false;
  }
}
